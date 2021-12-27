import React from 'react'
import PropTypes from 'prop-types'
import CurrencyDisplay from '@c/ui/currency-display'
import { useTokenTracker } from '@view/hooks/useTokenTracker'
export default function TokenBalance({
  numberOfDecimals,
  className,
  token,
  hideSymbol,
  accountAddress = '',
}) {
  const { tokensWithBalances } = useTokenTracker(
    [token],
    false,
    false,
    accountAddress,
  )
  const { string, symbol } = tokensWithBalances[0] || {}
  return (
    <CurrencyDisplay
      numberOfDecimals={numberOfDecimals}
      className={className}
      displayValue={string || ''}
      suffix={hideSymbol ? null : symbol || ''}
    />
  )
}
