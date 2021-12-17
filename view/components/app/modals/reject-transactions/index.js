import { connect } from 'react-redux';
import { compose } from 'redux';
import withModalProps from '@view/helpers/higher-order-components/with-modal-props';
import RejectTransactionsModal from './component';

const mapStateToProps = (_, ownProps) => {
  const { unapprovedTxCount } = ownProps;
  return {
    unapprovedTxCount,
  };
};

export default compose(
  withModalProps,
  connect(mapStateToProps),
)(RejectTransactionsModal);
