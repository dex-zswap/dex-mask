import withModalProps from '@view/helpers/higher-order-components/with-modal-props';
import { delRpcTarget } from '@view/store/actions';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ConfirmDeleteNetwork from './component';

const mapDispatchToProps = (dispatch) => {
  return {
    delRpcTarget: (target) => dispatch(delRpcTarget(target)),
  };
};

export default compose(
  withModalProps,
  connect(null, mapDispatchToProps),
)(ConfirmDeleteNetwork);
