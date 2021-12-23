import React, { PureComponent } from 'react';
import {
  createCustomExplorerLink,
  getBlockExplorerLink,
} from '@metamask/etherscan-link';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { CHAINID_EXPLORE_MAP } from '@shared/constants/network';
import { formatDate } from '@view/helpers/utils';
import {
  getEthConversionFromWeiHex,
  getValueFromWeiHex,
} from '@view/helpers/utils/conversions.util';
import { CONFIRMED_STATUS } from './constants';
import TransactionActivityLogIcon from './transaction-activity-log-icon';
export default class TransactionActivityLog extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  };
  static propTypes = {
    activities: PropTypes.array,
    className: PropTypes.string,
    conversionRate: PropTypes.number,
    inlineRetryIndex: PropTypes.number,
    inlineCancelIndex: PropTypes.number,
    nativeCurrency: PropTypes.string,
    onCancel: PropTypes.func,
    onRetry: PropTypes.func,
    primaryTransaction: PropTypes.object,
    isEarliestNonce: PropTypes.bool,
    rpcPrefs: PropTypes.object,
  };
  handleActivityClick = (activity) => {
    const { rpcPrefs } = this.props;
    let etherscanUrl = getBlockExplorerLink(activity, rpcPrefs);

    if (!etherscanUrl && CHAINID_EXPLORE_MAP[activity.chainId]) {
      etherscanUrl = createCustomExplorerLink(
        activity.hash,
        CHAINID_EXPLORE_MAP[activity.chainId],
      );
    }

    global.platform.openTab({
      url: etherscanUrl,
    });
  };

  renderInlineRetry(index) {
    const { t } = this.context;
    const {
      inlineRetryIndex,
      primaryTransaction = {},
      onRetry,
      isEarliestNonce,
    } = this.props;
    const { status } = primaryTransaction;
    return isEarliestNonce &&
      status !== CONFIRMED_STATUS &&
      index === inlineRetryIndex ? (
      <div className="transaction-activity-log__action-link" onClick={onRetry}>
        {t('speedUpTransaction')}
      </div>
    ) : null;
  }

  renderInlineCancel(index) {
    const { t } = this.context;
    const {
      inlineCancelIndex,
      primaryTransaction = {},
      onCancel,
      isEarliestNonce,
    } = this.props;
    const { status } = primaryTransaction;
    return isEarliestNonce &&
      status !== CONFIRMED_STATUS &&
      index === inlineCancelIndex ? (
      <div className="transaction-activity-log__action-link" onClick={onCancel}>
        {t('speedUpCancellation')}
      </div>
    ) : null;
  }

  renderActivity(activity, index) {
    const { conversionRate, nativeCurrency } = this.props;
    const { eventKey, value, timestamp } = activity;
    const ethValue =
      index === 0
        ? `${getValueFromWeiHex({
            value,
            fromCurrency: 'ETH',
            toCurrency: 'ETH',
            conversionRate,
            numberOfDecimals: 6,
          })} ${nativeCurrency}`
        : getEthConversionFromWeiHex({
            value,
            fromCurrency: 'ETH',
            conversionRate,
            numberOfDecimals: 3,
          });
    const formattedTimestamp = formatDate(timestamp, 'y/LLL/d T ');
    const activityText = this.context.t(eventKey, [
      ethValue,
      formattedTimestamp,
    ]);
    return (
      <div
        key={index}
        className="transaction-activity-log__activity flex items-center"
      >
        <TransactionActivityLogIcon
          className="transaction-activity-log__activity-icon"
          eventKey={eventKey}
        />
        <div className="transaction-activity-log__entry-container">
          <div
            className="transaction-activity-log__activity-text"
            title={activityText}
            onClick={() => this.handleActivityClick(activity)}
          >
            <p className="node-time">{formattedTimestamp}</p>
            <p className="node-activity">{activityText}</p>
          </div>
          {/* {this.renderInlineRetry(index)}
          {this.renderInlineCancel(index)} */}
        </div>
      </div>
    );
  }

  render() {
    const { t } = this.context;
    const { className, activities } = this.props;

    if (activities.length === 0) {
      return null;
    }

    return (
      <div className={classnames('transaction-activity-log', className)}>
        <div className="transaction-activity-log__title">
          {t('activityLog')}
        </div>
        <div className="transaction-activity-log__activities-container">
          {activities.map((activity, index) =>
            this.renderActivity(activity, index),
          )}
        </div>
      </div>
    );
  }
}
