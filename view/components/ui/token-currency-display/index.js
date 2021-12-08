import CurrencyDisplay from '@c/ui/currency-display';
import { useTokenDisplayValue } from '@view/hooks/useTokenDisplayValue';
import PropTypes from 'prop-types';
import React from 'react';

export default function TokenCurrencyDisplay({
  className,
  transactionData,
  token,
  prefix,
}) {
  const displayValue = useTokenDisplayValue(transactionData, token);

  return (
    <CurrencyDisplay
      className={className}
      prefix={prefix}
      displayValue={displayValue}
      suffix={token.symbol}
    />
  );
}

TokenCurrencyDisplay.propTypes = {
  className: PropTypes.string,
  transactionData: PropTypes.string,
  token: PropTypes.object,
  prefix: PropTypes.string,
};
