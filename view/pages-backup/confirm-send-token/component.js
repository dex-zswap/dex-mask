import ConfirmTokenTransactionBaseContainer from '@pages/confirm-token-transaction-base';
import { SEND_ROUTE } from '@view/helpers/constants/routes';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class ConfirmSendToken extends Component {
  static propTypes = {
    history: PropTypes.object,
    editTransaction: PropTypes.func,
    tokenAmount: PropTypes.string,
  };

  handleEdit(confirmTransactionData) {
    const { editTransaction, history } = this.props;
    editTransaction(confirmTransactionData);
    history.push(SEND_ROUTE);
  }

  render() {
    const { tokenAmount } = this.props;

    return (
      <ConfirmTokenTransactionBaseContainer
        onEdit={(confirmTransactionData) =>
          this.handleEdit(confirmTransactionData)
        }
        tokenAmount={tokenAmount}
      />
    );
  }
}
