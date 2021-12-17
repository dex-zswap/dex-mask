import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import Box from '@c/ui/box';
import Button from '@c/ui/button';
import CheckBox from '@c/ui/check-box';
import FormField from '@c/ui/form-field';
import Typography from '@c/ui/typography';
import { ALIGN_ITEMS, FONT_WEIGHT, JUSTIFY_CONTENT, TEXT_ALIGN, TYPOGRAPHY } from '@view/helpers/constants/design-system';
import { INITIALIZE_SEED_PHRASE_INTRO_ROUTE } from '@view/helpers/constants/routes';
import { useI18nContext } from '@view/hooks/useI18nContext';
export default function NewAccount({
  onSubmit
}) {
  const t = useI18nContext();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();
  const isValid = useMemo(() => {
    if (!password || !confirmPassword || password !== confirmPassword) {
      return false;
    }

    if (password.length < 8) {
      return false;
    }

    return !passwordError && !confirmPasswordError;
  }, [password, confirmPassword, passwordError, confirmPasswordError]);

  const handlePasswordChange = passwordInput => {
    let error = '';
    let confirmError = '';

    if (passwordInput && passwordInput.length < 8) {
      error = t('passwordNotLongEnough');
    }

    if (confirmPassword && passwordInput !== confirmPassword) {
      confirmError = t('passwordsDontMatch');
    }

    setPassword(passwordInput);
    setPasswordError(error);
    setConfirmPasswordError(confirmError);
  };

  const handleConfirmPasswordChange = confirmPasswordInput => {
    let error = '';

    if (password !== confirmPasswordInput) {
      error = t('passwordsDontMatch');
    }

    setConfirmPassword(confirmPasswordInput);
    setConfirmPasswordError(error);
  };

  const handleCreate = async event => {
    event.preventDefault();

    if (!isValid) {
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit(password);
      }

      history.push(INITIALIZE_SEED_PHRASE_INTRO_ROUTE);
    } catch (error) {
      setPasswordError(error.message);
    }
  };

  return <div className="new-account__wrapper">
      <Typography variant={TYPOGRAPHY.H2} fontWeight={FONT_WEIGHT.BOLD}>
        {t('createPassword')}
      </Typography>
      <Typography variant={TYPOGRAPHY.H4} align={TEXT_ALIGN.CENTER} boxProps={{
      margin: 5
    }}>
        {t('passwordSetupDetails')}
      </Typography>
      <Box justifyContent={JUSTIFY_CONTENT.CENTER} marginTop={3} padding={[0, 12]}>
        <form className="new-account__form" onSubmit={handleCreate}>
          <FormField autoFocus error={passwordError} onChange={handlePasswordChange} password={!showPassword} titleText={t('newPassword')} value={password} titleDetail={<button className="new-account__form--password-button" type="button" onClick={e => {
          e.preventDefault();
          setShowPassword(!showPassword);
        }}>
                {showPassword ? t('hide') : t('show')}
              </button>} />
          <FormField onChange={handleConfirmPasswordChange} password={!showPassword} error={confirmPasswordError} titleText={t('confirmPassword')} value={confirmPassword} titleDetail={isValid && <div className="new-account__form--checkmark">
                  <i className="fas fa-check" />
                </div>} />
          <Box alignItems={ALIGN_ITEMS.CENTER} justifyContent={JUSTIFY_CONTENT.SPACE_BETWEEN} marginBottom={4}>
            <CheckBox onClick={() => setTermsChecked(!termsChecked)} checked={termsChecked} />
            <Typography variant={TYPOGRAPHY.H5} boxProps={{
            marginLeft: 3
          }}>
              {t('passwordTermsWarning', [<a onClick={e => e.stopPropagation()} key="new-account__link-text" href="https://metamask.io/terms.html" target="_blank" rel="noopener noreferrer">
                  <span className="new-account__link-text">
                    {t('learnMore')}
                  </span>
                </a>])}
            </Typography>
          </Box>
          <Button type="primary" className="new-account__form--submit-button" disabled={!isValid || !termsChecked} onClick={handleCreate} rounded>
            {t('createNewWallet')}
          </Button>
        </form>
      </Box>
    </div>;
}
NewAccount.propTypes = {
  onSubmit: PropTypes.func
};