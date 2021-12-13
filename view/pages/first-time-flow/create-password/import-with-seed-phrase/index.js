import React, { useState, useCallback, useMemo, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ethers } from 'ethers';

import { setSeedPhraseBackedUp, initializeThreeBox } from '@view/store/actions';

import { I18nContext } from '@view/contexts/i18n';

import Logo from '@c/ui/logo';
import Button from '@c/ui/button';
import TextField from '@c/ui/text-field';
import { INITIALIZE_END_OF_FLOW_ROUTE } from '@view/helpers/constants/routes';

// import ImportWithSeedPhrase from './component';

const mapDispatchToProps = (dispatch) => {
  return {
    setSeedPhraseBackedUp: (seedPhraseBackupState) =>
      dispatch(setSeedPhraseBackedUp(seedPhraseBackupState)),
    initializeThreeBox: () => dispatch(initializeThreeBox()),
  };
};

// export default connect(null, mapDispatchToProps)(ImportWithSeedPhrase);

export default function ImportWithSeedPhrase() {
  const history = useHistory();
  const t = useContext(I18nContext);

  const [state, setState] = useState({
    seedPhrase: '',
    showSeedPhrase: false,
    password: '',
    confirmPassword: '',
    seedPhraseError: '',
    passwordError: '',
    confirmPasswordError: '',
    termsChecked: true
  });

  const isValid = useMemo(() => {
    const {
      seedPhrase,
      password,
      confirmPassword,
      passwordError,
      confirmPasswordError,
      seedPhraseError,
    } = state;

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
  }, [state]);

  const handleSeedPhraseChange = useCallback((seedPhrase) => {
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

    // this.setState({ seedPhrase, seedPhraseError });
  }, [state])

  const handlePasswordChange = useCallback((password) => {
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
  }, [state])

  const handleConfirmPasswordChange = useCallback((confirmPassword) => {
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
  }, [state])

  const handleImport = useCallback(async (event) => {
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
      // this.setState({ seedPhraseError: error.message });
    }
  }, [history]);

  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);

  const toggleShowSeedPhrase = useCallback(() => {
    this.setState(({ showSeedPhrase }) => ({
      showSeedPhrase: !showSeedPhrase,
    }));
  }, []);

  return (
    <div className="import-with-seed-phrase dex-page-container space-between">
      <form
        className="first-time-flow__form import-with-seed-phrase__form base-width"
        onSubmit={handleImport}
      >
        <Logo className="create-password-logo" plain />
        <div className="first-time-flow__header">
          {t('importAccountSeedPhrase')}
        </div>
        <div className="first-time-flow__text-block">{t('secretPhrase')}</div>
        <div className="first-time-flow__textarea-wrapper">
          <label>{t('walletSeed')}</label>
          <textarea
            className="first-time-flow__textarea"
            onChange={(e) => handleSeedPhraseChange(e.target.value)}
            value={state.seedPhrase}
            placeholder={t('seedPhrasePlaceholder')}
            autoComplete="off"
          />
          {state.seedPhraseError && <span className="error">{state.seedPhraseError}</span>}
        </div>
        <TextField
          id="password"
          label={t('newPassword')}
          type="password"
          className="first-time-flow__input"
          value={state.password}
          onChange={(event) => this.handlePasswordChange(event.target.value)}
          error={state.passwordError}
          autoComplete="new-password"
          margin="normal"
          largeLabel
        />
        <TextField
          id="confirm-password"
          label={t('confirmPassword')}
          type="password"
          className="first-time-flow__input"
          value={state.confirmPassword}
          onChange={(event) => handleConfirmPasswordChange(event.target.value)}
          error={state.confirmPasswordError}
          autoComplete="new-password"
          margin="normal"
          largeLabel
        />
      </form>
      <div className="import-seed__btn-wrapper base-width">
        <Button
          className="half-button"
          onClick={handleCancel}
          as="div"
        >
          {t('pre')}
        </Button>
        <Button
          type="primary"
          className="half-button"
          disabled={!isValid}
        >
          {t('import')}
        </Button>
      </div>
    </div>
  );
}

