import { connect } from 'react-redux'
import { addHexPrefix } from '@app/scripts/lib/util'
import { MIN_GAS_LIMIT_DEC } from '@pages/send/constants'
import { calcGasTotal, isBalanceSufficient } from '@pages/send/utils'
import { updateTransactionGasFees } from '@reducer/dexmask/dexmask'
import {
  resetCustomData,
  setCustomGasLimit,
  setCustomGasPrice,
} from '@reducer/gas/gas.duck'
import {
  ASSET_TYPES,
  getGasLimit,
  getGasPrice,
  getSendAmount,
  getSendAsset,
  getSendMaxModeState,
  updateGasLimit,
  updateGasPrice,
  useCustomGas,
} from '@reducer/send'
import { GAS_LIMITS } from '@shared/constants/gas'
import { TRANSACTION_STATUSES } from '@shared/constants/transaction'
import {
  addHexes,
  getValueFromWeiHex,
  hexWEIToDecGWEI,
  subtractHexWEIsToDec,
  sumHexWEIsToRenderableFiat,
} from '@view/helpers/utils/conversions.util'
import { formatETHFee } from '@view/helpers/utils/formatters'
import {
  conversionRateSelector as getConversionRate,
  getAveragePriceEstimateInHexWEI,
  getBasicGasEstimateLoadingStatus,
  getCurrentCurrency,
  getCurrentEthBalance,
  getCustomGasLimit,
  getCustomGasPrice,
  getDefaultActiveButtonIndex,
  getIsCustomNetworkGasPriceFetched,
  getIsGasEstimatesFetched,
  getIsMainnet,
  getIsTestnet,
  getRenderableBasicEstimateData,
  getShouldShowFiat,
  isCustomPriceExcessive,
  isCustomPriceSafe,
  isCustomPriceSafeForCustomNetwork,
} from '@view/selectors'
import {
  createRetryTransaction,
  createSpeedUpTransaction,
  hideModal,
  hideSidebar,
} from '@view/store/actions'
import GasModalPageContainer from './component'

