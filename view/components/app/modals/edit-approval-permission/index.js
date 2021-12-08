import withModalProps from '@view/helpers/higher-order-components/with-modal-props';
import { getSelectedIdentity } from '@view/selectors';
import { connect } from 'react-redux';
import { compose } from 'redux';
import EditApprovalPermission from './component';

const mapStateToProps = (state) => {
  const modalStateProps = state.appState.modal.modalState.props || {};
  return {
    selectedIdentity: getSelectedIdentity(state),
    ...modalStateProps,
  };
};

export default compose(
  withModalProps,
  connect(mapStateToProps),
)(EditApprovalPermission);
