import React, { useState, useCallback, useMemo, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { ethers } from 'ethers';
import { setSeedPhraseBackedUp, initializeThreeBox } from '@view/store/actions';
import { I18nContext } from '@view/contexts/i18n';
import Logo from '@c/ui/logo';
import Button from '@c/ui/button';
import TextField from '@c/ui/text-field';
import Steps from '@c/ui/steps';
import { INITIALIZE_SEED_PHRASE_ROUTE, INITIALIZE_SELECT_ACTION_ROUTE } from '@view/helpers/constants/routes';
export default function NewAccount({
  onSubmit
}) {
  const history = useHistory();
  const t = useContext(I18nContext);
  const [state, setState] = useState({
    password: '',
    confirmPassword: '',
    passwordError: '',
    confirmPasswordError: '',
    termsChecked: false
  });
  const isValid = useMemo(() => {
    const {
      password,
      confirmPassword,
      passwordError,
      confirmPasswordError
    } = state;

    if (!password || !confirmPassword || password !== confirmPassword || password.length < 8) {
      return false;
    }

    return !passwordError && !confirmPasswordError;
  }, [state]);
  const handlePasswordChange = useCallback(password => {
    setState(state => {
      const {
        confirmPassword
      } = state;
      let passwordError = '';
      let confirmPasswordError = '';

      if (password && password.length < 8) {
        passwordError = t('passwordNotLongEnough');
      }

      if (confirmPassword && password !== confirmPassword) {
        confirmPasswordError = t('passwordsDontMatch');
      }

      return Object.assign({}, state, {
        password,
        passwordError,
        confirmPasswordError
      });
    });
  }, [t]);
  const handleConfirmPasswordChange = useCallback(confirmPassword => {
    setState(state => {
      const {
        password
      } = state;
      let confirmPasswordError = '';

      if (password !== confirmPassword) {
        confirmPasswordError = t('passwordsDontMatch');
      }

      return Object.assign({}, state, {
        confirmPassword,
        confirmPasswordError
      });
    });
  }, [t]);
  const handleCreate = useCallback(async event => {
    event.preventDefault();

    if (!isValid) {
      return;
    }

    const {
      password
    } = state;

    try {
      await onSubmit(password);
      history.push(INITIALIZE_SEED_PHRASE_ROUTE);
    } catch (error) {
      setState(state => Object.assign({}, state, {
        passwordError: error.message
      }));
    }
  }, [isValid, state, onSubmit, history]);
  const handleCancel = useCallback(() => {
    history.push(INITIALIZE_SELECT_ACTION_ROUTE);
  }, [history]);
  return <div className="new-account__container dex-page-container space-between base-width">
      <div>
        <Logo plain />
        <div className="first-time-flow__header">
          <div className="first-time-flow__account-password">
            <p className="title">{t('createAWallet')}</p>
            <p className="sub-title">{t('createPassword')}</p>
          </div>
        </div>
        <Steps total={3} current={1} />
        <form className="first-time-flow__form" onSubmit={handleCreate}>
          <TextField id="create-password" label={t('newPassword')} type="password" className="first-time-flow__input" value={state.password} onChange={event => handlePasswordChange(event.target.value)} error={state.passwordError} bordered autoFocus />
          <TextField id="confirm-password" label={t('confirmPassword')} type="password" className="first-time-flow__input" value={state.confirmPassword} onChange={event => handleConfirmPasswordChange(event.target.value)} error={state.confirmPasswordError} bordered />
        </form>

      </div>
      <div className="first-time-flow__account-password-btns">
        <Button className="first-time-flow__button half-button" as="div" leftArrow onClick={handleCancel}>
          {t('pre')}
        </Button>
        <Button type="primary" className="first-time-flow__button half-button" disabled={!isValid} onClick={handleCreate}>
          {t('next')}
        </Button>
      </div>
    </div>;
}