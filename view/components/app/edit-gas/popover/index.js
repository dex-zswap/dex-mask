import React, { useCallback, useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import EditGasDisplay from '@c/app/edit-gas/display'
import EditGasDisplayEducation from '@c/app/edit-gas/display-education'
import Button from '@c/ui/button'
import Popover from '@c/ui/popover'
import { getGasLoadingAnimationIsShowing } from '@reducer/app'
import { EDIT_GAS_MODES, GAS_LIMITS } from '@shared/constants/gas'
import { txParamsAreDappSuggested } from '@shared/modules/transaction.utils'
import { I18nContext } from '@view/contexts/i18n'
import {
  decGWEIToHexWEI,
  decimalToHex,
  hexToDecimal,
} from '@view/helpers/utils/conversions.util'
import { useGasFeeInputs } from '@view/hooks/useGasFeeInputs'
import { checkNetworkAndAccountSupports1559 } from '@view/selectors'
import {
  createCancelTransaction,
  createSpeedUpTransaction,
  hideModal,
  hideSidebar,
  updateCustomSwapsEIP1559GasParams,
  updateSwapsUserFeeLevel,
  updateTransaction,
} from '@view/store/actions'
export default function EditGasPopover({
  popoverTitle = '',
  confirmButtonText = '',
  editGasDisplayProps = {},
  defaultEstimateToUse = 'medium',
  transaction,
  mode,
  onClose,
  minimumGasLimit = GAS_LIMITS.SIMPLE,
}) {
  const t = useContext(I18nContext)
  const dispatch = useDispatch()
  const showSidebar = useSelector((state) => state.appState.sidebar.isOpen)
  const networkAndAccountSupport1559 = useSelector(
    checkNetworkAndAccountSupports1559,
  )
  const gasLoadingAnimationIsShowing = useSelector(
    getGasLoadingAnimationIsShowing,
  )
  const showEducationButton =
    (mode === EDIT_GAS_MODES.MODIFY_IN_PLACE ||
      mode === EDIT_GAS_MODES.SWAPS) &&
    networkAndAccountSupport1559
  const [showEducationContent, setShowEducationContent] = useState(false)
  const [warning] = useState(null)
  const [
    dappSuggestedGasFeeAcknowledged,
    setDappSuggestedGasFeeAcknowledged,
  ] = useState(false)
  const minimumGasLimitDec = hexToDecimal(minimumGasLimit)
  const {
    maxPriorityFeePerGas,
    setMaxPriorityFeePerGas,
    maxPriorityFeePerGasFiat,
    maxFeePerGas,
    setMaxFeePerGas,
    maxFeePerGasFiat,
    estimatedMaximumNative,
    estimatedMinimumNative,
    isGasEstimatesLoading,
    gasEstimateType,
    gasPrice,
    setGasPrice,
    gasLimit,
    setGasLimit,
    estimateToUse,
    setEstimateToUse,
    estimatedMinimumFiat,
    estimatedMaximumFiat,
    hasGasErrors,
    gasErrors,
    gasWarnings,
    onManualChange,
    balanceError,
    estimatesUnavailableWarning,
    estimatedBaseFee,
  } = useGasFeeInputs(defaultEstimateToUse, transaction, minimumGasLimit, mode)
  const txParamsHaveBeenCustomized =
    estimateToUse === 'custom' || txParamsAreDappSuggested(transaction)
  /**
   * Temporary placeholder, this should be managed by the parent component but
   * we will be extracting this component from the hard to maintain modal/
   * sidebar component. For now this is just to be able to appropriately close
   * the modal in testing
   */

  const closePopover = useCallback(() => {
    if (onClose) {
      onClose()
    } else if (showSidebar) {
      dispatch(hideSidebar())
    } else {
      dispatch(hideModal())
    }
  }, [showSidebar, onClose, dispatch])
  const onSubmit = useCallback(() => {
    if (!transaction || !mode) {
      closePopover()
    }

    const newGasSettings = networkAndAccountSupport1559
      ? {
          gas: decimalToHex(gasLimit),
          gasLimit: decimalToHex(gasLimit),
          maxFeePerGas: decGWEIToHexWEI(maxFeePerGas ?? gasPrice),
          maxPriorityFeePerGas: decGWEIToHexWEI(
            maxPriorityFeePerGas ?? maxFeePerGas ?? gasPrice,
          ),
        }
      : {
          gas: decimalToHex(gasLimit),
          gasLimit: decimalToHex(gasLimit),
          gasPrice: decGWEIToHexWEI(gasPrice),
        }
    const cleanTransactionParams = { ...transaction.txParams }

    if (networkAndAccountSupport1559) {
      delete cleanTransactionParams.gasPrice
    }

    const updatedTxMeta = {
      ...transaction,
      userFeeLevel: estimateToUse || 'custom',
      txParams: { ...cleanTransactionParams, ...newGasSettings },
    }

    switch (mode) {
      case EDIT_GAS_MODES.CANCEL:
        dispatch(
          createCancelTransaction(transaction.id, newGasSettings, {
            estimatedBaseFee,
          }),
        )
        break

      case EDIT_GAS_MODES.SPEED_UP:
        dispatch(
          createSpeedUpTransaction(transaction.id, newGasSettings, {
            estimatedBaseFee,
          }),
        )
        break

      case EDIT_GAS_MODES.MODIFY_IN_PLACE:
        dispatch(updateTransaction(updatedTxMeta))
        break

      case EDIT_GAS_MODES.SWAPS:
        // This popover component should only be used for the "FEE_MARKET" type in Swaps.
        if (networkAndAccountSupport1559) {
          dispatch(updateSwapsUserFeeLevel(estimateToUse || 'custom'))
          dispatch(updateCustomSwapsEIP1559GasParams(newGasSettings))
        }

        break

      default:
        break
    }

    closePopover()
  }, [
    transaction,
    mode,
    gasLimit,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    networkAndAccountSupport1559,
    estimateToUse,
    estimatedBaseFee,
  ])
  let title = t('editGasTitle')

  if (popoverTitle) {
    title = popoverTitle
  } else if (showEducationContent) {
    title = t('editGasEducationModalTitle')
  } else if (mode === EDIT_GAS_MODES.SPEED_UP) {
    title = t('speedUpPopoverTitle')
  } else if (mode === EDIT_GAS_MODES.CANCEL) {
    title = t('cancelPopoverTitle')
  }

  const footerButtonText = confirmButtonText || t('save')
  return (
    <Popover
      onClose={closePopover}
      className='edit-gas-popover__wrapper'
      onBack={
        showEducationContent ? () => setShowEducationContent(false) : undefined
      }
    >
      <div
        style={{
          padding: '0 24px 20px',
          position: 'relative',
        }}
      >
        {showEducationContent ? (
          <EditGasDisplayEducation />
        ) : (
          <>
            <EditGasDisplay
              showEducationButton={showEducationButton}
              warning={warning}
              dappSuggestedGasFeeAcknowledged={dappSuggestedGasFeeAcknowledged}
              setDappSuggestedGasFeeAcknowledged={
                setDappSuggestedGasFeeAcknowledged
              }
              maxPriorityFeePerGas={maxPriorityFeePerGas}
              setMaxPriorityFeePerGas={setMaxPriorityFeePerGas}
              maxPriorityFeePerGasFiat={maxPriorityFeePerGasFiat}
              maxFeePerGas={maxFeePerGas}
              setMaxFeePerGas={setMaxFeePerGas}
              maxFeePerGasFiat={maxFeePerGasFiat}
              estimatedMaximumNative={estimatedMaximumNative}
              estimatedMinimumNative={estimatedMinimumNative}
              isGasEstimatesLoading={isGasEstimatesLoading}
              gasEstimateType={gasEstimateType}
              gasPrice={gasPrice}
              setGasPrice={setGasPrice}
              gasLimit={gasLimit}
              setGasLimit={setGasLimit}
              estimateToUse={estimateToUse}
              setEstimateToUse={setEstimateToUse}
              estimatedMinimumFiat={estimatedMinimumFiat}
              estimatedMaximumFiat={estimatedMaximumFiat}
              onEducationClick={() => setShowEducationContent(true)}
              mode={mode}
              transaction={transaction}
              gasErrors={gasErrors}
              gasWarnings={gasWarnings}
              onManualChange={onManualChange}
              minimumGasLimit={minimumGasLimitDec}
              balanceError={balanceError}
              estimatesUnavailableWarning={estimatesUnavailableWarning}
              hasGasErrors={hasGasErrors}
              txParamsHaveBeenCustomized={txParamsHaveBeenCustomized}
              {...editGasDisplayProps}
            />
          </>
        )}
        {showEducationContent ? null : (
          <>
            <Button
              type='primary'
              onClick={onSubmit}
              disabled={
                hasGasErrors ||
                balanceError ||
                ((isGasEstimatesLoading || gasLoadingAnimationIsShowing) &&
                  !txParamsHaveBeenCustomized)
              }
            >
              {footerButtonText}
            </Button>
          </>
        )}
      </div>
    </Popover>
  )
}
EditGasPopover.propTypes = {
  popoverTitle: PropTypes.string,
  editGasDisplayProps: PropTypes.object,
  confirmButtonText: PropTypes.string,
  onClose: PropTypes.func,
  transaction: PropTypes.object,
  mode: PropTypes.oneOf(Object.values(EDIT_GAS_MODES)),
  defaultEstimateToUse: PropTypes.string,
  minimumGasLimit: PropTypes.string,
}
