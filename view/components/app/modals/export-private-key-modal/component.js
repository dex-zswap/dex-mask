import React, { Component } from 'react';
import copyToClipboard from 'copy-to-clipboard';
import { stripHexPrefix } from 'ethereumjs-util';
import log from 'loglevel';
import PropTypes from 'prop-types';
import AccountModalContainer from '@c/app/modals/account-modal-container';
import Button from '@c/ui/button';
import ReadOnlyInput from '@c/ui/readonly-input';
import { toChecksumHexAddress } from '@shared/modules/hexstring-utils';
export default class ExportPrivateKeyModal extends Component {
  static contextTypes = {
    t: PropTypes.func,
  };
  static defaultProps = {
    warning: null,
    previousModalState: null,
  };
  static propTypes = {
    exportAccount: PropTypes.func.isRequired,
    selectedIdentity: PropTypes.object.isRequired,
    warning: PropTypes.node,
    showAccountDetailModal: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    hideWarning: PropTypes.func.isRequired,
    clearAccountDetails: PropTypes.func.isRequired,
    previousModalState: PropTypes.string,
  };
  state = {
    password: '',
    privateKey: null,
    showWarning: true,
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

  renderPasswordLabel(privateKey) {
    return (
      <span className="export-private-key-modal__password-label">
        {privateKey
          ? this.context.t('copyPrivateKey')
          : this.context.t('typePassword')}
      </span>
    );
  }

  renderPasswordInput(privateKey) {
    const plainKey = privateKey && stripHexPrefix(privateKey);

    if (!privateKey) {
      return (
        <input
          type="password"
          className="export-private-key-modal__password-input"
          onChange={(event) =>
            this.setState({
              password: event.target.value,
            })
          }
        />
      );
    }

    return (
      <ReadOnlyInput
        wrapperClass="export-private-key-modal__password-display-wrapper"
        inputClass="export-private-key-modal__password-display-textarea"
        textarea
        value={plainKey}
        onClick={() => copyToClipboard(plainKey)}
      />
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
            type="primary"
            onClick={() => hideModal()}
            className="export-private-key-modal__button"
          >
            {this.context.t('done')}
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
    return (
      <AccountModalContainer
        className="export-private-key-modal"
        selectedIdentity={selectedIdentity}
        showBackButton={previousModalState === 'ACCOUNT_DETAILS'}
        backButtonAction={() => showAccountDetailModal()}
      >
        <span className="export-private-key-modal__account-name">{name}</span>
        <ReadOnlyInput
          wrapperClass="ellip-address-wrapper"
          value={toChecksumHexAddress(address)}
        />
        <div className="export-private-key-modal__divider" />
        <span className="export-private-key-modal__body-title">
          {this.context.t('showPrivateKeys')}
        </span>
        <div className="export-private-key-modal__password">
          {this.renderPasswordLabel(privateKey)}
          {this.renderPasswordInput(privateKey)}
          {showWarning && warning ? (
            <span className="export-private-key-modal__password--error">
              {warning}
            </span>
          ) : null}
        </div>
        <div className="export-private-key-modal__password--warning">
          {this.context.t('privateKeyWarning')}
        </div>
        {this.renderButtons(privateKey, address, hideModal)}
      </AccountModalContainer>
    );
  }
}
