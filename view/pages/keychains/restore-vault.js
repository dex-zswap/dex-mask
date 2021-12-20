import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';
import Button from '@c/ui/button';
import Logo from '@c/ui/logo';
import TextField from '@c/ui/text-field';
import { DEFAULT_ROUTE } from '@view/helpers/constants/routes';
import { useI18nContext } from '@view/hooks/useI18nContext';
import {
  createNewVaultAndRestore,
  initializeThreeBox,
  unMarkPasswordForgotten,
} from '@view/store/actions';
const { isValidMnemonic } = ethers.utils;
export default function RestoreVaultPage() {
  const t = useI18nContext();
  const history = useHistory();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.appState);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [seedPhraseError, setSeedPhraseError] = useState();
  const [passwordError, setPasswordError] = useState();
  const [confirmPasswordError, setConfirmPasswordError] = useState();

  const parseSeedPhrase = (phrase) =>
    (phrase || '').trim().toLowerCase().match(/\w+/gu)?.join(' ') || '';

  const handleSeedPhraseChange = (phrase) => {
    let phraseError = null;
    const wordCount = parseSeedPhrase(phrase).split(/\s/u).length;

    if (phrase && (wordCount % 3 !== 0 || wordCount < 12 || wordCount > 24)) {
      phraseError = t('seedPhraseReq');
    } else if (!isValidMnemonic(phrase)) {
      phraseError = t('invalidSeedPhrase');
    }

    setSeedPhrase(phrase);
    setSeedPhraseError(phraseError);
  };

  const handlePasswordChange = (pwd) => {
    let confirmPwdError = null;
    let pwdError = null;

    if (pwd && pwd.length < 8) {
      pwdError = t('passwordNotLongEnough');
    }

    if (confirmPassword && pwd !== confirmPassword) {
      confirmPwdError = t('passwordsDontMatch');
    }

    setPassword(pwd);
    setPasswordError(pwdError);
    setConfirmPasswordError(confirmPwdError);
  };

  const handleConfirmPasswordChange = (confirmPwd) => {
    let confirmPwdError = null;

    if (password !== confirmPwd) {
      confirmPwdError = t('passwordsDontMatch');
    }

    setConfirmPassword(confirmPwd);
    setConfirmPasswordError(confirmPwdError);
  };

  const onClick = () => {
    dispatch(unMarkPasswordForgotten());
    dispatch(
      createNewVaultAndRestore(password, parseSeedPhrase(seedPhrase)),
    ).then(() => {
      dispatch(initializeThreeBox());
      history.push(DEFAULT_ROUTE);
    });
  };

  const hasError = () => {
    return passwordError || confirmPasswordError || seedPhraseError;
  };

  const disabled =
    !seedPhrase || !password || !confirmPassword || isLoading || hasError();
  return (
    <div className="dex-page-container">
      <Logo plain isCenter />
      <div className="restore-vault-wrap base-width">
        <div className="restore-vault-title">{t('restoreAccountWithSeed')}</div>
        <div className="restore-vault-subtitle">{t('secretPhrase')}</div>
        <div className="setting-item">
          <div className="setting-label">{t('walletSeedRestore')}</div>
          <TextField
            value={seedPhrase}
            onChange={(e) => handleSeedPhraseChange(e.target.value)}
            placeholder={t('separateEachWord')}
            autoFocus
          />
        </div>
        <div className="setting-item">
          <div className="setting-label">{t('newPassword')}</div>
          <TextField
            type="password"
            value={password}
            onChange={(event) => handlePasswordChange(event.target.value)}
            error={passwordError}
            autoComplete="new-password"
            margin="normal"
          />
        </div>
        <div className="setting-item">
          <div className="setting-label">{t('confirmPassword')}</div>
          <TextField
            type="password"
            className="first-time-flow__input"
            value={confirmPassword}
            onChange={({ target }) => handleConfirmPasswordChange(target.value)}
            error={confirmPasswordError}
            autoComplete="confirm-password"
          />
        </div>
        <div className="bottom-fixed-btn-group">
          <Button
            type="primary"
            onClick={() => !disabled && onClick()}
            disabled={disabled}
          >
            {t('restore')}
          </Button>
        </div>
      </div>
    </div>
  );
}
