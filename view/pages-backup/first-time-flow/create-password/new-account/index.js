import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '@c/ui/button';
import Steps from '@c/ui/steps';
import TextField from '@c/ui/text-field';
import { INITIALIZE_SEED_PHRASE_ROUTE, INITIALIZE_SELECT_ACTION_ROUTE } from '@view/helpers/constants/routes';
export default class NewAccount extends PureComponent {
  static contextTypes = {
    metricsEvent: PropTypes.func,
    t: PropTypes.func
  };
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };
  state = {
    password: '',
    confirmPassword: '',
    passwordError: '',
    confirmPasswordError: '',
    termsChecked: false
  };

  isValid() {
    const {
      password,
      confirmPassword,
      passwordError,
      confirmPasswordError
    } = this.state;

    if (!password || !confirmPassword || password !== confirmPassword) {
      return false;
    }

    if (password.length < 8) {
      return false;
    }

    return !passwordError && !confirmPasswordError;
  }

  handlePasswordChange(password) {
    const {
      t
    } = this.context;
    this.setState(state => {
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

      return {
        password,
        passwordError,
        confirmPasswordError
      };
    });
  }

  handleConfirmPasswordChange(confirmPassword) {
    const {
      t
    } = this.context;
    this.setState(state => {
      const {
        password
      } = state;
      let confirmPasswordError = '';

      if (password !== confirmPassword) {
        confirmPasswordError = t('passwordsDontMatch');
      }

      return {
        confirmPassword,
        confirmPasswordError
      };
    });
  }

  handleCreate = async event => {
    event.preventDefault();

    if (!this.isValid()) {
      return;
    }

    const {
      password
    } = this.state;
    const {
      onSubmit,
      history
    } = this.props;

    try {
      await onSubmit(password);
      history.push(INITIALIZE_SEED_PHRASE_ROUTE);
    } catch (error) {
      this.setState({
        passwordError: error.message
      });
    }
  };
  handleCancel = () => {
    const {
      history
    } = this.props;
    history.push(INITIALIZE_SELECT_ACTION_ROUTE);
  };
  toggleTermsCheck = () => {
    this.setState(prevState => ({
      termsChecked: !prevState.termsChecked
    }));
  };
  onTermsKeyPress = ({
    key
  }) => {
    if (key === ' ' || key === 'Enter') {
      this.toggleTermsCheck();
    }
  };

  render() {
    const {
      t
    } = this.context;
    const {
      password,
      confirmPassword,
      passwordError,
      confirmPasswordError,
      termsChecked
    } = this.state;
    return <div className="new-account__container">
        <div className="first-time-flow__header">
          <div className="first-time-flow__account-password">
            <span className="dark-text">{t('createWallet')}</span>
            <span className="sperator">/</span>
            <span className="light-text">{t('createPassword')}</span>
          </div>
        </div>
        <Steps total={3} current={1} />
        <form className="first-time-flow__form" onSubmit={this.handleCreate}>
          <TextField id="create-password" label={t('newPassword')} type="password" className="first-time-flow__input" value={password} onChange={event => this.handlePasswordChange(event.target.value)} error={passwordError} autoFocus autoComplete="new-password" margin="normal" fullWidth largeLabel />
          <TextField id="confirm-password" label={t('confirmPassword')} type="password" className="first-time-flow__input" value={confirmPassword} onChange={event => this.handleConfirmPasswordChange(event.target.value)} error={confirmPasswordError} autoComplete="confirm-password" margin="normal" fullWidth largeLabel />
          <div className="first-time-flow__account-password-btns">
            <Button className="first-time-flow__button" as="div" leftArrow onClick={this.handleCancel}>
              {t('pre')}
            </Button>
            <Button type="primary" className="first-time-flow__button" rightArrow submit disabled={!this.isValid()} onClick={this.handleCreate}>
              {t('next')}
            </Button>
          </div>
        </form>
      </div>;
  }

}