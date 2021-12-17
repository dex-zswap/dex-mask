import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  clearConfirmTransaction,
  setTransactionToConfirm,
} from '@reducer/confirm-transaction/confirm-transaction.duck';
import { getConfirmedAction } from '@reducer/dexmask/dexmask';
import { getMostRecentOverviewPage } from '@reducer/history/history';
import { getSendTo } from '@reducer/send';
import { isTokenMethodAction } from '@view/helpers/utils/transactions.util';
import { unconfirmedTransactionsListSelector } from '@view/selectors';
import {
  getContractMethodData,
  getTokenParams,
  setDefaultHomeActiveTabName,
} from '@view/store/actions';
import ConfirmTransaction from './component';

const mapStateToProps = (state, ownProps) => {
  const {
    metamask: { unapprovedTxs },
  } = state;
  const {
    match: { params = {} },
  } = ownProps;
  const { id } = params;
  const sendTo = getSendTo(state);
  const unconfirmedTransactions = unconfirmedTransactionsListSelector(state);
  const totalUnconfirmed = unconfirmedTransactions.length;
  const transaction = totalUnconfirmed
    ? unapprovedTxs[id] || unconfirmedTransactions[0]
    : {};
  const { id: transactionId, type } = transaction;
  return {
    totalUnapprovedCount: totalUnconfirmed,
    sendTo,
    unapprovedTxs,
    id,
    confirmedAction: getConfirmedAction(state),
    mostRecentOverviewPage: getMostRecentOverviewPage(state),
    paramsTransactionId: id && String(id),
    transactionId: transactionId && String(transactionId),
    transaction,
    isTokenMethodAction: isTokenMethodAction(type),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setTransactionToConfirm: (transactionId) => {
      dispatch(setTransactionToConfirm(transactionId));
    },
    clearConfirmTransaction: () => dispatch(clearConfirmTransaction()),
    getContractMethodData: (data) => dispatch(getContractMethodData(data)),
    getTokenParams: (tokenAddress) => dispatch(getTokenParams(tokenAddress)),
    setDefaultHomeActiveTabName: (tabName) =>
      dispatch(setDefaultHomeActiveTabName(tabName)),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ConfirmTransaction);
