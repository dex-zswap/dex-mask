import React, { Component } from 'react';
import {
  createCustomAccountLink,
  getAccountLink,
} from '@metamask/etherscan-link';
import copyToClipboard from 'copy-to-clipboard';
import PropTypes from 'prop-types';
import AccountModalContainer from '@c/app/modals/account-modal-container';
import Button from '@c/ui/button';
import EditableLabel from '@c/ui/editable-label';
import QrView from '@c/ui/qr-code';
import ToolTip from '@c/ui/tooltip';
import { SECOND } from '@shared/constants/time';
import {
  CHAINID_EXPLORE_MAP,
  MAINNET_CHAIN_ID,
  NETWORK_TO_NAME_MAP,
} from '@shared/constants/network';
export default class AccountDetailsModal extends Component {
  static contextTypes = {
    t: PropTypes.func,
  };
  copyTimeOut = null;
  state = {
    copied: false,
  };
  copyAddress = () => {
    const {
      props: {
        selectedIdentity: { address },
      },
    } = this;
    window.clearTimeout(this.copyTimeOut);
    copyToClipboard(address);
    this.setState(
      (state) => {
        return {
          copied: !state.copied,
        };
      },
      () => {
        this.copyTimeOut = setTimeout(() => {
          window.clearTimeout(this.copyTimeOut);
          this.setState(({ copied }) => {
            return {
              copied: !copied,
            };
          });
        }, SECOND * 3);
      },
    );
  };

  render() {
    const {
      selectedIdentity,
      chainId,
      showExportPrivateKeyModal,
      setAccountLabel,
      keyrings,
      rpcPrefs,
      provider,
    } = this.props;
    const { t } = this.context;
    const { name, address } = selectedIdentity;
    const isMainnet = chainId === MAINNET_CHAIN_ID;
    const providerType =
      NETWORK_TO_NAME_MAP[provider.type] ?? provider.type.toUpperCase();
    const keyring = keyrings.find((kr) => {
      return kr.accounts.includes(address);
    });
    let exportPrivateKeyFeatureEnabled = true; // This feature is disabled for hardware wallets

    if (keyring?.type?.search('Hardware') !== -1) {
      exportPrivateKeyFeatureEnabled = false;
    }

    return (
      <AccountModalContainer className="account-details-modal">
        <QrView
          hiddenAddress={true}
          cellWidth={4}
          darkColor="#fff"
          lightColor="transparent"
          Qr={{
            data: address,
          }}
        />

        <EditableLabel
          className="account-details-modal__name"
          defaultValue={name}
          onSubmit={(label) => setAccountLabel(address, label)}
        />

        <ToolTip
          position="top"
          title={
            this.state.copied ? t('copiedExclamation') : t('copyToClipboard')
          }
        >
          <div className="account-detail-address" onClick={this.copyAddress}>
            {address}
          </div>
        </ToolTip>

        <Button
          type="primary"
          className="account-details-modal__button"
          onClick={() => {
            let accountLink = getAccountLink(address, chainId, rpcPrefs);

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
        >
          {isMainnet ? (
            <>{this.context.t('viewOnEtherscan')}</>
          ) : (
            <>
              {rpcPrefs.blockExplorerUrl
                ? this.context.t('blockExplorerView', [
                    rpcPrefs.blockExplorerUrl.match(/^https?:\/\/(.+)/u)[1],
                  ])
                : this.context.t('viewinExplorer', [providerType])}
            </>
          )}
        </Button>

        {exportPrivateKeyFeatureEnabled ? (
          <Button
            type="primary"
            className="account-details-modal__button"
            onClick={() => showExportPrivateKeyModal()}
          >
            {this.context.t('exportPrivateKey')}
          </Button>
        ) : null}
      </AccountModalContainer>
    );
  }
}
