import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { clearConfirmTransaction } from '@reducer/confirm-transaction/confirm-transaction.duck';
import { getMostRecentOverviewPage } from '@reducer/history/history';
import { conversionRateSelector, getTargetAccountWithSendEtherInfo, unconfirmedTransactionsListSelector } from '@view/selectors';
import { cancelDecryptMsg, decryptMsg, decryptMsgInline, goHome } from '@view/store/actions';
import ConfirmDecryptMessage from './component';

function mapStateToProps(state) {
  const {
    metamask: {
      domainMetadata = {}
    }
  } = state;
  const unconfirmedTransactions = unconfirmedTransactionsListSelector(state);
  const txData = unconfirmedTransactions[0];
  const {
    msgParams: {
      from
    }
  } = txData;
  const fromAccount = getTargetAccountWithSendEtherInfo(state, from);
  return {
    txData,
    domainMetadata,
    fromAccount,
    requester: null,
    requesterAddress: null,
    conversionRate: conversionRateSelector(state),
    mostRecentOverviewPage: getMostRecentOverviewPage(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    goHome: () => dispatch(goHome()),
    clearConfirmTransaction: () => dispatch(clearConfirmTransaction()),
    decryptMessage: (msgData, event) => {
      const params = msgData.msgParams;
      params.metamaskId = msgData.id;
      event.stopPropagation(event);
      return dispatch(decryptMsg(params));
    },
    cancelDecryptMessage: (msgData, event) => {
      event.stopPropagation(event);
      return dispatch(cancelDecryptMsg(msgData));
    },
    decryptMessageInline: (msgData, event) => {
      const params = msgData.msgParams;
      params.metamaskId = msgData.id;
      event.stopPropagation(event);
      return dispatch(decryptMsgInline(params));
    }
  };
}

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(ConfirmDecryptMessage);