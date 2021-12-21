import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MenuItem } from '@c/ui/menu';
import Button from '@c/ui/button';
import ConnectedAccountsListItem from './item';
import ConnectedAccountsListOptions from './options';

export default class ConnectedAccountsList extends PureComponent {
  static contextTypes = {
    t: PropTypes.func.isRequired,
  };
  static defaultProps = {
    accountToConnect: null,
  };
  state = {
    accountWithOptionsShown: null,
  };
  disconnectAccount = () => {
    this.hideAccountOptions();
    this.props.removePermittedAccount(this.state.accountWithOptionsShown);
  };
  switchAccount = (address) => {
    this.hideAccountOptions();
    this.props.setSelectedAddress(address);
  };
  hideAccountOptions = () => {
    this.setState({
      accountWithOptionsShown: null,
    });
  };
  showAccountOptions = (address) => {
    this.setState({
      accountWithOptionsShown: address,
    });
  };

  renderUnconnectedAccount() {
    const { accountToConnect, connectAccount } = this.props;
    const { t } = this.context;

    if (!accountToConnect) {
      return null;
    }

    const { address, name } = accountToConnect;
    return (
      <ConnectedAccountsListItem
        className="connected-accounts-list__row--highlight"
        address={address}
        name={`${name} (…${address.substr(-4, 4)})`}
        status={t('statusNotConnected')}
        action={
          <Button
            type="primary"
            className="connected-accounts-list__account-status-button"
            onClick={() => connectAccount(accountToConnect.address)}
          >
            {t('connect')}
          </Button>
        }
      />
    );
  }

  renderListItemOptions(address) {
    const { accountWithOptionsShown } = this.state;
    const { t } = this.context;
    return (
      <ConnectedAccountsListOptions
        onHideOptions={this.hideAccountOptions}
        onShowOptions={this.showAccountOptions.bind(null, address)}
        show={accountWithOptionsShown === address}
      >
        <MenuItem
          iconClassName="disconnect-icon"
          onClick={this.disconnectAccount}
        >
          {t('disconnectThisAccount')}
        </MenuItem>
      </ConnectedAccountsListOptions>
    );
  }

  renderListItemAction(address) {
    const { t } = this.context;
    return (
      <Button
        type="primary"
        className="connected-accounts-list__account-status-button"
        onClick={() => this.switchAccount(address)}
      >
        {t('switchToThisAccount')}
      </Button>
    );
  }

  render() {
    const {
      connectedAccounts,
      selectedAddress,
      shouldRenderListOptions,
    } = this.props;
    const { t } = this.context;

    return (
      <>
        <main className="connected-accounts-list">
          {this.renderUnconnectedAccount()}
          {connectedAccounts.map(({ address, name }, index) => {
            const action = address === selectedAddress ? null : this.renderListItemAction(address);
            const options = (shouldRenderListOptions && action === null) ? this.renderListItemOptions(address) : null;

            return (
              <ConnectedAccountsListItem
                key={address}
                address={address}
                name={`${name} (…${address.substr(-4, 4)})`}
                status={index === 0 ? t('active') : null}
                options={options}
                action={action}
              />
            );
          })}
        </main>
      </>
    );
  }
}
