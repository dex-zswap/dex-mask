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
  [TRANSACTION_CREATED_EVENT]: '/images/icons/new.png',
  [TRANSACTION_SUBMITTED_EVENT]: '/images/icons/submitted.png',
  [TRANSACTION_RESUBMITTED_EVENT]: '/images/icons/retry.png',
  [TRANSACTION_CONFIRMED_EVENT]: '/images/icons/confirm.png',
  [TRANSACTION_DROPPED_EVENT]: '/images/icons/cancelled.png',
  [TRANSACTION_ERRORED_EVENT]: '/images/icons/error.png',
  [TRANSACTION_CANCEL_ATTEMPTED_EVENT]: '/images/icons/cancelled.png',
  [TRANSACTION_CANCEL_SUCCESS_EVENT]: '/images/icons/cancelled.png',
};
export default class TransactionActivityLogIcon extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  };
  static propTypes = {
    className: PropTypes.string,
    eventKey: PropTypes.oneOf(Object.keys(imageHash)),
  };

  render() {
    const { className, eventKey } = this.props;
    const imagePath = imageHash[eventKey];
    return (
      <div className={classnames('transaction-activity-log-icon', className)}>
        {imagePath && <img src={imagePath} height="12" width="12" alt="" />}
      </div>
    );
  }
}
