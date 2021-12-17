import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FileInput from 'react-simple-file-input';
import { compose } from 'redux';
import Logo from '@c/ui/logo';
import BackBar from '@c/ui/back-bar';
import Button from '@c/ui/button';
import TextField from '@c/ui/text-field';

import { getMostRecentOverviewPage } from '@reducer/history/history';
import { getMetaMaskAccounts } from '@view/selectors';
import * as actions from '@view/store/actions';

const HELP_LINK =
  'https://metamask.zendesk.com/hc/en-us/articles/360015489331-Importing-an-Account';

class JsonImportSubview extends Component {
  static contextTypes = {
    t: PropTypes.func,
  };

  state = {
    fileContents: '',
    isEmpty: true,
  };

  inputRef = React.createRef();

  shouldDisableImport() {
    const enabled = !this.state.isEmpty && this.state.fileContents !== '';
    return !enabled;
  }

  render() {
    const { error, history, mostRecentOverviewPage } = this.props;
    const enabled = !this.state.isEmpty && this.state.fileContents !== '';

    return (
      <div className="new-account-import-form__json">
        <p>{this.context.t('usedByClients')}</p>
        <a
          className="warning"
          href={HELP_LINK}
          target="_blank"
          rel="noopener noreferrer"
        >
          {this.context.t('fileImportFail')}
        </a>
        <FileInput
          readAs="text"
          onLoad={this.onLoad.bind(this)}
          style={{
            padding: '20px 0px 12px 15%',
            fontSize: '15px',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        />
        <TextField
          className="new-account-import-form__input-password"
          type="password"
          placeholder={this.context.t('enterPassword')}
          id="json-password-box"
          onKeyPress={this.createKeyringOnEnter.bind(this)}
          onChange={() => this.checkInputEmpty()}
          ref={this.inputRef}
          bordered
        />
        {error ? <span className="error">{error}</span> : null}
      </div>
    );
  }

  onLoad(event) {
    this.setState({
      fileContents: event.target.result,
    });
  }

  createKeyringOnEnter(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.createNewKeychain();
    }
  }

  createNewKeychain() {
    const {
      firstAddress,
      displayWarning,
      history,
      importNewJsonAccount,
      mostRecentOverviewPage,
      setSelectedAddress,
    } = this.props;
    const { fileContents } = this.state;

    if (!fileContents) {
      const message = this.context.t('needImportFile');
      displayWarning(message);
      return;
    }

    const password = this.inputRef.current.value;

    importNewJsonAccount([fileContents, password])
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

  checkInputEmpty() {
    const password = this.inputRef.current.value;
    let isEmpty = true;
    if (password !== '') {
      isEmpty = false;
    }
    this.setState({ isEmpty });
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.appState.warning,
    firstAddress: Object.keys(getMetaMaskAccounts(state))[0],
    mostRecentOverviewPage: getMostRecentOverviewPage(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    displayWarning: (warning) => dispatch(actions.displayWarning(warning)),
    importNewJsonAccount: (options) =>
      dispatch(actions.importNewAccount('JSON File', options)),
    setSelectedAddress: (address) =>
      dispatch(actions.setSelectedAddress(address)),
  };
};

const ComposedComponent = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(JsonImportSubview);


export default React.forwardRef((props, ref) => <ComposedComponent {...props} forwardedRef={ref} />);