import { connect } from 'react-redux';
import { compose } from 'redux';
import withModalProps from '@view/helpers/higher-order-components/with-modal-props';
import { setParticipateInMetaMetrics } from '@view/store/actions';
import MetaMetricsOptInModal from './component';

const mapStateToProps = (_, ownProps) => {
  const { unapprovedTxCount } = ownProps;
  return {
    unapprovedTxCount,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setParticipateInMetaMetrics: (val) =>
      dispatch(setParticipateInMetaMetrics(val)),
  };
};

export default compose(
  withModalProps,
  connect(mapStateToProps, mapDispatchToProps),
)(MetaMetricsOptInModal);
