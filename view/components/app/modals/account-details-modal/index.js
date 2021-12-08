import {
  getCurrentChainId,
  getRpcPrefsForCurrentProvider,
  getSelectedIdentity,
} from '@view/selectors';
import { setAccountLabel, showModal } from '@view/store/actions';
import { connect } from 'react-redux';
import AccountDetailsModal from './component';

const mapStateToProps = (state) => {
  return {
    chainId: getCurrentChainId(state),
    selectedIdentity: getSelectedIdentity(state),
    keyrings: state.metamask.keyrings,
    provider: state.metamask.provider,
    rpcPrefs: getRpcPrefsForCurrentProvider(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showExportPrivateKeyModal: () =>
      dispatch(showModal({ name: 'EXPORT_PRIVATE_KEY' })),
    setAccountLabel: (address, label) =>
      dispatch(setAccountLabel(address, label)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountDetailsModal);
