import React, { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import EditGasPopover from '@c/app/edit-gas/popover';
import TransactionIcon from '@c/app/transaction/icon';
import TransactionListItemDetails from '@c/app/transaction/list-item-details';
import TransactionStatus from '@c/app/transaction/status';
import Button from '@c/ui/button';
import { TransitionListItem } from '@c/ui/list-item';
import Tooltip from '@c/ui/tooltip';
import { EDIT_GAS_MODES } from '@shared/constants/gas';
import {
  TRANSACTION_GROUP_CATEGORIES,
  TRANSACTION_STATUSES,
} from '@shared/constants/transaction';
import { CONFIRM_TRANSACTION_ROUTE } from '@view/helpers/constants/routes';
import { useCancelTransaction } from '@view/hooks/useCancelTransaction';
import { useI18nContext } from '@view/hooks/useI18nContext';
import { useRetryTransaction } from '@view/hooks/useRetryTransaction';
import { useShouldShowSpeedUp } from '@view/hooks/useShouldShowSpeedUp';
import { useTransactionDisplayData } from '@view/hooks/useTransactionDisplayData';
export default function TransactionListItem({
  transactionGroup,
  isEarliestNonce = false,
}) {
  const t = useI18nContext();
  const history = useHistory();
  const { hasCancelled } = transactionGroup;
  const [showDetails, setShowDetails] = useState(false);
  const {
    initialTransaction: { id },
    primaryTransaction: { err, status },
  } = transactionGroup;
  const {
    hasEnoughCancelGas,
    cancelTransaction,
    showCancelEditGasPopover,
    closeCancelEditGasPopover,
    customCancelGasSettings,
  } = useCancelTransaction(transactionGroup);
  const {
    retryTransaction,
    showRetryEditGasPopover,
    closeRetryEditGasPopover,
    customRetryGasSettings,
  } = useRetryTransaction(transactionGroup);
  const shouldShowSpeedUp = useShouldShowSpeedUp(
    transactionGroup,
    isEarliestNonce,
  );
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
  } = useTransactionDisplayData(transactionGroup);
  const isSignatureReq =
    category === TRANSACTION_GROUP_CATEGORIES.SIGNATURE_REQUEST;
  const isApproval = category === TRANSACTION_GROUP_CATEGORIES.APPROVAL;
  const isUnapproved = status === TRANSACTION_STATUSES.UNAPPROVED;
  const isSwap = category === TRANSACTION_GROUP_CATEGORIES.SWAP;
  const className = classnames('transaction-list-item', {
    'transaction-list-item--unconfirmed':
      isPending ||
      [
        TRANSACTION_STATUSES.FAILED,
        TRANSACTION_STATUSES.DROPPED,
        TRANSACTION_STATUSES.REJECTED,
      ].includes(displayedStatusKey),
  });
  const toggleShowDetails = useCallback(() => {
    if (isUnapproved) {
      history.push(`${CONFIRM_TRANSACTION_ROUTE}/${id}`);
      return;
    }

    setShowDetails((prev) => !prev);
  }, [isUnapproved, history, id]);
  const cancelButton = useMemo(() => {
    const btn = (
      <Button
        onClick={cancelTransaction}
        type="ghost"
        rounded
        className="transaction-list-item__header-button"
        disabled={!hasEnoughCancelGas}
      >
        {t('cancel')}
      </Button>
    );

    if (hasCancelled || !isPending || isUnapproved) {
      return null;
    }

    return hasEnoughCancelGas ? (
      btn
    ) : (
      <Tooltip title={t('notEnoughGas')} position="bottom">
        <div>{btn}</div>
      </Tooltip>
    );
  }, [
    isPending,
    t,
    isUnapproved,
    hasEnoughCancelGas,
    cancelTransaction,
    hasCancelled,
  ]);
  const speedUpButton = useMemo(() => {
    if (!shouldShowSpeedUp || !isPending || isUnapproved) {
      return null;
    }

    return (
      <Button
        type="primary"
        rounded
        onClick={hasCancelled ? cancelTransaction : retryTransaction}
        style={
          hasCancelled
            ? {
                width: 'auto',
              }
            : null
        }
      >
        {hasCancelled ? t('speedUpCancellation') : t('speedUp')}
      </Button>
    );
  }, [
    shouldShowSpeedUp,
    isUnapproved,
    t,
    isPending,
    retryTransaction,
    hasCancelled,
    cancelTransaction,
  ]);
  return (
    <>
      <div className="transaction-list-item__wrapper">
        <TransitionListItem
          onClick={toggleShowDetails}
          className={className}
          title={title}
          icon={
            <TransactionIcon category={category} status={displayedStatusKey} />
          }
          subtitle={
            <h3>
              <TransactionStatus
                isPending={isPending}
                isEarliestNonce={isEarliestNonce}
                error={err}
                date={date}
                status={displayedStatusKey}
              />
            </h3>
          }
          rightContent={
            !isSignatureReq &&
            !isApproval && (
              <>
                <h2
                  title={primaryCurrency}
                  className="transaction-list-item__primary-currency"
                >
                  {primaryCurrency}
                </h2>
                <h3 className="transaction-list-item__secondary-currency">
                  {secondaryCurrency}
                </h3>
              </>
            )
          }
        ></TransitionListItem>
        {(speedUpButton || cancelButton) && (
          <div className="transaction-list-item__pending-actions">
            {speedUpButton}
            {cancelButton}
          </div>
        )}
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
  );
}
TransactionListItem.propTypes = {
  transactionGroup: PropTypes.object.isRequired,
  isEarliestNonce: PropTypes.bool,
};
