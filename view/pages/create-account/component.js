import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Logo from '@c/ui/logo';
import BackBar from '@c/ui/back-bar';
import Button from '@c/ui/button';
import TextField from '@c/ui/text-field';
export default class NewAccountCreateForm extends Component {
  static defaultProps = {
    newAccountNumber: 0
  };
  state = {
    newAccountName: '',
    defaultAccountName: this.context.t('newAccountNumberName', [this.props.newAccountNumber])
  };

  render() {
    const {
      newAccountName,
      defaultAccountName
    } = this.state;
    const {
      history,
      createAccount,
      mostRecentOverviewPage
    } = this.props;

    const createClick = _ => {
      createAccount(newAccountName || defaultAccountName).then(() => {
        history.push(mostRecentOverviewPage);
      }).catch(e => {});
    };

    return <div className="new-account-create-form dex-page-container space-between base-width">
        <>
          <div className="new-account-form-top">
            <Logo plain isCenter />
            <BackBar title={this.context.t('createAccount')} />
            <div className="new-account-create-form__input-container">
              <TextField className="new-account-create-form__input" label={this.context.t('accountName')} value={newAccountName} placeholder={defaultAccountName} onChange={event => this.setState({
              newAccountName: event.target.value
            })} bordered autoFocus />
            </div>
          </div>
          <div className="new-account-create-form__buttons flex space-between">
            <Button className="new-account-create-form__button half-button" onClick={() => this.props.history.go(-1)}>
              {this.context.t('pre')}
            </Button>
            <Button type="primary" className="new-account-create-form__button half-button" onClick={createClick}>
              {this.context.t('create')}
            </Button>
          </div>
        </>
      </div>;
  }

}
NewAccountCreateForm.propTypes = {
  createAccount: PropTypes.func,
  newAccountNumber: PropTypes.number,
  history: PropTypes.object,
  mostRecentOverviewPage: PropTypes.string.isRequired
};
NewAccountCreateForm.contextTypes = {
  t: PropTypes.func
};