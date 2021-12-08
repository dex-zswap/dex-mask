import CurrencyDisplay from '@c/ui/currency-display';
import { useTokenTracker } from '@view/hooks/useTokenTracker';
import PropTypes from 'prop-types';
import React from 'react';

export default function TokenBalance({
  numberOfDecimals,
  className,
  token,
  accountAddress = '',
}) {
  const { tokensWithBalances } = useTokenTracker(
    [token],
    false,
    false,
    accountAddress,
  );

  const { string, symbol } = tokensWithBalances[0] || {};
  return (
    <CurrencyDisplay
      numberOfDecimals={numberOfDecimals}
      className={className}
      displayValue={string || ''}
      suffix={symbol || ''}
    />
  );
}

TokenBalance.propTypes = {
  numberOfDecimals: PropTypes.number,
  className: PropTypes.string,
  token: PropTypes.shape({
    address: PropTypes.string.isRequired,
    decimals: PropTypes.number,
    symbol: PropTypes.string,
  }).isRequired,
};

TokenBalance.defaultProps = {
  className: undefined,
};
