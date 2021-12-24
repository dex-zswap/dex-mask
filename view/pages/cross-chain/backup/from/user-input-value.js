import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { getNativeCurrency } from '@reducer/dexmask/dexmask'
import { SECONDARY } from '@view/helpers/constants/common'
import { toHexString } from '@view/helpers/utils/conversions.util'
import { useCurrencyDisplay } from '@view/hooks/useCurrencyDisplay'
import { useTokenFiatAmount } from '@view/hooks/useTokenFiatAmount'
import { useUserPreferencedCurrency } from '@view/hooks/useUserPreferencedCurrency'
import { getCrossChainState } from '@view/selectors'
import { updateCrossChainState } from '@view/store/actions'
export default function UserInputValue({ coinAddress, symbol, tokenBalance }) {
  const dispatch = useDispatch()
  const crossInfo = useSelector(getCrossChainState)
  const nativeCurrency = useSelector(getNativeCurrency)
  const isNative = crossInfo.coinAddress === ethers.constants.AddressZero
  const {
    currency: secondaryCurrency,
    numberOfDecimals: secondaryNumberOfDecimals,
  } = useUserPreferencedCurrency(SECONDARY, {
    ethNumberOfDecimals: 4,
  })
  const [
    secondaryCurrencyDisplay,
    secondaryCurrencyProperties,
  ] = useCurrencyDisplay(
    crossInfo.userInputValue ? toHexString(crossInfo.userInputValue, 18) : '0',
    {
      numberOfDecimals: secondaryNumberOfDecimals,
      currency: secondaryCurrency,
    },
  )
  const fiatAmount = useTokenFiatAmount(
    crossInfo.coinAddress,
    crossInfo.userInputValue ?? '0',
    crossInfo.coinSymbol,
    {
      showFiat: true,
    },
  )
  const userInput = useCallback(
    (e) => {
      const originalValue = e.target.value
      let value = originalValue
      const isNaN = value && Number.isNaN(Number(value))

      if (isNaN) {
        return
      }

      if (!value) {
        dispatch(
          updateCrossChainState({
            userInputValue: '',
          }),
        )
        return
      }

      if (Number(value) !== parseInt(value)) {
        value = Number(value)
      }

      const maxValue = new BigNumber(tokenBalance)
      const userInputValue = new BigNumber(value)
      const realValue = maxValue.lessThan(userInputValue)
        ? tokenBalance
        : originalValue
      dispatch(
        updateCrossChainState({
          userInputValue: realValue,
        }),
      )
    },
    [tokenBalance],
  )
  return (
    <div className='cross-chain-from__user-input'>
      <div className='number-display'>
        <div className='display-wrapper'>
          <input
            className='number-display-text'
            onChange={userInput}
            value={crossInfo.userInputValue}
            placeholder='0'
          />
          <span className='number-display-span'>
            {crossInfo.userInputValue}
          </span>
        </div>
        <span className='number-symbol'>{symbol || nativeCurrency}</span>
      </div>
      <div className='usd-value'>
        ≈ {isNative ? secondaryCurrencyDisplay : fiatAmount}{' '}
      </div>
    </div>
  )
}
