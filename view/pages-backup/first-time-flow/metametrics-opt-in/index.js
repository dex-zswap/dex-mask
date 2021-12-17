import { connect } from 'react-redux';
import { getFirstTimeFlowTypeRoute } from '@view/selectors';
import { setParticipateInMetaMetrics } from '@view/store/actions';
import MetaMetricsOptIn from './component';
const firstTimeFlowTypeNameMap = {
  create: 'Selected Create New Wallet',
  import: 'Selected Import Wallet',
};

const mapStateToProps = (state) => {
  const { firstTimeFlowType, participateInMetaMetrics } = state.metamask;
  return {
    nextRoute: getFirstTimeFlowTypeRoute(state),
    firstTimeSelectionMetaMetricsName:
      firstTimeFlowTypeNameMap[firstTimeFlowType],
    participateInMetaMetrics,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setParticipateInMetaMetrics: (val) =>
      dispatch(setParticipateInMetaMetrics(val)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MetaMetricsOptIn);
