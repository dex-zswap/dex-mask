import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Tooltip from '@c/ui/tooltip';
import {
  TRANSACTION_GROUP_STATUSES,
  TRANSACTION_STATUSES,
} from '@shared/constants/transaction';
import { useI18nContext } from '@view/hooks/useI18nContext';
const QUEUED_PSEUDO_STATUS = 'queued';
const pendingStatusHash = {
  [TRANSACTION_STATUSES.SUBMITTED]: TRANSACTION_GROUP_STATUSES.PENDING,
  [TRANSACTION_STATUSES.APPROVED]: TRANSACTION_GROUP_STATUSES.PENDING,
  [TRANSACTION_STATUSES.SIGNED]: TRANSACTION_GROUP_STATUSES.PENDING,
};
const statusToClassNameHash = {
  [TRANSACTION_STATUSES.UNAPPROVED]: 'transaction-status--unapproved',
  [TRANSACTION_STATUSES.REJECTED]: 'transaction-status--rejected',
  [TRANSACTION_STATUSES.FAILED]: 'transaction-status--failed',
  [TRANSACTION_STATUSES.DROPPED]: 'transaction-status--dropped',
  [TRANSACTION_GROUP_STATUSES.CANCELLED]: 'transaction-status--cancelled',
  [QUEUED_PSEUDO_STATUS]: 'transaction-status--queued',
  [TRANSACTION_GROUP_STATUSES.PENDING]: 'transaction-status--pending',
};
export default function TransactionStatus({
  status,
  date,
  error,
  isEarliestNonce,
  className,
}) {
  const t = useI18nContext();
  const tooltipText = error?.rpc?.message || error?.message;
  let statusKey = status;

  if (pendingStatusHash[status]) {
    statusKey = isEarliestNonce
      ? TRANSACTION_GROUP_STATUSES.PENDING
      : QUEUED_PSEUDO_STATUS;
  }

  const statusText =
    statusKey === TRANSACTION_STATUSES.CONFIRMED ? date : t(statusKey);
  return (
    <Tooltip
      position="top"
      title={tooltipText}
      wrapperClassName={classnames(
        'transaction-status',
        className,
        statusToClassNameHash[statusKey],
      )}
    >
      {statusText}
    </Tooltip>
  );
}
