import React, { useContext, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';
import { zeroAddress } from 'ethereumjs-util';
import PropTypes from 'prop-types';
import AdvancedGasControls from '@c/app/advanced-gas-controls';
import GasTiming from '@c/app/gas-timing';
import TransactionTotalBanner from '@c/app/transaction/total-banner';
import ActionableMessage from '@c/ui/actionable-message';
import Button from '@c/ui/button';
import ErrorMessage from '@c/ui/error-message';
import InfoTooltip from '@c/ui/info-tooltip';
import RadioGroup from '@c/ui/radio-group';
import Typography from '@c/ui/typography';
import { getNativeCurrency } from '@reducer/dexmask/dexmask';
import {
  EDIT_GAS_MODES,
  GAS_ESTIMATE_TYPES,
  GAS_RECOMMENDATIONS,
} from '@shared/constants/gas';
import { I18nContext } from '@view/contexts/i18n';
import {
  COLORS,
  FONT_WEIGHT,
  TYPOGRAPHY,
} from '@view/helpers/constants/design-system';
import { getPrice } from '@view/helpers/cross-chain-api';
import { areDappSuggestedAndTxParamGasFeesTheSame } from '@view/helpers/utils/confirm-tx.util';
import { useFetch } from '@view/hooks/useFetch';
import {
  checkNetworkAndAccountSupports1559,
  getAdvancedInlineGasShown,
  getIsMainnet,
} from '@view/selectors';
export default function EditGasDisplay({
  mode = EDIT_GAS_MODES.MODIFY_IN_PLACE,
  showEducationButton = false,
  onEducationClick,
  transaction,
  defaultEstimateToUse,
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
  dappSuggestedGasFeeAcknowledged,
  setDappSuggestedGasFeeAcknowledged,
  warning,
  gasErrors,
  gasWarnings,
  onManualChange,
  minimumGasLimit,
  balanceError,
  estimatesUnavailableWarning,
  hasGasErrors,
  txParamsHaveBeenCustomized,
}) {
  const t = useContext(I18nContext);
  const isMainnet = useSelector(getIsMainnet);
  const networkAndAccountSupport1559 = useSelector(
    checkNetworkAndAccountSupports1559,
  );
  const showAdvancedInlineGasIfPossible = useSelector(
    getAdvancedInlineGasShown,
  );
  const nativeCurrency = useSelector(getNativeCurrency);
  const { res, error, loading } = useFetch(
    () =>
      getPrice({
        token_address: zeroAddress(),
        symbol: nativeCurrency,
      }),
    [nativeCurrency],
  );
  const estimatedMinimumNativeUsdPrice = useMemo(() => {
    if (error || loading) {
      return 0;
    }

    return (
      '≈ $' +
      new BigNumber(
        new BigNumber(res?.d?.price || 0)
          .times(new BigNumber(estimatedMinimumNative.split(' ')[0]))
          .toFixed(3),
      ).toFixed()
    );
  }, [res, error, loading, estimatedMinimumNative]);
  const estimatedMaximumNativeUsdPrice = useMemo(() => {
    if (error || loading || !estimatedMaximumNative) {
      return '$0';
    }

    return (
      '$' +
      new BigNumber(
        new BigNumber(res?.d?.price || 0)
          .times(new BigNumber(estimatedMaximumNative.split(' ')[0]))
          .toFixed(3),
      ).toFixed()
    );
  }, [res, error, loading, estimatedMaximumNative]);
  const [showAdvancedForm, setShowAdvancedForm] = useState(
    !estimateToUse ||
      estimateToUse === 'custom' ||
      !networkAndAccountSupport1559,
  );
  const [hideRadioButtons, setHideRadioButtons] = useState(
    showAdvancedInlineGasIfPossible,
  );
  const dappSuggestedAndTxParamGasFeesAreTheSame = areDappSuggestedAndTxParamGasFeesTheSame(
    transaction,
  );
  const requireDappAcknowledgement = Boolean(
    transaction?.dappSuggestedGasFees &&
      !dappSuggestedGasFeeAcknowledged &&
      dappSuggestedAndTxParamGasFeesAreTheSame,
  );
  const showTopError =
    (balanceError || estimatesUnavailableWarning) &&
    (!isGasEstimatesLoading || txParamsHaveBeenCustomized);
  const radioButtonsEnabled =
    networkAndAccountSupport1559 &&
    gasEstimateType === GAS_ESTIMATE_TYPES.FEE_MARKET &&
    !requireDappAcknowledgement;
  let errorKey;

  if (balanceError) {
    errorKey = 'insufficientFunds';
  } else if (estimatesUnavailableWarning) {
    errorKey = 'gasEstimatesUnavailableWarning';
  }

  return (
    <div className="edit-gas-display">
      <div className="edit-gas-display__content">
        {warning && !isGasEstimatesLoading && (
          <div className="edit-gas-display__warning">
            <ActionableMessage
              className="actionable-message--warning"
              message={warning}
            />
          </div>
        )}
        {showTopError && (
          <div className="edit-gas-display__warning">
            <ErrorMessage errorKey={errorKey} />
          </div>
        )}
        {requireDappAcknowledgement && !isGasEstimatesLoading && (
          <div className="edit-gas-display__dapp-acknowledgement-warning">
            <ActionableMessage
              className="actionable-message--warning"
              message={t('gasDisplayDappWarning', [transaction.origin])}
              iconFillColor="#f8c000"
              useIcon
            />
          </div>
        )}
        {mode === EDIT_GAS_MODES.SPEED_UP && (
          <div className="edit-gas-display__top-tooltip">
            <Typography
              color={COLORS.WHITE}
              variant={TYPOGRAPHY.H8}
              fontWeight={FONT_WEIGHT.BOLD}
            >
              {t('speedUpTooltipText')}{' '}
              <InfoTooltip
                position="top"
                contentText={t('speedUpExplanation')}
              />
            </Typography>
          </div>
        )}
        <TransactionTotalBanner
          className="gas-fee-display__banner" // total={
          //   (networkAndAccountSupport1559 || isMainnet) && estimatedMinimumFiat
          //     ? estimatedMinimumFiat
          //     : estimatedMinimumNative
          // }
          total={estimatedMinimumNative}
          detail={
            networkAndAccountSupport1559 &&
            estimatedMaximumFiat !== undefined &&
            t('editGasTotalBannerSubtitle', [
              <Typography
                fontWeight={FONT_WEIGHT.BOLD}
                tag="span"
                key="secondary"
              >
                {estimatedMaximumNativeUsdPrice}
              </Typography>,
              <Typography tag="span" key="primary">
                {estimatedMaximumNative}
              </Typography>,
            ])
          }
          timing={
            hasGasErrors === false && (
              <GasTiming
                maxFeePerGas={maxFeePerGas}
                maxPriorityFeePerGas={maxPriorityFeePerGas}
                gasWarnings={gasWarnings}
              />
            )
          }
        />
        {requireDappAcknowledgement && (
          <Button
            className="edit-gas-display__dapp-acknowledgement-button"
            onClick={() => setDappSuggestedGasFeeAcknowledged(true)}
          >
            {t('gasDisplayAcknowledgeDappButtonText')}
          </Button>
        )}
        {!requireDappAcknowledgement &&
          radioButtonsEnabled &&
          showAdvancedInlineGasIfPossible && (
            <button
              className="edit-gas-display__advanced-button"
              onClick={() => setHideRadioButtons(!hideRadioButtons)}
            >
              {t('showRecommendations')}{' '}
              {hideRadioButtons ? (
                <i className="fa fa-caret-down"></i>
              ) : (
                <i className="fa fa-caret-up"></i>
              )}
            </button>
          )}
        {radioButtonsEnabled && !hideRadioButtons && (
          <RadioGroup
            name="gas-recommendation"
            options={[
              {
                value: GAS_RECOMMENDATIONS.LOW,
                label: t('editGasLow'),
                recommended: defaultEstimateToUse === GAS_RECOMMENDATIONS.LOW,
              },
              {
                value: GAS_RECOMMENDATIONS.MEDIUM,
                label: t('editGasMedium'),
                recommended:
                  defaultEstimateToUse === GAS_RECOMMENDATIONS.MEDIUM,
              },
              {
                value: GAS_RECOMMENDATIONS.HIGH,
                label: t('editGasHigh'),
                recommended: defaultEstimateToUse === GAS_RECOMMENDATIONS.HIGH,
              },
            ]}
            selectedValue={estimateToUse}
            onChange={setEstimateToUse}
          />
        )}
        {!requireDappAcknowledgement &&
          radioButtonsEnabled &&
          !showAdvancedInlineGasIfPossible && (
            <button
              className="edit-gas-display__advanced-button"
              onClick={() => setShowAdvancedForm(!showAdvancedForm)}
            >
              {t('advancedOptions')}
            </button>
          )}
        {!requireDappAcknowledgement &&
          (showAdvancedForm ||
            hasGasErrors ||
            estimatesUnavailableWarning ||
            showAdvancedInlineGasIfPossible) && (
            <AdvancedGasControls
              gasEstimateType={gasEstimateType}
              isGasEstimatesLoading={isGasEstimatesLoading}
              gasLimit={gasLimit}
              setGasLimit={setGasLimit}
              maxPriorityFee={maxPriorityFeePerGas}
              setMaxPriorityFee={setMaxPriorityFeePerGas}
              maxFee={maxFeePerGas}
              setMaxFee={setMaxFeePerGas}
              gasPrice={gasPrice}
              setGasPrice={setGasPrice}
              maxPriorityFeeFiat={maxPriorityFeePerGasFiat}
              maxFeeFiat={maxFeePerGasFiat}
              gasErrors={gasErrors}
              onManualChange={onManualChange}
              minimumGasLimit={minimumGasLimit}
            />
          )}
      </div>
    </div>
  );
}
EditGasDisplay.propTypes = {
  mode: PropTypes.oneOf(Object.values(EDIT_GAS_MODES)),
  showEducationButton: PropTypes.bool,
  onEducationClick: PropTypes.func,
  defaultEstimateToUse: PropTypes.oneOf(Object.values(GAS_RECOMMENDATIONS)),
  maxPriorityFeePerGas: PropTypes.string,
  setMaxPriorityFeePerGas: PropTypes.func,
  maxPriorityFeePerGasFiat: PropTypes.string,
  maxFeePerGas: PropTypes.string,
  setMaxFeePerGas: PropTypes.func,
  maxFeePerGasFiat: PropTypes.string,
  estimatedMaximumNative: PropTypes.string,
  estimatedMinimumNative: PropTypes.string,
  isGasEstimatesLoading: PropTypes.bool,
  gasEstimateType: PropTypes.string,
  gasPrice: PropTypes.string,
  setGasPrice: PropTypes.func,
  gasLimit: PropTypes.number,
  setGasLimit: PropTypes.func,
  estimateToUse: PropTypes.string,
  setEstimateToUse: PropTypes.func,
  estimatedMinimumFiat: PropTypes.string,
  estimatedMaximumFiat: PropTypes.string,
  dappSuggestedGasFeeAcknowledged: PropTypes.bool,
  setDappSuggestedGasFeeAcknowledged: PropTypes.func,
  warning: PropTypes.string,
  transaction: PropTypes.object,
  gasErrors: PropTypes.object,
  gasWarnings: PropTypes.object,
  onManualChange: PropTypes.func,
  minimumGasLimit: PropTypes.number,
  balanceError: PropTypes.bool,
  estimatesUnavailableWarning: PropTypes.bool,
  hasGasErrors: PropTypes.bool,
  txParamsHaveBeenCustomized: PropTypes.bool,
};
