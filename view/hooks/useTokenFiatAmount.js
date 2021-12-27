import { useMemo } from 'react'
import { useSelector } from 'react-redux'
/**
 * Get the token balance converted to fiat and formatted for display
 *
 * @param {string} [tokenAddress] - The token address
 * @param {string} [tokenAmount] - The token balance
 * @param {string} [tokenSymbol] - The token symbol
 * @param {Object} [overrides] - A configuration object that allows the caller to explicitly pass an exchange rate or
 *                              ensure fiat is shown even if the property is not set in state.
 * @param {number} [overrides.exchangeRate] -  An exhchange rate to use instead of the one selected from state
 * @param {boolean} [overrides.showFiat] - If truthy, ensures the fiat value is shown even if the showFiat value from state is falsey
 * @param {boolean} hideCurrencySymbol Indicates whether the returned formatted amount should include the trailing currency symbol
 * @return {string} - The formatted token amount in the user's chosen fiat currency
 */

import { getConversionRate } from '@reducer/dexmask/dexmask'
import { getTokenFiatAmount } from '@view/helpers/utils/token-util'
import {
  getCurrentCurrency,
  getShouldShowFiat,
  getTokenExchangeRates,
} from '@view/selectors'
export function useTokenFiatAmount(
  tokenAddress,
  tokenAmount,
  tokenSymbol,
  overrides = {},
  hideCurrencySymbol,
  numberOfDecimals = 2,
) {
  const contractExchangeRates = useSelector(getTokenExchangeRates)
  const conversionRate = useSelector(getConversionRate)
  const currentCurrency = useSelector(getCurrentCurrency)
  const userPrefersShownFiat = useSelector(getShouldShowFiat)
  const showFiat = overrides.showFiat ?? userPrefersShownFiat
  const tokenExchangeRate =
    overrides.exchangeRate ?? contractExchangeRates[tokenAddress]
  const formattedFiat = useMemo(
    () =>
      getTokenFiatAmount(
        tokenExchangeRate,
        conversionRate,
        currentCurrency,
        tokenAmount,
        tokenSymbol,
        true,
        hideCurrencySymbol,
        numberOfDecimals,
      ),
    [
      tokenExchangeRate,
      conversionRate,
      currentCurrency,
      tokenAmount,
      tokenSymbol,
      hideCurrencySymbol,
      numberOfDecimals,
    ],
  )

  if (!showFiat || currentCurrency.toUpperCase() === tokenSymbol) {
    return undefined
  }

  return formattedFiat ?? '$0.00 USD'
}
