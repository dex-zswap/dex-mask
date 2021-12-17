import React, { useContext, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import UserPreferencedCurrencyDisplay from '@c/app/user-preferenced/currency-display';
import ConfirmTransactionBase from '@pages/confirm-transaction-base';
import { I18nContext } from '@view/contexts/i18n';
import { ETH, PRIMARY } from '@view/helpers/constants/common';
import {
  addFiat,
  convertTokenToFiat,
  formatCurrency,
  roundExponential,
} from '@view/helpers/utils/confirm-tx.util';
import { getWeiHexFromDecimalValue } from '@view/helpers/utils/conversions.util';
export default function ConfirmTokenTransactionBase({
  toAddress,
  tokenAddress,
  tokenAmount = '0',
  tokenSymbol,
  fiatTransactionTotal,
  ethTransactionTotal,
  ethTransactionTotalMaxAmount,
  contractExchangeRate,
  conversionRate,
  currentCurrency,
  nativeCurrency,
  onEdit,
}) {
  const t = useContext(I18nContext);
  const hexWeiValue = useMemo(() => {
    if (tokenAmount === '0' || !contractExchangeRate) {
      return '0';
    }

    const decimalEthValue = new BigNumber(tokenAmount)
      .times(new BigNumber(contractExchangeRate))
      .toFixed();
    return getWeiHexFromDecimalValue({
      value: decimalEthValue,
      fromCurrency: ETH,
      fromDenomination: ETH,
    });
  }, [tokenAmount, contractExchangeRate]);
  const secondaryTotalTextOverride = useMemo(() => {
    if (typeof contractExchangeRate === 'undefined') {
      return formatCurrency(fiatTransactionTotal, currentCurrency);
    }

    const fiatTransactionAmount = convertTokenToFiat({
      value: tokenAmount,
      toCurrency: currentCurrency,
      conversionRate,
      contractExchangeRate,
    });
    const fiatTotal = addFiat(fiatTransactionAmount, fiatTransactionTotal);
    const roundedFiatTotal = roundExponential(fiatTotal);
    const currency = formatCurrency(roundedFiatTotal, currentCurrency);
    return '$0.00' === currency
      ? '≈ $0'
      : '0.00' === currency
      ? '≈ 0'
      : '≈ ' + currency;
  }, [
    currentCurrency,
    conversionRate,
    contractExchangeRate,
    fiatTransactionTotal,
    tokenAmount,
  ]);
  const tokensText = `${tokenAmount} ${tokenSymbol}`;
  return (
    <ConfirmTransactionBase
      toAddress={toAddress}
      onEdit={onEdit}
      identiconAddress={tokenAddress}
      title={tokensText}
      subtitleComponent={
        contractExchangeRate === undefined ? (
          <span>{t('noConversionRateAvailable')}</span>
        ) : (
          <UserPreferencedCurrencyDisplay
            value={hexWeiValue}
            type={PRIMARY}
            hideLabel
          />
        )
      }
      primaryTotalTextOverride={`${tokensText} + ${ethTransactionTotal} ${nativeCurrency}`}
      primaryTotalTextOverrideMaxAmount={`${tokensText} + ${ethTransactionTotalMaxAmount} ${nativeCurrency}`}
      secondaryTotalTextOverride={secondaryTotalTextOverride}
    />
  );
}
ConfirmTokenTransactionBase.propTypes = {
  tokenAddress: PropTypes.string,
  toAddress: PropTypes.string,
  tokenAmount: PropTypes.string,
  tokenSymbol: PropTypes.string,
  fiatTransactionTotal: PropTypes.string,
  ethTransactionTotal: PropTypes.string,
  contractExchangeRate: PropTypes.number,
  conversionRate: PropTypes.number,
  currentCurrency: PropTypes.string,
  onEdit: PropTypes.func,
  nativeCurrency: PropTypes.string,
  ethTransactionTotalMaxAmount: PropTypes.string,
};
