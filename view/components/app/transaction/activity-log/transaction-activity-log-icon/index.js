import React, { PureComponent } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import {
  TRANSACTION_CANCEL_ATTEMPTED_EVENT,
  TRANSACTION_CANCEL_SUCCESS_EVENT,
  TRANSACTION_CONFIRMED_EVENT,
  TRANSACTION_CREATED_EVENT,
  TRANSACTION_DROPPED_EVENT,
  TRANSACTION_ERRORED_EVENT,
  TRANSACTION_RESUBMITTED_EVENT,
  TRANSACTION_SUBMITTED_EVENT,
} from '@c/app/transaction/activity-log/constants';
const imageHash = {
  [TRANSACTION_CREATED_EVENT]: '/images/transaction/list/created.png',
  [TRANSACTION_SUBMITTED_EVENT]: '/images/transaction/list/submited.png',
  [TRANSACTION_CONFIRMED_EVENT]: '/images/transaction/list/confirmed.png',

  [TRANSACTION_RESUBMITTED_EVENT]: '/images/icons/retry.png',
  [TRANSACTION_DROPPED_EVENT]: '/images/icons/cancelled.png',
  [TRANSACTION_ERRORED_EVENT]: '/images/icons/error.png',
  [TRANSACTION_CANCEL_ATTEMPTED_EVENT]: '/images/icons/cancelled.png',
  [TRANSACTION_CANCEL_SUCCESS_EVENT]: '/images/icons/cancelled.png',
};
export default class TransactionActivityLogIcon extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  };

  render() {
    const { className, eventKey } = this.props;
    const imagePath = imageHash[eventKey];
    return (
      <div className={classnames('transaction-activity-log-icon', className)}>
        {imagePath && <img src={imagePath} height="24" width="24" alt="" />}
      </div>
    );
  }
}
