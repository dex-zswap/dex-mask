import React, { PureComponent } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Identicon from '@c/ui/identicon';
export default class ConnectedAccountsListItem extends PureComponent {
  static contextTypes = {
    t: PropTypes.func.isRequired,
  };

  render() {
    const { address, className, name, status, action, options } = this.props;
    return (
      <div className={classnames('connected-accounts-list__row', className)}>
        <div className="connected-accounts-list__row-content flex items-center">
          <Identicon
            className="connected-accounts-list__identicon"
            address={address}
            diameter={28}
          />
          <div className="connected-accounts-list__status flex space-between items-center">
            <div>
              <p
                className={classnames(
                  'connected-accounts-list__account-name',
                  action ? 'block' : '',
                )}
              >
                <strong>{name}</strong>
              </p>
              {status ? (
                <p
                  className={classnames(
                    'connected-accounts-list__account-status',
                    action ? 'block' : '',
                  )}
                >
                  {status}
                </p>
              ) : null}
            </div>
            {action}
          </div>
        </div>
        {options}
      </div>
    );
  }
}
