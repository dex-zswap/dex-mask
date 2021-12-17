import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getNativeCurrency, getTokens } from '@reducer/dexmask/dexmask';
import { updateRecipient } from '@reducer/send';
import {
  getAllState,
  getCurrentChainId,
  getDexMaskAccountsOrdered,
  getSelectedAccount,
  getSelectedIdentity,
} from '@view/selectors';
import * as actions from '@view/store/actions';
import ReciveToken from './component';

const mapStateToProps = (state) => {
  return {
    allState: getAllState(state),
    allAccounts: getDexMaskAccountsOrdered(state),
    nativeCorrency: getNativeCurrency(state),
    selectedIdentity: getSelectedIdentity(state),
    selectedAccount: getSelectedAccount(state),
    tokens: getTokens(state),
    currentChainId: getCurrentChainId(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setProviderType: (type) => {
      dispatch(actions.setProviderType(type));
    },
    setRpcTarget: (...args) => {
      dispatch(actions.setRpcTarget(...args));
    },
    showAccountDetail: (address) => {
      dispatch(actions.showAccountDetail(address));
    },
    updateCrossChainState: (value) =>
      dispatch(actions.updateCrossChainState(value)),
    updateSendAsset: (value) => dispatch(actions.updateSendAsset(value)),
    updateRecipient: (value) => dispatch(updateRecipient(value)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ReciveToken),
);
