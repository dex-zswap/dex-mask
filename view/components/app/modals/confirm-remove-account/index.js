import withModalProps from '@view/helpers/higher-order-components/with-modal-props';
import {
  getCurrentChainId,
  getRpcPrefsForCurrentProvider,
} from '@view/selectors';
import { removeAccount } from '@view/store/actions';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ConfirmRemoveAccount from './component';

const mapStateToProps = (state) => {
  return {
    chainId: getCurrentChainId(state),
    rpcPrefs: getRpcPrefsForCurrentProvider(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeAccount: (address) => dispatch(removeAccount(address)),
  };
};

export default compose(
  withModalProps,
  connect(mapStateToProps, mapDispatchToProps),
)(ConfirmRemoveAccount);
