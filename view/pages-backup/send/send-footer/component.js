import React, { Component } from 'react';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import PageContainerFooter from '@c/ui/page-container/page-container-footer';
import { CONFIRM_TRANSACTION_ROUTE } from '@view/helpers/constants/routes';
export default class SendFooter extends Component {
  static propTypes = {
    addToAddressBookIfNew: PropTypes.func,
    resetSendState: PropTypes.func,
    disabled: PropTypes.bool.isRequired,
    history: PropTypes.object,
    sign: PropTypes.func,
    to: PropTypes.string,
    toAccounts: PropTypes.array,
    sendErrors: PropTypes.object,
    gasEstimateType: PropTypes.string,
    mostRecentOverviewPage: PropTypes.string.isRequired,
  };
  static contextTypes = {
    t: PropTypes.func,
  };

  onCancel() {
    const { resetSendState, history, mostRecentOverviewPage } = this.props;
    resetSendState();
    history.push(mostRecentOverviewPage);
  }

  async onSubmit(event) {
    event.preventDefault();
    const {
      addToAddressBookIfNew,
      sign,
      to,
      toAccounts,
      history, // gasEstimateType,
    } = this.props; // TODO: add nickname functionality
    // await addToAddressBookIfNew(to, toAccounts);

    const promise = sign();
    Promise.resolve(promise).then(() => {
      history.push(CONFIRM_TRANSACTION_ROUTE);
    });
  }

  componentDidUpdate(prevProps) {
    const { sendErrors } = this.props;

    if (
      Object.keys(sendErrors).length > 0 &&
      isEqual(sendErrors, prevProps.sendErrors) === false
    ) {
      const errorField = Object.keys(sendErrors).find((key) => sendErrors[key]);
      const errorMessage = sendErrors[errorField];
    }
  }

  render() {
    return (
      <PageContainerFooter
        submitButtonType="primary"
        submitText="Trans"
        hideCancel={true}
        onSubmit={(e) => this.onSubmit(e)}
        disabled={this.props.disabled}
        rightArrow
      />
    );
  }
}
