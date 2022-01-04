import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { addHexPrefix } from 'ethereumjs-util'
import { ethers } from 'ethers'
import clone from 'lodash/cloneDeep'
import BRIDGE_ABI from '@shared/contract-abis/bridge'
import { UPDATE_CROSS_CHAIN_STATE } from '@view/store/actionConstants'
import { GAS_ESTIMATE_TYPES, GAS_LIMITS } from '@shared/constants/gas'
import {
  expandDecimals,
  hexToString,
} from '@view/helpers/utils/conversions.util'
import { subtractCurrencies } from '@shared/modules/conversion.utils'
import { MIN_GAS_LIMIT_HEX } from '@pages/send/constants'
import { addGasBuffer, calcGasTotal } from '@pages/send/utils'
import {
  addPollingTokenToAppState,
  disconnectGasFeeEstimatePoller,
  estimateGas,
  getGasFeeEstimatesAndStartPolling,
  removePollingTokenFromAppState,
} from '@view/store/actions'
export const initialState = {
  coinAddress: '',
  from: '',
  dest: '',
  fromChain: '',
  destChain: '',
  userInputValue: '',
  supportChains: [],
  target: null,
  nativeMaxAmount: '0x0',
  nativeMaxSendAmount: '0',
  maxSendAmount: '0',
  targetCoinAddress: '',
  tokenDecimals: 18,
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

  try {
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
  } catch (e) {
    return addHexPrefix(blockGasLimit)
  }
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

    try {
      const gasTotal = calcGasTotal(gasLimitEstimated, gasPrice)
      let nativeMaxAmount = addHexPrefix(
        subtractCurrencies(balance, addHexPrefix(gasTotal), {
          toNumericBase: 'hex',
          aBase: 16,
          bBase: 16,
        }),
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
    } catch (e) {
      console.log(e)
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
        Object.keys(action.value).forEach(
          (key) => (state[key] = action.value[key]),
        )
      })
      .addCase(initializeCrossState.fulfilled, (state, action) => {
        state.gas = action.payload.gas
        state.nativeMaxAmount = action.payload.nativeMaxAmount
        state.nativeMaxSendAmount = new BigNumber(
          hexToString(state.nativeMaxAmount),
        ).toString()
      })
  },
})
const { reducer: crossChainReducer } = crossChainSlice
export default crossChainReducer
