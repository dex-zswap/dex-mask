import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Button from '@c/ui/button';
import TextField from '@c/ui/text-field';
import { getMostRecentOverviewPage } from '@reducer/history/history';
import { getMetaMaskAccounts } from '@view/selectors';
import * as actions from '@view/store/actions';

class PrivateKeyImportView extends Component {
  static contextTypes = {
    t: PropTypes.func,
  };

  inputRef = React.createRef();

  state = { isEmpty: true };

  shouldDisableImport() {
    return this.state.isEmpty;
  }

  createNewKeychain() {
    const privateKey = this.inputRef.current.value;
    const {
      importNewAccount,
      history,
      displayWarning,
      mostRecentOverviewPage,
      setSelectedAddress,
      firstAddress,
    } = this.props;

    importNewAccount('Private Key', [privateKey])
      .then(({ selectedAddress }) => {
        if (selectedAddress) {
          history.push(mostRecentOverviewPage);
          displayWarning(null);
        } else {
          displayWarning('Error importing account.');
          setSelectedAddress(firstAddress);
        }
      })
      .catch((err) => err && displayWarning(err.message || err));
  }

  createKeyringOnEnter = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.createNewKeychain();
    }
  };

  checkInputEmpty() {
    const privateKey = this.inputRef.current.value;
    let isEmpty = true;
    if (privateKey !== '') {
      isEmpty = false;
    }
    this.setState({ isEmpty });
  }

  render() {
    const { error, displayWarning } = this.props;

    return (
      <div className="new-account-import-form__private-key">
        <div className="new-account-import-form__private-key-password-container">
          <TextField
            className="new-account-import-form__input-password"
            label={this.context.t('pastePrivateKey')}
            type="password"
            id="private-key-box"
            onKeyPress={(e) => this.createKeyringOnEnter(e)}
            onChange={() => this.checkInputEmpty()}
            ref={this.inputRef}
            autoFocus
            bordered
          />
        </div>
        {error ? <span className="error">{error}</span> : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    error: state.appState.warning,
    firstAddress: Object.keys(getMetaMaskAccounts(state))[0],
    mostRecentOverviewPage: getMostRecentOverviewPage(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    importNewAccount: (strategy, [privateKey]) => {
      return dispatch(actions.importNewAccount(strategy, [privateKey]));
    },
    displayWarning: (message) =>
      dispatch(actions.displayWarning(message || null)),
    setSelectedAddress: (address) =>
      dispatch(actions.setSelectedAddress(address)),
  };
}

const ComposedComponent = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(PrivateKeyImportView);

export default React.forwardRef((props, ref) => <ComposedComponent {...props} forwardedRef={ref} />);