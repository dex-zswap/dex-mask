import React, { Component } from 'react';
import {
  createCustomAccountLink,
  getAccountLink,
} from '@metamask/etherscan-link';
import PropTypes from 'prop-types';
import Modal from '@c/app/modal';
import Identicon from '@c/ui/identicon';
import { CHAINID_EXPLORE_MAP, NETWORK_TO_NAME_MAP, MAINNET_CHAIN_ID } from '@shared/constants/network';
import { addressSummary } from '@view/helpers/utils';
export default class ConfirmRemoveAccount extends Component {
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
    const { identity, rpcPrefs, chainId, provider } = this.props;
    const providerType = NETWORK_TO_NAME_MAP[provider.type] ?? provider.type.toUpperCase();
    const isMainnet = chainId === MAINNET_CHAIN_ID;

    return (
      <div className="confirm-remove-account__account">
        <div className='flex space-between items-center'>
          <div className="confirm-remove-account__account__identicon">
            <Identicon diameter={28} address={identity.address} />
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
              {addressSummary(identity.address, 6, 6)}
            </span>
          </div>
          <div className="confirm-remove-account__account__link">
            <a
              className="view-in-explore"
              onClick={() => {
                let accountLink = getAccountLink(
                  identity.address,
                  chainId,
                  rpcPrefs,
                );

                if (!accountLink && CHAINID_EXPLORE_MAP[chainId]) {
                  accountLink = createCustomAccountLink(
                    identity.address,
                    CHAINID_EXPLORE_MAP[chainId],
                  );
                }

                global.platform.openTab({
                  url: accountLink,
                });
              }}
              target="_blank"
              rel="noopener noreferrer"
              title={isMainnet ? t('etherscanView') : t('viewinExplorer', [providerType])}
            >
            </a>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { t } = this.context;
    return (
      <Modal
        contentClass="confirm-remove-account"
        headerText={`${t('removeAccount')}?`}
        onClose={this.handleCancel}
        onSubmit={this.handleRemove}
        onCancel={this.handleCancel}
        submitText={t('remove')}
        cancelText={t('nevermind')}
        submitType="warning"
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
