import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Approve from '@c/ui/icon/approve-icon.component';
import Interaction from '@c/ui/icon/interaction-icon.component';
import Receive from '@c/ui/icon/receive-icon.component';
import Send from '@c/ui/icon/send-icon.component';
import Sign from '@c/ui/icon/sign-icon.component';
import Swap from '@c/ui/icon/swap-icon-for-list.component';
import {
  TRANSACTION_GROUP_CATEGORIES,
  TRANSACTION_GROUP_STATUSES,
  TRANSACTION_STATUSES,
} from '@shared/constants/transaction';
import { captureSingleException } from '@view/store/actions';
const ICON_MAP = {
  [TRANSACTION_GROUP_CATEGORIES.APPROVAL]: Approve,
  [TRANSACTION_GROUP_CATEGORIES.INTERACTION]: Interaction,
  [TRANSACTION_GROUP_CATEGORIES.SEND]: Send,
  [TRANSACTION_GROUP_CATEGORIES.SIGNATURE_REQUEST]: Sign,
  [TRANSACTION_GROUP_CATEGORIES.RECEIVE]: Receive,
  [TRANSACTION_GROUP_CATEGORIES.SWAP]: Swap,
};
const FAIL_COLOR = '#23233F';
const PENDING_COLOR = '#585A64';
const OK_COLOR = '#651AB5';
const COLOR_MAP = {
  [TRANSACTION_GROUP_STATUSES.PENDING]: PENDING_COLOR,
  [TRANSACTION_STATUSES.UNAPPROVED]: PENDING_COLOR,
  [TRANSACTION_STATUSES.APPROVED]: PENDING_COLOR,
  [TRANSACTION_STATUSES.FAILED]: FAIL_COLOR,
  [TRANSACTION_STATUSES.REJECTED]: FAIL_COLOR,
  [TRANSACTION_GROUP_STATUSES.CANCELLED]: FAIL_COLOR,
  [TRANSACTION_STATUSES.DROPPED]: FAIL_COLOR,
  [TRANSACTION_STATUSES.SUBMITTED]: PENDING_COLOR,
};
export default function TransactionIcon({ status, category }) {
  const dispatch = useDispatch();
  const color = COLOR_MAP[status] || OK_COLOR;
  const Icon = ICON_MAP[category];

  if (!Icon) {
    dispatch(
      captureSingleException(
        `The category prop passed to TransactionIcon is not supported. The prop is: ${category}`,
      ),
    );
    return <div className="transaction-icon__grey-circle" />;
  }

  return <Icon color={color} size={36} />;
}
TransactionIcon.propTypes = {
  status: PropTypes.oneOf([
    TRANSACTION_GROUP_STATUSES.PENDING,
    TRANSACTION_STATUSES.UNAPPROVED,
    TRANSACTION_STATUSES.APPROVED,
    TRANSACTION_STATUSES.FAILED,
    TRANSACTION_STATUSES.REJECTED,
    TRANSACTION_GROUP_STATUSES.CANCELLED,
    TRANSACTION_STATUSES.DROPPED,
    TRANSACTION_STATUSES.CONFIRMED,
    TRANSACTION_STATUSES.SUBMITTED,
  ]).isRequired,
  category: PropTypes.oneOf([
    TRANSACTION_GROUP_CATEGORIES.APPROVAL,
    TRANSACTION_GROUP_CATEGORIES.INTERACTION,
    TRANSACTION_GROUP_CATEGORIES.SEND,
    TRANSACTION_GROUP_CATEGORIES.SIGNATURE_REQUEST,
    TRANSACTION_GROUP_CATEGORIES.RECEIVE,
    TRANSACTION_GROUP_CATEGORIES.SWAP,
  ]).isRequired,
};
