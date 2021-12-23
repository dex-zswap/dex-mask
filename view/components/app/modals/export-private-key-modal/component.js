import React, { Component } from 'react';
import copyToClipboard from 'copy-to-clipboard';
import { stripHexPrefix } from 'ethereumjs-util';
import log from 'loglevel';
import PropTypes from 'prop-types';
import ToolTip from '@c/ui/tooltip';
import TextField from '@c/ui/text-field';
import { SECOND } from '@shared/constants/time';
import AccountModalContainer from '@c/app/modals/account-modal-container';
import Button from '@c/ui/button';
import ReadOnlyInput from '@c/ui/readonly-input';
import { toChecksumHexAddress } from '@shared/modules/hexstring-utils';
export default class ExportPrivateKeyModal extends Component {
  static contextTypes = {
    t: PropTypes.func,
  };
  state = {
    password: '',
    privateKey: null,
    showWarning: true,
    copied: false,
  };
  copyTimeOut = null;
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
        return { ...state, copied: !state.copied };
      },
      () => {
        this.copyTimeOut = setTimeout(() => {
          window.clearTimeout(this.copyTimeOut);
          this.setState((state) => {
            return { ...state, copied: !state.copied };
          });
        }, SECOND * 3);
      },
    );
  };

  componentWillUnmount() {
    this.props.clearAccountDetails();
    this.props.hideWarning();
  }

  exportAccountAndGetPrivateKey = (password, address) => {
    const { exportAccount } = this.props;
    exportAccount(password, address)
      .then((privateKey) =>
        this.setState({
          privateKey,
          showWarning: false,
        }),
      )
      .catch((e) => log.error(e));
  };

  renderPasswordInput(privateKey) {
    const { warning } = this.props;
    const { showWarning } = this.state;
    const plainKey = privateKey && stripHexPrefix(privateKey);

    if (!privateKey) {
      return (
        <TextField
          label={this.context.t('typePassword')}
          placeholder={this.context.t('enterPassword')}
          type="password"
          error={showWarning && warning ? warning : null}
          onChange={(event) =>
            this.setState({
              password: event.target.value,
            })
          }
        />
      );
    }

    return (
      <div className="private-key-display">
        <div className="header flex space-between items-center">
          {this.context.t('copyPrivateKey')}
          <i className="copy-icon"></i>
        </div>
        <div className="private-key">{plainKey}</div>
      </div>
    );
  }

  renderButtons(privateKey, address, hideModal) {
    return (
      <div className="export-private-key-modal__buttons">
        {!privateKey && (
          <Button
            className="export-private-key-modal__button export-private-key-modal__button--cancel"
            onClick={() => hideModal()}
          >
            {this.context.t('cancel')}
          </Button>
        )}
        {privateKey ? (
          <Button
            onClick={() => hideModal()}
            className="export-private-key-modal__button"
          >
            {this.context.t('close')}
          </Button>
        ) : (
          <Button
            onClick={() =>
              this.exportAccountAndGetPrivateKey(this.state.password, address)
            }
            type="primary"
            className="export-private-key-modal__button"
            disabled={!this.state.password}
          >
            {this.context.t('confirm')}
          </Button>
        )}
      </div>
    );
  }

  render() {
    const {
      selectedIdentity,
      warning,
      showAccountDetailModal,
      hideModal,
      previousModalState,
    } = this.props;
    const { name, address } = selectedIdentity;
    const { privateKey, showWarning } = this.state;
    const { t } = this.context;
    return (
      <AccountModalContainer
        className="export-private-key-modal"
        selectedIdentity={selectedIdentity}
        showBackButton={previousModalState === 'ACCOUNT_DETAILS'}
        backButtonAction={() => showAccountDetailModal()}
      >
        <span className="export-private-key-modal__account-name">{name}</span>
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
        <span className="export-private-key-modal__body-title">
          {this.context.t('showPrivateKeys')}
        </span>
        <div className="export-private-key-modal__password">
          {this.renderPasswordInput(privateKey)}
        </div>
        <div className="export-private-key-modal__password--warning">
          {this.context.t('privateKeyWarning')}
        </div>
        {this.renderButtons(privateKey, address, hideModal)}
      </AccountModalContainer>
    );
  }
}
