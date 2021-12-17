import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
import Button from '@c/ui/button';
import TextField from '@c/ui/text-field';
import { DEFAULT_ROUTE } from '@view/helpers/constants/routes';
import { createNewVaultAndRestore, initializeThreeBox, unMarkPasswordForgotten } from '@view/store/actions';
const {
  isValidMnemonic
} = ethers.utils;

class RestoreVaultPage extends Component {
  static contextTypes = {
    t: PropTypes.func
  };
  static propTypes = {
    createNewVaultAndRestore: PropTypes.func.isRequired,
    leaveImportSeedScreenState: PropTypes.func,
    history: PropTypes.object,
    isLoading: PropTypes.bool,
    initializeThreeBox: PropTypes.func
  };
  state = {
    seedPhrase: '',
    showSeedPhrase: false,
    password: '',
    confirmPassword: '',
    seedPhraseError: null,
    passwordError: null,
    confirmPasswordError: null
  };
  parseSeedPhrase = seedPhrase => (seedPhrase || '').trim().toLowerCase().match(/\w+/gu)?.join(' ') || '';

  handleSeedPhraseChange(seedPhrase) {
    const {
      t
    } = this.context;
    let seedPhraseError = null;
    const wordCount = this.parseSeedPhrase(seedPhrase).split(/\s/u).length;

    if (seedPhrase && (wordCount % 3 !== 0 || wordCount < 12 || wordCount > 24)) {
      seedPhraseError = t('seedPhraseReq');
    } else if (!isValidMnemonic(seedPhrase)) {
      seedPhraseError = t('invalidSeedPhrase');
    }

    this.setState({
      seedPhrase,
      seedPhraseError
    });
  }

  handlePasswordChange(password) {
    const {
      confirmPassword
    } = this.state;
    let confirmPasswordError = null;
    let passwordError = null;

    if (password && password.length < 8) {
      passwordError = this.context.t('passwordNotLongEnough');
    }

    if (confirmPassword && password !== confirmPassword) {
      confirmPasswordError = this.context.t('passwordsDontMatch');
    }

    this.setState({
      password,
      passwordError,
      confirmPasswordError
    });
  }

  handleConfirmPasswordChange(confirmPassword) {
    const {
      password
    } = this.state;
    let confirmPasswordError = null;

    if (password !== confirmPassword) {
      confirmPasswordError = this.context.t('passwordsDontMatch');
    }

    this.setState({
      confirmPassword,
      confirmPasswordError
    });
  }

  onClick = () => {
    const {
      password,
      seedPhrase
    } = this.state;
    const {
      // eslint-disable-next-line no-shadow
      createNewVaultAndRestore,
      leaveImportSeedScreenState,
      history,
      // eslint-disable-next-line no-shadow
      initializeThreeBox
    } = this.props;
    leaveImportSeedScreenState();
    createNewVaultAndRestore(password, this.parseSeedPhrase(seedPhrase)).then(() => {
      initializeThreeBox();
      history.push(DEFAULT_ROUTE);
    });
  };

  hasError() {
    const {
      passwordError,
      confirmPasswordError,
      seedPhraseError
    } = this.state;
    return passwordError || confirmPasswordError || seedPhraseError;
  }

  toggleShowSeedPhrase = () => {
    this.setState(({
      showSeedPhrase
    }) => ({
      showSeedPhrase: !showSeedPhrase
    }));
  };

  render() {
    const {
      seedPhrase,
      showSeedPhrase,
      password,
      confirmPassword,
      seedPhraseError,
      passwordError,
      confirmPasswordError
    } = this.state;
    const {
      t
    } = this.context;
    const {
      isLoading
    } = this.props;
    const disabled = !seedPhrase || !password || !confirmPassword || isLoading || this.hasError();
    return <div className="first-view-main-wrapper">
        <div className="first-view-main">
          <div className="import-account">
            <div className="import-account__title">
              {this.context.t('restoreAccountWithSeed')}
            </div>
            <div className="import-account__selector-label">
              {this.context.t('secretPhrase')}
            </div>
            <div className="import-account__input-wrapper">
              <label className="import-account__input-label">
                {this.context.t('walletSeedRestore')}
              </label>
              <textarea className="import-account__secret-phrase" onChange={e => this.handleSeedPhraseChange(e.target.value)} value={seedPhrase} autoFocus placeholder={this.context.t('separateEachWord')} />
              <span className="error">{seedPhraseError}</span>
            </div>
            <TextField id="password" label={t('newPassword')} type="password" className="first-time-flow__input" value={this.state.password} onChange={event => this.handlePasswordChange(event.target.value)} error={passwordError} autoComplete="new-password" margin="normal" largeLabel />
            <TextField id="confirm-password" label={t('confirmPassword')} type="password" className="first-time-flow__input" value={this.state.confirmPassword} onChange={event => this.handleConfirmPasswordChange(event.target.value)} error={confirmPasswordError} autoComplete="confirm-password" margin="normal" largeLabel />
            <Button type="primary" className="first-time-flow__button restore-vault__button" onClick={() => !disabled && this.onClick()} disabled={disabled}>
              {this.context.t('restore')}
            </Button>
          </div>
        </div>
      </div>;
  }

}

export default connect(({
  appState: {
    isLoading
  }
}) => ({
  isLoading
}), dispatch => ({
  leaveImportSeedScreenState: () => {
    dispatch(unMarkPasswordForgotten());
  },
  createNewVaultAndRestore: (pw, seed) => dispatch(createNewVaultAndRestore(pw, seed)),
  initializeThreeBox: () => dispatch(initializeThreeBox())
}))(RestoreVaultPage);