import React, { useMemo } from 'react'
import TokenImage from '@c/ui/token-image'
import { useTokenFiatAmount } from '@view/hooks/useTokenFiatAmount'
export default function tokenListItem({
  address,
  symbol,
  balance,
  isNativeCurrency,
  nativeCurrencyDisplayAmount,
  nativeCurrencyDisplayAmountUnit,
  active,
  onClick,
}) {
  const tokenDisplayStr = useTokenFiatAmount(
    address,
    balance,
    symbol,
    {
      showFiat: true,
    },
    false,
    null,
  )
  const tokenDisplayValue = useMemo(() => tokenDisplayStr?.split(' ')[0], [
    tokenDisplayStr,
  ])
  const tokenDisplayUnit = useMemo(() => tokenDisplayStr?.split(' ')[1], [
    tokenDisplayStr,
  ])
  return (
    <div
      className={`token-list-wrap ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className='token-wrap'>
        <TokenImage address={address} symbol={symbol} size={24} />
        <div className='token-symbol'>{symbol}</div>
      </div>
      <div className='balance-wrap'>
        <div>
          <div>{balance}</div>
          <div>{symbol}</div>
        </div>
        <div>
          <div>
            {isNativeCurrency ? nativeCurrencyDisplayAmount : tokenDisplayValue}
          </div>
          <div>
            {isNativeCurrency
              ? nativeCurrencyDisplayAmountUnit
              : tokenDisplayUnit}
          </div>
        </div>
      </div>
    </div>
  )
}
