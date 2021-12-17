import { connect } from 'react-redux';
import { getSelectedIdentity } from '@view/selectors';
import {
  clearAccountDetails,
  exportAccount,
  hideModal,
  hideWarning,
  showModal,
} from '@view/store/actions';
import ExportPrivateKeyModal from './component';

function mapStateToPropsFactory() {
  let selectedIdentity = null;
  return function mapStateToProps(state) {
    // We should **not** change the identity displayed here even if it changes from underneath us.
    // If we do, we will be showing the user one private key and a **different** address and name.
    // Note that the selected identity **will** change from underneath us when we unlock the keyring
    // which is the expected behavior that we are side-stepping.
    selectedIdentity = selectedIdentity || getSelectedIdentity(state);
    return {
      warning: state.appState.warning,
      privateKey: state.appState.accountDetail.privateKey,
      selectedIdentity,
      previousModalState: state.appState.modal.previousModalState.name,
    };
  };
}

function mapDispatchToProps(dispatch) {
  return {
    exportAccount: (password, address) => {
      return dispatch(exportAccount(password, address)).then((res) => {
        dispatch(hideWarning());
        return res;
      });
    },
    showAccountDetailModal: () =>
      dispatch(
        showModal({
          name: 'ACCOUNT_DETAILS',
        }),
      ),
    hideModal: () => dispatch(hideModal()),
    hideWarning: () => dispatch(hideWarning()),
    clearAccountDetails: () => dispatch(clearAccountDetails()),
  };
}

export default connect(
  mapStateToPropsFactory,
  mapDispatchToProps,
)(ExportPrivateKeyModal);
