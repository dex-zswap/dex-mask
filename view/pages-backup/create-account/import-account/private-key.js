import Button from '@c/ui/button';
import { getMostRecentOverviewPage } from '@reducer/history/history';
import { getMetaMaskAccounts } from '@view/selectors';
import * as actions from '@view/store/actions';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

class PrivateKeyImportView extends Component {
  static contextTypes = {
    t: PropTypes.func,
  };

  static propTypes = {
    importNewAccount: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    displayWarning: PropTypes.func.isRequired,
    setSelectedAddress: PropTypes.func.isRequired,
    firstAddress: PropTypes.string.isRequired,
    error: PropTypes.node,
    mostRecentOverviewPage: PropTypes.string.isRequired,
  };

  inputRef = React.createRef();

  state = { isEmpty: true };

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
        <span className="new-account-create-form__instruction">
          {this.context.t('pastePrivateKey')}
        </span>
        <div className="new-account-import-form__private-key-password-container">
          <input
            className="new-account-import-form__input-password"
            type="password"
            id="private-key-box"
            onKeyPress={(e) => this.createKeyringOnEnter(e)}
            onChange={() => this.checkInputEmpty()}
            ref={this.inputRef}
            autoFocus
          />
        </div>
        <div className="new-account-import-form__buttons">
          {/* <Button
            className="new-account-create-form__button"
            onClick={() => {
              const { history, mostRecentOverviewPage } = this.props;
              displayWarning(null);
              history.push(mostRecentOverviewPage);
            }}
          >
            {this.context.t('cancel')}
          </Button> */}
          <Button
            type="primary"
            className="new-account-create-form__button"
            onClick={() => this.createNewKeychain()}
            disabled={this.state.isEmpty}
          >
            {this.context.t('import')}
          </Button>
        </div>
        {error ? <span className="error">{error}</span> : null}
      </div>
    );
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(PrivateKeyImportView);

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