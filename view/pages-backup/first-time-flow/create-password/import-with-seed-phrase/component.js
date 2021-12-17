import React, { PureComponent } from 'react';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
import Button from '@c/ui/button';
import TextField from '@c/ui/text-field';
import { INITIALIZE_END_OF_FLOW_ROUTE } from '@view/helpers/constants/routes';
const { isValidMnemonic } = ethers.utils;
export default class ImportWithSeedPhrase extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  };
  static propTypes = {
    history: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    setSeedPhraseBackedUp: PropTypes.func,
    initializeThreeBox: PropTypes.func,
  };
  state = {
    seedPhrase: '',
    showSeedPhrase: false,
    password: '',
    confirmPassword: '',
    seedPhraseError: '',
    passwordError: '',
    confirmPasswordError: '',
    termsChecked: true,
  };
  parseSeedPhrase = (seedPhrase) =>
    (seedPhrase || '').trim().toLowerCase().match(/\w+/gu)?.join(' ') || '';

  UNSAFE_componentWillMount() {
    this._onBeforeUnload = () => {};

    window.addEventListener('beforeunload', this._onBeforeUnload);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this._onBeforeUnload);
  }

  handleSeedPhraseChange(seedPhrase) {
    let seedPhraseError = '';

    if (seedPhrase) {
      const parsedSeedPhrase = this.parseSeedPhrase(seedPhrase);
      const wordCount = parsedSeedPhrase.split(/\s/u).length;

      if (wordCount % 3 !== 0 || wordCount > 24 || wordCount < 12) {
        seedPhraseError = this.context.t('seedPhraseReq');
      } else if (!isValidMnemonic(parsedSeedPhrase)) {
        seedPhraseError = this.context.t('invalidSeedPhrase');
      }
    }

    this.setState({
      seedPhrase,
      seedPhraseError,
    });
  }

  handlePasswordChange(password) {
    const { t } = this.context;
    this.setState((state) => {
      const { confirmPassword } = state;
      let confirmPasswordError = '';
      let passwordError = '';

      if (password && password.length < 8) {
        passwordError = t('passwordNotLongEnough');
      }

      if (confirmPassword && password !== confirmPassword) {
        confirmPasswordError = t('passwordsDontMatch');
      }

      return {
        password,
        passwordError,
        confirmPasswordError,
      };
    });
  }

  handleConfirmPasswordChange(confirmPassword) {
    const { t } = this.context;
    this.setState((state) => {
      const { password } = state;
      let confirmPasswordError = '';

      if (password !== confirmPassword) {
        confirmPasswordError = t('passwordsDontMatch');
      }

      return {
        confirmPassword,
        confirmPasswordError,
      };
    });
  }

  handleImport = async (event) => {
    event.preventDefault();

    if (!this.isValid()) {
      return;
    }

    const { password, seedPhrase } = this.state;
    const {
      history,
      onSubmit,
      setSeedPhraseBackedUp,
      initializeThreeBox,
    } = this.props;

    try {
      await onSubmit(password, this.parseSeedPhrase(seedPhrase));
      setSeedPhraseBackedUp(true).then(async () => {
        initializeThreeBox();
        history.push(INITIALIZE_END_OF_FLOW_ROUTE);
      });
    } catch (error) {
      this.setState({
        seedPhraseError: error.message,
      });
    }
  };
  handleCancel = () => {
    this.props.history.goBack();
  };

  isValid() {
    const {
      seedPhrase,
      password,
      confirmPassword,
      passwordError,
      confirmPasswordError,
      seedPhraseError,
    } = this.state;

    if (
      !password ||
      !confirmPassword ||
      !seedPhrase ||
      password !== confirmPassword
    ) {
      return false;
    }

    if (password.length < 8) {
      return false;
    }

    return !passwordError && !confirmPasswordError && !seedPhraseError;
  }

  onTermsKeyPress = ({ key }) => {
    if (key === ' ' || key === 'Enter') {
      this.toggleTermsCheck();
    }
  };
  toggleShowSeedPhrase = () => {
    this.setState(({ showSeedPhrase }) => ({
      showSeedPhrase: !showSeedPhrase,
    }));
  };

  render() {
    const { t } = this.context;
    const {
      seedPhraseError,
      showSeedPhrase,
      passwordError,
      confirmPasswordError,
    } = this.state;
    return (
      <form
        className="first-time-flow__form import-with-seed-phrase__form"
        onSubmit={this.handleImport}
      >
        <div className="first-time-flow__header">
          {t('importAccountSeedPhrase')}
        </div>
        <div className="first-time-flow__text-block">{t('secretPhrase')}</div>
        <div className="first-time-flow__textarea-wrapper">
          <label>{t('walletSeed')}</label>
          <textarea
            className="first-time-flow__textarea"
            onChange={(e) => this.handleSeedPhraseChange(e.target.value)}
            value={this.state.seedPhrase}
            placeholder={t('seedPhrasePlaceholder')}
            autoComplete="off"
          />
          {seedPhraseError && <span className="error">{seedPhraseError}</span>}
        </div>
        <TextField
          id="password"
          label={t('newPassword')}
          type="password"
          className="first-time-flow__input"
          value={this.state.password}
          onChange={(event) => this.handlePasswordChange(event.target.value)}
          error={passwordError}
          autoComplete="new-password"
          margin="normal"
          largeLabel
        />
        <TextField
          id="confirm-password"
          label={t('confirmPassword')}
          type="password"
          className="first-time-flow__input"
          value={this.state.confirmPassword}
          onChange={(event) =>
            this.handleConfirmPasswordChange(event.target.value)
          }
          error={confirmPasswordError}
          autoComplete="new-password"
          margin="normal"
          largeLabel
        />
        <div className="import-seed__btn-wrapper">
          <Button
            className="first-time-flow__button"
            leftArrow
            onClick={this.handleCancel}
            as="div"
          >
            {t('pre')}
          </Button>
          <Button
            type="primary"
            submit
            className="first-time-flow__button"
            rightArrow
            disabled={!this.isValid()}
          >
            {t('import')}
          </Button>
        </div>
      </form>
    );
  }
}
