import React, { useState, useCallback, useMemo, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { setSeedPhraseBackedUp, initializeThreeBox } from '@view/store/actions';
import { I18nContext } from '@view/contexts/i18n';
import Logo from '@c/ui/logo';
import Button from '@c/ui/button';
import TextField from '@c/ui/text-field';
import { INITIALIZE_END_OF_FLOW_ROUTE } from '@view/helpers/constants/routes';
const { isValidMnemonic } = ethers.utils;

const mapDispatchToProps = (dispatch) => {
  return {
    setSeedPhraseBackedUp: (seedPhraseBackupState) =>
      dispatch(setSeedPhraseBackedUp(seedPhraseBackupState)),
    initializeThreeBox: () => dispatch(initializeThreeBox()),
  };
};

const parseSeedPhrase = (seedPhrase) =>
  (seedPhrase || '').trim().toLowerCase().match(/\w+/gu)?.join(' ') || '';

export default function ImportWithSeedPhrase({ onSubmit }) {
  const history = useHistory();
  const t = useContext(I18nContext);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    seedPhrase: '',
    password: '',
    confirmPassword: '',
    seedPhraseError: '',
    passwordError: '',
    confirmPasswordError: '',
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
  const handleSeedPhraseChange = useCallback(
    (seedPhrase) => {
      let seedPhraseError = '';

      if (seedPhrase) {
        const parsedSeedPhrase = parseSeedPhrase(seedPhrase);
        const wordCount = parsedSeedPhrase.split(/\s/u).length;

        if (wordCount % 3 !== 0 || wordCount > 24 || wordCount < 12) {
          seedPhraseError = t('seedPhraseReq');
        } else if (!isValidMnemonic(parsedSeedPhrase)) {
          seedPhraseError = t('invalidSeedPhrase');
        }
      }

      setState((state) =>
        Object.assign({}, state, {
          seedPhrase,
          seedPhraseError,
        }),
      );
    },
    [t],
  );
  const handlePasswordChange = useCallback(
    (password) => {
      setState((state) => {
        const { confirmPassword } = state;
        let confirmPasswordError = '';
        let passwordError = '';

        if (password && password.length < 8) {
          passwordError = t('passwordNotLongEnough');
        }

        if (confirmPassword && password !== confirmPassword) {
          confirmPasswordError = t('passwordsDontMatch');
        }

        return Object.assign({}, state, {
          password,
          passwordError,
          confirmPasswordError,
        });
      });
    },
    [t],
  );
  const handleConfirmPasswordChange = useCallback(
    (confirmPassword) => {
      setState((state) => {
        const { password } = state;
        let confirmPasswordError = '';

        if (password !== confirmPassword) {
          confirmPasswordError = t('passwordsDontMatch');
        }

        return Object.assign({}, state, {
          confirmPassword,
          confirmPasswordError,
        });
      });
    },
    [t],
  );
  const handleImport = useCallback(
    async (event) => {
      event.preventDefault();

      if (!isValid) {
        return;
      }

      const { password, seedPhrase } = state;

      try {
        await onSubmit(password, parseSeedPhrase(seedPhrase));
        dispatch(setSeedPhraseBackedUp(true)).then(async () => {
          dispatch(initializeThreeBox());
          history.push(INITIALIZE_END_OF_FLOW_ROUTE);
        });
      } catch (error) {
        setState({
          seedPhraseError: error.message,
        });
      }
    },
    [state, history, isValid, onSubmit],
  );
  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);
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
          {state.seedPhraseError && (
            <span className="error">{state.seedPhraseError}</span>
          )}
        </div>
        <TextField
          id="password"
          label={t('newPassword')}
          type="password"
          className="first-time-flow__input"
          value={state.password}
          onChange={(event) => handlePasswordChange(event.target.value)}
          error={state.passwordError}
          bordered
        />
        <TextField
          id="confirm-password"
          label={t('confirmPassword')}
          type="password"
          className="first-time-flow__input"
          value={state.confirmPassword}
          onChange={(event) => handleConfirmPasswordChange(event.target.value)}
          error={state.confirmPasswordError}
          bordered
        />
      </form>
      <div className="import-seed__btn-wrapper base-width">
        <Button className="half-button" onClick={handleCancel} as="div">
          {t('pre')}
        </Button>
        <Button
          type="primary"
          className="half-button"
          onClick={handleImport}
          disabled={!isValid}
        >
          {t('import')}
        </Button>
      </div>
    </div>
  );
}
