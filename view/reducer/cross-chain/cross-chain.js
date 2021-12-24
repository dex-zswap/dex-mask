import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { addHexPrefix } from 'ethereumjs-util'
import { ethers } from 'ethers'
import clone from 'lodash/cloneDeep'
import BRIDGE_ABI from '@shared/contract-abis/bridge'
import { UPDATE_CROSS_CHAIN_STATE } from '@view/store/actionConstants'
import { GAS_ESTIMATE_TYPES, GAS_LIMITS } from '@shared/constants/gas'
import {
  expandDecimals,
  subtractCurrencies,
} from '@view/helpers/utils/conversions.util'
import { MIN_GAS_LIMIT_HEX } from '@pages/send/constants'
import { addGasBuffer, calcGasTotal } from '@pages/send/utils'
import {
  addPollingTokenToAppState,
  disconnectGasFeeEstimatePoller,
  displayWarning,
  estimateGas,
  getGasFeeEstimatesAndStartPolling,
  hideLoadingIndication,
  removePollingTokenFromAppState,
  showConfTxPage,
  showLoadingIndication,
  updateTokenType,
  updateTransaction,
} from '@view/store/actions'
export const initialState = {
  coinAddress: '0x0000000000000000000000000000000000000000',
  coinSymbol: 'DEX',
  from: '0xd13048c66098d05f42990c75e1fe318975f693f4',
  dest: '',
  fromChain: '0x36fa9e',
  destChain: '0x3782dace9d900000',
  userInputValue: '',
  supportChains: [],
  target: {
    chain_id: '1',
    max: '10000000000',
    min: '0',
    resource_id:
      '0x0000000000000000000000000000000000000000000000000000000000000003',
    fee: '0',
    bridge: '0x723DDa7Cf9c8231350b0095A7fA395Baf94B0e4D',
    handler: '0x5D6406Ee38F9F7D219506A7086078d147687B3d8',
    target_symbol: 'RINK_ETH',
    target_token_address: '0xff406927872185ad8e2647ef67e103e8696287c1',
    target_token: 'RINK_DEX',
    target_token_name: 'RINK_DEX',
    target_meta_chain_id: '4',
    target_chain_id: '0',
  },
  targetCoinAddress: '0xff406927872185ad8e2647ef67e103e8696287c1',
  targetCoinSymbol: 'RINK_DEX',
  chainTokens: [],
  gas: {
    gasLimit: '0x0',
    gasPrice: '0x0',
    gasTotal: '0x0',
    gasEstimatePollToken: null,
  },
}
const name = 'crossChain'

const estimateGasLimitForCross = async ({
  from,
  to,
  resourceId,
  targetChanId,
  inputValue = '0',
  isNativeAsset,
  gasPrice,
  fee,
}) => {
  const blockGasLimit = MIN_GAS_LIMIT_HEX
  const bufferMultiplier = 1.5
  const abiInterface = new ethers.utils.Interface(BRIDGE_ABI)
  const sendData = [
    '0x',
    ethers.utils
      .hexZeroPad(
        ethers.BigNumber.from(expandDecimals(inputValue)).toHexString(),
        32,
      )
      .substr(2),
    ethers.utils
      .hexZeroPad(ethers.utils.hexlify((from.length - 2) / 2), 32)
      .substr(2),
    from.substr(2),
  ].join('')
  const data = abiInterface.encodeFunctionData('deposit', [
    targetChanId,
    resourceId,
    sendData,
  ])
  const value = isNativeAsset
    ? ethers.utils.hexZeroPad(
        ethers.BigNumber.from(expandDecimals(fee))
          .add(expandDecimals(inputValue))
          .toHexString(),
        32,
      )
    : ethers.utils.hexZeroPad(
        ethers.BigNumber.from(expandDecimals(fee)).toHexString(),
        32,
      )
  const estimatedGasLimit = await estimateGas({
    from,
    to,
    value,
    data,
    gasPrice,
  })
  const estimateWithBuffer = addGasBuffer(
    estimatedGasLimit,
    blockGasLimit,
    bufferMultiplier,
  )
  return addHexPrefix(estimateWithBuffer)
}

export const initializeCrossState = createAsyncThunk(
  'cross/initializeCrossState',
  async (balance, thunkApi) => {
    const state = thunkApi.getState()
    const { crossChain, metamask } = state
    const isNativeAsset =
      crossChain.coinAddress === ethers.constants.AddressZero
    const gasEstimatePollToken = await getGasFeeEstimatesAndStartPolling()
    addPollingTokenToAppState(gasEstimatePollToken)
    const {
      metamask: { gasFeeEstimates, gasEstimateType },
    } = thunkApi.getState()
    let gasPrice = '0x1'
    let gasLimit = GAS_LIMITS.SIMPLE

    if (gasEstimateType === GAS_ESTIMATE_TYPES.LEGACY) {
      gasPrice = getGasPriceInHexWei(gasFeeEstimates.medium)
    } else if (gasEstimateType === GAS_ESTIMATE_TYPES.ETH_GASPRICE) {
      gasPrice = getRoundedGasPrice(gasFeeEstimates.gasPrice)
    } else if (gasEstimateType === GAS_ESTIMATE_TYPES.FEE_MARKET) {
      gasPrice = getGasPriceInHexWei(
        gasFeeEstimates.medium.suggestedMaxFeePerGas,
      )
    } else {
      gasPrice = gasFeeEstimates.gasPrice
        ? getRoundedGasPrice(gasFeeEstimates.gasPrice)
        : '0x1'
    }

    const gasLimitEstimated = await estimateGasLimitForCross({
      isNativeAsset,
      from: crossChain.from,
      to: crossChain.from,
      resourceId: crossChain.target.resource_id,
      targetChanId: crossChain.target.target_chain_id,
      fee: crossChain.target.fee,
      isNativeAsset,
      gasPrice,
    })
    const gasTotal = calcGasTotal(gasLimitEstimated, gasPrice)
    let nativeMaxAmount = addHexPrefix(
      subtractCurrencies(addHexPrefix(balance), addHexPrefix(gasTotal)),
    )

    if (parseFloat(nativeMaxAmount) < 0) {
      nativeMaxAmount = '0'
    }

    return {
      gas: {
        gasPrice,
        gasTotal,
        gasEstimatePollToken,
        gasLimit: gasLimitEstimated,
      },
      nativeMaxAmount,
    }
  },
)
export const disposePollingGas = () => {
  return async (dispatch, getState) => {
    const {
      [name]: {
        gas: { gasEstimatePollToken },
      },
    } = getState()

    if (gasEstimatePollToken) {
      await disconnectGasFeeEstimatePoller(gasEstimatePollToken)
      removePollingTokenFromAppState(gasEstimatePollToken)
    }
  }
}
const crossChainSlice = createSlice({
  name,
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(UPDATE_CROSS_CHAIN_STATE, (state, action) => {
        const stateCloned = clone(state)
        state = Object.assign({}, stateCloned, action.value)
      })
      .addCase(initializeCrossState.fulfilled, (state, action) => {
        state.gas = action.value.gas
        state.nativeMaxAmount = action.value.nativeMaxAmount
      })
  },
})
const { reducer: crossChainReducer } = crossChainSlice
export default crossChainReducer
