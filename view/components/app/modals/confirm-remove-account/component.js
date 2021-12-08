import Modal from '@c/app/modal';
import {
  createCustomAccountLink,
  getAccountLink,
} from '@metamask/etherscan-link';
import { CHAINID_EXPLORE_MAP } from '@shared/constants/network';
import { addressSummary } from '@view/helpers/utils';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class ConfirmRemoveAccount extends Component {
  static propTypes = {
    hideModal: PropTypes.func.isRequired,
    removeAccount: PropTypes.func.isRequired,
    identity: PropTypes.object.isRequired,
    chainId: PropTypes.string.isRequired,
    rpcPrefs: PropTypes.object.isRequired,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  handleRemove = () => {
    this.props
      .removeAccount(this.props.identity.address)
      .then(() => this.props.hideModal());
  };

  handleCancel = () => {
    this.props.hideModal();
  };

  renderSelectedAccount() {
    const { t } = this.context;
    const { identity, rpcPrefs, chainId } = this.props;
    return (
      <div className="confirm-remove-account__account">
        <div className="confirm-remove-account__account__identicon">
          <img width="32px" src="images/dex/account-menu/account-avatar.png" />
        </div>
        <div className="confirm-remove-account__account__name">
          <span className="confirm-remove-account__account__label">
            {t('name')}
          </span>
          <span className="account_value">{identity.name}</span>
        </div>
        <div className="confirm-remove-account__account__address">
          <span className="confirm-remove-account__account__label">
            {t('publicAddress')}
          </span>
          <span className="account_value">
            {addressSummary(identity.address, 4, 4)}
          </span>
        </div>
        <div className="confirm-remove-account__account__link">
          <a
            className=""
            onClick={() => {
              let accountLink = getAccountLink(
                identity.address,
                chainId,
                rpcPrefs,
              );

              if (!accountLink && CHAINID_EXPLORE_MAP[chainId]) {
                accountLink = createCustomAccountLink(
                  address,
                  CHAINID_EXPLORE_MAP[chainId],
                );
              }

              global.platform.openTab({
                url: accountLink,
              });
            }}
            target="_blank"
            rel="noopener noreferrer"
            title={t('etherscanView')}
          >
            <img src="images/popout.svg" alt={t('etherscanView')} />
          </a>
        </div>
      </div>
    );
  }

  render() {
    const { t } = this.context;

    return (
      <Modal
        headerText={`${t('removeAccount')}?`}
        onClose={this.handleCancel}
        onSubmit={this.handleRemove}
        onCancel={this.handleCancel}
        submitText={t('remove')}
        cancelText={t('nevermind')}
        submitType="secondary"
      >
        <div>
          {this.renderSelectedAccount()}
          <div className="confirm-remove-account__description">
            {t('removeAccountDescription')}
          </div>
        </div>
      </Modal>
    );
  }
}
