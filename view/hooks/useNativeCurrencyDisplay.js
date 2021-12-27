import { SECONDARY } from '@view/helpers/constants/common'
import { useCurrencyDisplay } from '@view/hooks/useCurrencyDisplay'
import { useUserPreferencedCurrency } from '@view/hooks/useUserPreferencedCurrency'
export default function useNativeCurrencyDisplay(balance) {
  const { currency, numberOfDecimals } = useUserPreferencedCurrency(SECONDARY, {
    ethNumberOfDecimals: 4,
  })
  const [_, { value, suffix }] = useCurrencyDisplay(balance, {
    currency,
    numberOfDecimals,
  })
  return {
    value,
    suffix,
  }
}
