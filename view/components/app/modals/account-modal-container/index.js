import { getSelectedIdentity } from '@view/selectors';
import { hideModal } from '@view/store/actions';
import { connect } from 'react-redux';
import AccountModalContainer from './component';

function mapStateToProps(state, ownProps) {
  return {
    selectedIdentity: ownProps.selectedIdentity || getSelectedIdentity(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideModal: () => {
      dispatch(hideModal());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountModalContainer);
