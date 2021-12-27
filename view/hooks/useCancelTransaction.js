import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { isBalanceSufficient } from '@pages/send/utils'
import { getConversionRate } from '@reducer/dexmask/dexmask'
import { getMaximumGasTotalInHexWei } from '@shared/modules/gas.utils'
import { getSelectedAccount } from '@view/selectors'
import { useIncrementedGasFees } from './useIncrementedGasFees'
/**
 * Determine whether a transaction can be cancelled and provide a method to
 * kick off the process of cancellation.
 *
 * Provides a reusable hook that, given a transactionGroup, will return
 * whether or not the account has enough funds to cover the gas cancellation
 * fee, and a method for beginning the cancellation process
 * @param {Object} transactionGroup
 * @return {[boolean, Function]}
 */

export function useCancelTransaction(transactionGroup) {
  const { primaryTransaction } = transactionGroup
  const customCancelGasSettings = useIncrementedGasFees(transactionGroup)
  const selectedAccount = useSelector(getSelectedAccount)
  const conversionRate = useSelector(getConversionRate)
  const [showCancelEditGasPopover, setShowCancelEditGasPopover] = useState(
    false,
  )

  const closeCancelEditGasPopover = () => setShowCancelEditGasPopover(false)

  const cancelTransaction = useCallback((event) => {
    event.stopPropagation()
    return setShowCancelEditGasPopover(true)
  }, [])
  const hasEnoughCancelGas =
    primaryTransaction.txParams &&
    isBalanceSufficient({
      amount: '0x0',
      gasTotal: getMaximumGasTotalInHexWei(customCancelGasSettings),
      balance: selectedAccount.balance,
      conversionRate,
    })
  return {
    hasEnoughCancelGas,
    customCancelGasSettings,
    cancelTransaction,
    showCancelEditGasPopover,
    closeCancelEditGasPopover,
  }
}
