import { clearConfirmTransaction } from '@reducer/confirm-transaction/confirm-transaction.duck';
import { getNativeCurrency } from '@reducer/dexmask/dexmask';
import { getMostRecentOverviewPage } from '@reducer/history/history';
import {
  conversionRateSelector,
  getTargetAccountWithSendEtherInfo,
  unconfirmedTransactionsListSelector,
} from '@view/selectors';
import {
  cancelEncryptionPublicKeyMsg,
  encryptionPublicKeyMsg,
  goHome,
} from '@view/store/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import ConfirmEncryptionPublicKey from './component';

function mapStateToProps(state) {
  const {
    metamask: { domainMetadata = {} },
  } = state;

  const unconfirmedTransactions = unconfirmedTransactionsListSelector(state);

  const txData = unconfirmedTransactions[0];

  const { msgParams: from } = txData;

  const fromAccount = getTargetAccountWithSendEtherInfo(state, from);

  return {
    txData,
    domainMetadata,
    fromAccount,
    requester: null,
    requesterAddress: null,
    conversionRate: conversionRateSelector(state),
    mostRecentOverviewPage: getMostRecentOverviewPage(state),
    nativeCurrency: getNativeCurrency(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    goHome: () => dispatch(goHome()),
    clearConfirmTransaction: () => dispatch(clearConfirmTransaction()),
    encryptionPublicKey: (msgData, event) => {
      const params = { data: msgData.msgParams, metamaskId: msgData.id };
      event.stopPropagation();
      return dispatch(encryptionPublicKeyMsg(params));
    },
    cancelEncryptionPublicKey: (msgData, event) => {
      event.stopPropagation();
      return dispatch(cancelEncryptionPublicKeyMsg(msgData));
    },
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ConfirmEncryptionPublicKey);
