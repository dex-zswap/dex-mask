import * as actions from '@view/store/actions';
import { connect } from 'react-redux';
import AddToAddressBookModal from './component';

function mapStateToProps(state) {
  return {
    ...(state.appState.modal.modalState.props || {}),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideModal: () => dispatch(actions.hideModal()),
    addToAddressBook: (recipient, nickname) =>
      dispatch(actions.addToAddressBook(recipient, nickname)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddToAddressBookModal);
