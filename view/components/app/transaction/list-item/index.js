import React, { useCallback, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import classnames from 'classnames'
import EditGasPopover from '@c/app/edit-gas/popover'
import TransactionIcon from '@c/app/transaction/icon'
import TransactionListItemDetails from '@c/app/transaction/list-item-details'
import TransactionStatus from '@c/app/transaction/status'
import Button from '@c/ui/button' // import { TransitionListItem } from '@c/ui/list-item';

import Tooltip from '@c/ui/tooltip'
import { EDIT_GAS_MODES } from '@shared/constants/gas'
import {
  TRANSACTION_GROUP_CATEGORIES,
  TRANSACTION_STATUSES,
} from '@shared/constants/transaction'
import { CONFIRM_TRANSACTION_ROUTE } from '@view/helpers/constants/routes'
import { useCancelTransaction } from '@view/hooks/useCancelTransaction'
import { useI18nContext } from '@view/hooks/useI18nContext'
import { useRetryTransaction } from '@view/hooks/useRetryTransaction'
import { useShouldShowSpeedUp } from '@view/hooks/useShouldShowSpeedUp'
import { useTransactionDisplayData } from '@view/hooks/useTransactionDisplayData'
export default function TransactionListItem({
  transactionGroup,
  isEarliestNonce = false,
}) {
  const t = useI18nContext()
  const history = useHistory()
  const { hasCancelled } = transactionGroup
  const [showDetails, setShowDetails] = useState(false)
  const {
    initialTransaction: { id },
    primaryTransaction: { err, status },
  } = transactionGroup
  const {
    hasEnoughCancelGas,
    cancelTransaction,
    showCancelEditGasPopover,
    closeCancelEditGasPopover,
    customCancelGasSettings,
  } = useCancelTransaction(transactionGroup)
  const {
    retryTransaction,
    showRetryEditGasPopover,
    closeRetryEditGasPopover,
    customRetryGasSettings,
  } = useRetryTransaction(transactionGroup)
  const shouldShowSpeedUp = useShouldShowSpeedUp(
    transactionGroup,
    isEarliestNonce,
  )
  const {
    title,
    subtitle,
    subtitleContainsOrigin,
    date,
    category,
    primaryCurrency,
    recipientAddress,
    secondaryCurrency,
    displayedStatusKey,
    isPending,
    senderAddress,
  } = useTransactionDisplayData(transactionGroup)
  const isSignatureReq =
    category === TRANSACTION_GROUP_CATEGORIES.SIGNATURE_REQUEST
  const isApproval = category === TRANSACTION_GROUP_CATEGORIES.APPROVAL
  const isUnapproved = status === TRANSACTION_STATUSES.UNAPPROVED
  const isSwap = category === TRANSACTION_GROUP_CATEGORIES.SWAP
  const className = classnames('transaction-list-item', {
    'transaction-list-item--unconfirmed':
      isPending ||
      [
        TRANSACTION_STATUSES.FAILED,
        TRANSACTION_STATUSES.DROPPED,
        TRANSACTION_STATUSES.REJECTED,
      ].includes(displayedStatusKey),
  })
  const statusText = useMemo(() => {
    if (hasCancelled) {
      return 'canceled'
    }

    if (isPending) {
      return `Pending · ${subtitle}`
    }

    return date
  }, [hasCancelled, isPending, date, subtitle])
  const statusClassName = useMemo(() => {
    if (hasCancelled) {
      return 'canceled'
    }

    if (isPending) {
      return 'pending'
    }

    return 'confirmed'
  }, [hasCancelled, isPending])
  const toggleShowDetails = useCallback(() => {
    if (isUnapproved) {
      history.push(`${CONFIRM_TRANSACTION_ROUTE}/${id}`)
      return
    }

    setShowDetails((prev) => !prev)
  }, [isUnapproved, history, id])

  const nonSignReqAndApproval = useMemo(() => !isSignatureReq && !isApproval, [isSignatureReq, isApproval])

  return (
    <>
      <div className='transaction-list-item__wrapper'>
        <div
          className={classnames('transaction-list-row-item', className)}
          onClick={toggleShowDetails}
        >
          <TransactionIcon category={category} status={displayedStatusKey} />
          <div className="transaction-info">
            <div className='left-info'>
              <div className={classnames('method-name', statusClassName)}>
                {title}
              </div>
              {nonSignReqAndApproval ? (
                <h2 className='primary-currency'>
                  {primaryCurrency}
                </h2>
              ) : <span></span>}
            </div>
            <div className='right-status'>
              <div className='status'>{statusText}</div>
              {nonSignReqAndApproval ? (
                <h3 className='secondary-currency'>{secondaryCurrency}</h3>
              ): <span></span>}
            </div>
          </div>
        </div>
      </div>
      {showDetails && (
        <TransactionListItemDetails
          title={title}
          onClose={toggleShowDetails}
          transactionGroup={transactionGroup}
          primaryCurrency={primaryCurrency}
          senderAddress={senderAddress}
          recipientAddress={recipientAddress}
          onRetry={retryTransaction}
          showRetry={status === TRANSACTION_STATUSES.FAILED && !isSwap}
          showSpeedUp={shouldShowSpeedUp}
          isEarliestNonce={isEarliestNonce}
          onCancel={cancelTransaction}
          showCancel={isPending && !hasCancelled}
          cancelDisabled={!hasEnoughCancelGas}
        />
      )}
      {showRetryEditGasPopover && (
        <EditGasPopover
          onClose={closeRetryEditGasPopover}
          mode={EDIT_GAS_MODES.SPEED_UP}
          transaction={{
            ...transactionGroup.primaryTransaction,
            userFeeLevel: 'custom',
            txParams: {
              ...transactionGroup.primaryTransaction?.txParams,
              ...customRetryGasSettings,
            },
          }}
        />
      )}
      {showCancelEditGasPopover && (
        <EditGasPopover
          onClose={closeCancelEditGasPopover}
          mode={EDIT_GAS_MODES.CANCEL}
          transaction={{
            ...transactionGroup.primaryTransaction,
            userFeeLevel: 'custom',
            txParams: {
              ...transactionGroup.primaryTransaction?.txParams,
              ...customCancelGasSettings,
            },
          }}
        />
      )}
    </>
  )
}
