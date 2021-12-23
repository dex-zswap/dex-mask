import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import getCaretCoordinates from 'textarea-caret';
import Button from '@c/ui/button';
import Logo from '@c/ui/logo';
import TextField from '@c/ui/text-field';
import {
  DEFAULT_ROUTE,
  RESTORE_VAULT_ROUTE,
} from '@view/helpers/constants/routes';
import {
  forceupdateDexmaskState,
  forgotPassword,
  markPasswordForgotten,
  showModal,
  tryUnlockDexmask,
} from '@view/store/actions';
import { EventEmitter } from 'events';

class UnlockPage extends Component {
  static contextTypes = {
    t: PropTypes.func,
  };
  static propTypes = {
    history: PropTypes.object.isRequired,
    isUnlocked: PropTypes.bool,
    onRestore: PropTypes.func,
    onSubmit: PropTypes.func,
    forceupdateDexmaskState: PropTypes.func,
    showOptInModal: PropTypes.func,
    markPasswordForgotten: PropTypes.func,
  };
  state = {
    password: process.env.DEXMASK_DEBUG ? '11111111' : '',
    error: null,
  };
  submitting = false;
  animationEventEmitter = new EventEmitter();

  UNSAFE_componentWillMount() {
    const { isUnlocked, history } = this.props;

    if (isUnlocked) {
      history.push(DEFAULT_ROUTE);
    }
  }

  handleImport = () => {
    this.props.history.push(RESTORE_VAULT_ROUTE);
  };
  handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const { password } = this.state;
    const { onSubmit, forceupdateDexmaskState, showOptInModal } = this.props;

    if (password === '' || this.submitting) {
      return;
    }

    this.setState({
      error: null,
    });
    this.submitting = true;

    try {
      await onSubmit(password);
      const newState = await forceupdateDexmaskState();
    } catch ({ message }) {
      if (message === 'Incorrect password') {
        const newState = await forceupdateDexmaskState();
      }

      this.setState({
        error: message,
      });
      this.submitting = false;
    }
  };

  handleInputChange({ target }) {
    this.setState({
      password: target.value,
      error: null,
    }); // tell mascot to look at page action

    if (target.getBoundingClientRect) {
      const element = target;
      const boundingRect = element.getBoundingClientRect();
      const coordinates = getCaretCoordinates(element, element.selectionEnd);
      this.animationEventEmitter.emit('point', {
        x: boundingRect.left + coordinates.left - element.scrollLeft,
        y: boundingRect.top + coordinates.top - element.scrollTop,
      });
    }
  }

  renderSubmitButton() {
    const style = {
      color: 'white',
      marginTop: '20px',
      height: '48px',
      fontWeight: '400',
      boxShadow: 'none',
      borderRadius: '4px',
    };
    return (
      <Button
        type="primary"
        style={style}
        disabled={!this.state.password}
        variant="contained"
        onClick={this.handleSubmit}
      >
        {this.context.t('unlock')}
      </Button>
    );
  }

  render() {
    const { password, error } = this.state;
    const { t } = this.context;
    const { onRestore } = this.props;
    return (
      <div className="unlock-page__container base-width">
        <div className="unlock-page">
          <div className="unlock-page__mascot-container">
            <Logo isCenter />
          </div>
          <h1 className="unlock-page__title">{t('welcomeBack')}</h1>
          <div className="unlock-page__message">{t('rightWay')}</div>
          <form className="unlock-page__form" onSubmit={this.handleSubmit}>
            <TextField
              id="password"
              label={t('password')}
              type="password"
              value={password}
              onChange={(event) => this.handleInputChange(event)}
              error={error}
              autoFocus
              autoComplete="current-password"
              bordered
            />
          </form>
          {this.renderSubmitButton()}
          <div className="unlock-page__links">
            {t('importAccountText', [
              <button
                key="import-account"
                className="unlock-page__link unlock-page__link--import"
                onClick={this.handleImport}
              >
                {t('importAccountLinkText')}
              </button>,
            ])}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    metamask: { isUnlocked },
  } = state;
  return {
    isUnlocked,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    forgotPassword: () => dispatch(forgotPassword()),
    tryUnlockDexmask: (password) => dispatch(tryUnlockDexmask(password)),
    markPasswordForgotten: () => dispatch(markPasswordForgotten()),
    forceupdateDexmaskState: () => forceupdateDexmaskState(dispatch),
    showOptInModal: () =>
      dispatch(
        showModal({
          name: 'METAMETRICS_OPT_IN_MODAL',
        }),
      ),
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {
    // eslint-disable-next-line no-shadow
    markPasswordForgotten,
    // eslint-disable-next-line no-shadow
    tryUnlockDexmask,
    ...restDispatchProps
  } = dispatchProps;
  const { history, onSubmit: ownPropsSubmit, ...restOwnProps } = ownProps;

  const onImport = async () => {
    await markPasswordForgotten();
    history.push(RESTORE_VAULT_ROUTE);
  };

  const onSubmit = async (password) => {
    await tryUnlockDexmask(password);
    history.push(DEFAULT_ROUTE);
  };

  return {
    ...stateProps,
    ...restDispatchProps,
    ...restOwnProps,
    onRestore: onImport,
    onSubmit: ownPropsSubmit || onSubmit,
    history,
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
)(UnlockPage);
