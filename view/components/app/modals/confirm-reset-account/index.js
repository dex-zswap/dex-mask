import { connect } from 'react-redux';
import { compose } from 'redux';
import withModalProps from '@view/helpers/higher-order-components/with-modal-props';
import { resetAccount } from '@view/store/actions';
import ConfirmResetAccount from './component';

const mapDispatchToProps = dispatch => {
  return {
    resetAccount: () => dispatch(resetAccount())
  };
};

export default compose(withModalProps, connect(null, mapDispatchToProps))(ConfirmResetAccount);