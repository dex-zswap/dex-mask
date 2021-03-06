import AccountListItem from '@c/app/account-list-item';
import NetworkDisplay from '@c/app/network-display';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

export default class SignatureRequestHeader extends PureComponent {
  static propTypes = {
    fromAccount: PropTypes.object,
  };

  render() {
    const { fromAccount } = this.props;

    return (
      <div className="signature-request-header">
        <div className="signature-request-header--account">
          {fromAccount && <AccountListItem account={fromAccount} />}
        </div>
        <div className="signature-request-header--network">
          <NetworkDisplay colored={false} />
        </div>
      </div>
    );
  }
}
