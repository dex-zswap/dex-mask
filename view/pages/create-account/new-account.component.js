import PageTitle from '@c/app/page-title';
import Button from '@c/ui/button';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class NewAccountCreateForm extends Component {
  static defaultProps = {
    newAccountNumber: 0,
  };

  state = {
    newAccountName: '',
    defaultAccountName: this.context.t('newAccountNumberName', [
      this.props.newAccountNumber,
    ]),
  };

  render() {
    const { newAccountName, defaultAccountName } = this.state;
    const { history, createAccount, mostRecentOverviewPage } = this.props;
    const createClick = (_) => {
      createAccount(newAccountName || defaultAccountName)
        .then(() => {
          history.push(mostRecentOverviewPage);
        })
        .catch((e) => {});
    };

    return (
      <div className="new-account-create-form">
        <PageTitle
          title={this.context.t('manage')}
          subTitle={this.context.t('createAccount')}
        />
        <div className="new-account-create-form__input-label">
          {this.context.t('accountName')}
        </div>
        <div className="new-account-create-form__input-container">
          <input
            className="new-account-create-form__input"
            value={newAccountName}
            placeholder={defaultAccountName}
            onChange={(event) =>
              this.setState({ newAccountName: event.target.value })
            }
            autoFocus
          />
          <div className="new-account-create-form__buttons">
            <Button
              type="primary"
              className="new-account-create-form__button"
              rightArrow={true}
              onClick={createClick}
            >
              {this.context.t('create')}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

NewAccountCreateForm.propTypes = {
  createAccount: PropTypes.func,
  newAccountNumber: PropTypes.number,
  history: PropTypes.object,
  mostRecentOverviewPage: PropTypes.string.isRequired,
};

NewAccountCreateForm.contextTypes = {
  t: PropTypes.func,
};
