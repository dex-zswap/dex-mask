import React, { Component } from 'react';
import { createCustomAccountLink, getAccountLink } from '@metamask/etherscan-link';
import PropTypes from 'prop-types';
import AccountModalContainer from '@c/app/modals/account-modal-container';
import Button from '@c/ui/button';
import EditableLabel from '@c/ui/editable-label';
import QrView from '@c/ui/qr-code';
import { CHAINID_EXPLORE_MAP, MAINNET_CHAIN_ID, NETWORK_TO_NAME_MAP } from '@shared/constants/network';
export default class AccountDetailsModal extends Component {
  static propTypes = {
    selectedIdentity: PropTypes.object,
    chainId: PropTypes.string,
    showExportPrivateKeyModal: PropTypes.func,
    setAccountLabel: PropTypes.func,
    keyrings: PropTypes.array,
    rpcPrefs: PropTypes.object,
    provider: PropTypes.object
  };
  static contextTypes = {
    t: PropTypes.func
  };

  render() {
    const {
      selectedIdentity,
      chainId,
      showExportPrivateKeyModal,
      setAccountLabel,
      keyrings,
      rpcPrefs,
      provider
    } = this.props;
    const {
      name,
      address
    } = selectedIdentity;
    const isMainnet = chainId === MAINNET_CHAIN_ID;
    const providerType = NETWORK_TO_NAME_MAP[provider.type] ?? provider.type.toUpperCase();
    const keyring = keyrings.find(kr => {
      return kr.accounts.includes(address);
    });
    let exportPrivateKeyFeatureEnabled = true; // This feature is disabled for hardware wallets

    if (keyring?.type?.search('Hardware') !== -1) {
      exportPrivateKeyFeatureEnabled = false;
    }

    return <AccountModalContainer className="account-details-modal">
        <EditableLabel className="account-details-modal__name" defaultValue={name} onSubmit={label => setAccountLabel(address, label)} />

        <QrView Qr={{
        data: address
      }} />

        <div className="account-details-modal__divider" />

        <Button type="primary" className="account-details-modal__button" onClick={() => {
        let accountLink = getAccountLink(address, chainId, rpcPrefs);

        if (!accountLink && CHAINID_EXPLORE_MAP[chainId]) {
          accountLink = createCustomAccountLink(address, CHAINID_EXPLORE_MAP[chainId]);
        }

        global.platform.openTab({
          url: accountLink
        });
      }}>
          {isMainnet ? <>{this.context.t('viewOnEtherscan')}</> : <>
              {rpcPrefs.blockExplorerUrl ? this.context.t('blockExplorerView', [rpcPrefs.blockExplorerUrl.match(/^https?:\/\/(.+)/u)[1]]) : this.context.t('viewinExplorer', [providerType])}
            </>}
        </Button>

        {exportPrivateKeyFeatureEnabled ? <Button type="primary" className="account-details-modal__button" onClick={() => showExportPrivateKeyModal()}>
            {this.context.t('exportPrivateKey')}
          </Button> : null}
      </AccountModalContainer>;
  }

}