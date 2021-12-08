import * as actions from '@view/store/actions';
import { connect } from 'react-redux';
import NewAccountModal from './component';

function mapStateToProps(state) {
  return {
    ...(state.appState.modal.modalState.props || {}),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideModal: () => dispatch(actions.hideModal()),
    createAccount: (newAccountName) => {
      return dispatch(actions.addNewAccount()).then((newAccountAddress) => {
        if (newAccountName) {
          dispatch(actions.setAccountLabel(newAccountAddress, newAccountName));
        }
        return newAccountAddress;
      });
    },
  };
}

function mergeProps(stateProps, dispatchProps) {
  const { onCreateNewAccount } = stateProps;
  const { createAccount } = dispatchProps;

  return {
    ...stateProps,
    ...dispatchProps,
    onSave: (newAccountName) => {
      return createAccount(newAccountName).then((newAccountAddress) =>
        onCreateNewAccount(newAccountAddress),
      );
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(NewAccountModal);