const mapStateToProps = (state, ownProps) => {
  const gasLimit = getGasLimit(state)
  const gasPrice = getGasPrice(state)
  const amount = getSendAmount(state)
  const { currentNetworkTxList } = state.metamask
  const { modalState: { props: modalProps } = {} } = state.appState.modal || {}
  const { txData = {} } = modalProps || {}
  const { transaction = {}, onSubmit } = ownProps
  const selectedTransaction = currentNetworkTxList.find(
    ({ id }) => id === (transaction.id || txData.id),
  )
  const buttonDataLoading = getBasicGasEstimateLoadingStatus(state)
  const asset = getSendAsset(state) // a "default" txParams is used during the send flow, since the transaction doesn't exist yet in that case

  const txParams = selectedTransaction?.txParams
    ? selectedTransaction.txParams
    : {
        gas: gasLimit || GAS_LIMITS.SIMPLE,
        gasPrice: gasPrice || getAveragePriceEstimateInHexWEI(state, true),
        value: asset.type === ASSET_TYPES.TOKEN ? '0x0' : amount,
      }
  const { gasPrice: currentGasPrice, gas: currentGasLimit } = txParams
  const value = ownProps.transaction?.txParams?.value || txParams.value
  const customModalGasPriceInHex = getCustomGasPrice(state) || currentGasPrice
  const customModalGasLimitInHex =
    getCustomGasLimit(state) || currentGasLimit || GAS_LIMITS.SIMPLE
  const customGasTotal = calcGasTotal(
    customModalGasLimitInHex,
    customModalGasPriceInHex,
  )
  const gasButtonInfo = getRenderableBasicEstimateData(
    state,
    customModalGasLimitInHex,
  )
  const currentCurrency = getCurrentCurrency(state)
  const conversionRate = getConversionRate(state)
  const newTotalFiat = sumHexWEIsToRenderableFiat(
    [value, customGasTotal],
    currentCurrency,
    conversionRate,
  )
  const { hideBasic } = state.appState.modal.modalState.props
  const customGasPrice = calcCustomGasPrice(customModalGasPriceInHex)
  const maxModeOn = getSendMaxModeState(state)
  const balance = getCurrentEthBalance(state)
  const isMainnet = getIsMainnet(state)
  const isTestnet = getIsTestnet(state)
  const showFiat = getShouldShowFiat(state)
  const newTotalEth =
    maxModeOn && asset.type === ASSET_TYPES.NATIVE
      ? sumHexWEIsToRenderableEth([balance, '0x0'])
      : sumHexWEIsToRenderableEth([value, customGasTotal])
  const sendAmount =
    maxModeOn && asset.type === ASSET_TYPES.NATIVE
      ? subtractHexWEIsFromRenderableEth(balance, customGasTotal)
      : sumHexWEIsToRenderableEth([value, '0x0'])
  const insufficientBalance = maxModeOn
    ? false
    : !isBalanceSufficient({
        amount: value,
        gasTotal: customGasTotal,
        balance,
        conversionRate,
      })
  const isGasEstimate = getIsGasEstimatesFetched(state)
  const customNetworkEstimateWasFetched = getIsCustomNetworkGasPriceFetched(
    state,
  )
  let customPriceIsSafe = true

  if ((isMainnet || process.env.IN_TEST) && isGasEstimate) {
    customPriceIsSafe = isCustomPriceSafe(state)
  } else if (
    !(isMainnet || process.env.IN_TEST || isTestnet) &&
    customNetworkEstimateWasFetched
  ) {
    customPriceIsSafe = isCustomPriceSafeForCustomNetwork(state)
  }

  return {
    hideBasic,
    isConfirm: isConfirm(state),
    customModalGasPriceInHex,
    customModalGasLimitInHex,
    customGasPrice,
    customGasLimit: calcCustomGasLimit(customModalGasLimitInHex),
    customGasTotal,
    newTotalFiat,
    customPriceIsSafe,
    customPriceIsExcessive: isCustomPriceExcessive(state),
    maxModeOn,
    gasPriceButtonGroupProps: {
      buttonDataLoading,
      defaultActiveButtonIndex: getDefaultActiveButtonIndex(
        gasButtonInfo,
        customModalGasPriceInHex,
      ),
      gasButtonInfo,
    },
    infoRowProps: {
      originalTotalFiat: sumHexWEIsToRenderableFiat(
        [value, customGasTotal],
        currentCurrency,
        conversionRate,
      ),
      originalTotalEth: sumHexWEIsToRenderableEth([value, customGasTotal]),
      newTotalFiat: showFiat ? newTotalFiat : '',
      newTotalEth,
      transactionFee: sumHexWEIsToRenderableEth(['0x0', customGasTotal]),
      sendAmount,
    },
    transaction: txData || transaction,
    isSpeedUp: transaction.status === TRANSACTION_STATUSES.SUBMITTED,
    isRetry: transaction.status === TRANSACTION_STATUSES.FAILED,
    txId: transaction.id,
    insufficientBalance,
    isMainnet,
    balance,
    conversionRate,
    value,
    onSubmit,
  }
}

const mapDispatchToProps = (dispatch) => {
  const updateCustomGasPrice = (newPrice) =>
    dispatch(setCustomGasPrice(addHexPrefix(newPrice)))

  return {
    cancelAndClose: () => {
      dispatch(resetCustomData())
      dispatch(hideModal())
    },
    hideModal: () => dispatch(hideModal()),
    useCustomGas: () => dispatch(useCustomGas()),
    updateTransactionGasFees: (gasFees) => {
      dispatch(updateTransactionGasFees({ ...gasFees, expectHexWei: true }))
    },
    updateCustomGasPrice,
    updateCustomGasLimit: (newLimit) =>
      dispatch(setCustomGasLimit(addHexPrefix(newLimit))),
    setGasData: (newLimit, newPrice) => {
      dispatch(updateGasLimit(newLimit))
      dispatch(updateGasPrice(newPrice))
    },
    createRetryTransaction: (txId, customGasSettings) => {
      return dispatch(createRetryTransaction(txId, customGasSettings))
    },
    createSpeedUpTransaction: (txId, customGasSettings) => {
      return dispatch(createSpeedUpTransaction(txId, customGasSettings))
    },
    hideSidebar: () => dispatch(hideSidebar()),
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {
    gasPriceButtonGroupProps,
    // eslint-disable-next-line no-shadow
    isConfirm,
    txId,
    isSpeedUp,
    isRetry,
    insufficientBalance,
    customGasPrice,
    customGasLimit,
    transaction,
  } = stateProps
  const {
    useCustomGas: dispatchUseCustomGas,
    setGasData: dispatchSetGasData,
    createSpeedUpTransaction: dispatchCreateSpeedUpTransaction,
    createRetryTransaction: dispatchCreateRetryTransaction,
    updateTransactionGasFees: dispatchUpdateTransactionGasFees,
    hideSidebar: dispatchHideSidebar,
    cancelAndClose: dispatchCancelAndClose,
    hideModal: dispatchHideModal,
    ...otherDispatchProps
  } = dispatchProps
  return {
    ...stateProps,
    ...otherDispatchProps,
    ...ownProps,
    onSubmit: (gasLimit, gasPrice) => {
      if (ownProps.onSubmit) {
        dispatchHideSidebar()
        dispatchCancelAndClose()
        ownProps.onSubmit({
          gasLimit,
          gasPrice,
        })
        return
      }

      if (isConfirm) {
        dispatchUpdateTransactionGasFees({
          gasLimit,
          gasPrice,
          transaction,
          isModal: true,
        })
        dispatchHideModal()
        dispatchCancelAndClose()
      } else if (isSpeedUp) {
        dispatchCreateSpeedUpTransaction(txId, {
          gasPrice,
          gasLimit,
        })
        dispatchHideSidebar()
        dispatchCancelAndClose()
      } else if (isRetry) {
        dispatchCreateRetryTransaction(txId, {
          gasPrice,
          gasLimit,
        })
        dispatchHideSidebar()
        dispatchCancelAndClose()
      } else {
        dispatchSetGasData(gasLimit, gasPrice)
        dispatchUseCustomGas()
        dispatchCancelAndClose()
      }
    },
    gasPriceButtonGroupProps: {
      ...gasPriceButtonGroupProps,
      handleGasPriceSelection: ({ gasPrice }) =>
        otherDispatchProps.updateCustomGasPrice(gasPrice),
    },
    cancelAndClose: () => {
      dispatchCancelAndClose()

      if (isSpeedUp || isRetry) {
        dispatchHideSidebar()
      }
    },
    disableSave:
      insufficientBalance ||
      (isSpeedUp && customGasPrice === 0) ||
      customGasLimit < Number(MIN_GAS_LIMIT_DEC),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(GasModalPageContainer)

function isConfirm(state) {
  return Boolean(Object.keys(state.confirmTransaction.txData).length)
}

function calcCustomGasPrice(customGasPriceInHex) {
  return Number(hexWEIToDecGWEI(customGasPriceInHex))
}

function calcCustomGasLimit(customGasLimitInHex) {
  return parseInt(customGasLimitInHex, 16)
}

function sumHexWEIsToRenderableEth(hexWEIs) {
  const hexWEIsSum = hexWEIs.filter(Boolean).reduce(addHexes)
  return formatETHFee(
    getValueFromWeiHex({
      value: hexWEIsSum,
      toCurrency: 'ETH',
      numberOfDecimals: 6,
    }),
  )
}

function subtractHexWEIsFromRenderableEth(aHexWEI, bHexWEI) {
  return formatETHFee(subtractHexWEIsToDec(aHexWEI, bHexWEI))
}
