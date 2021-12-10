import { getOnboardingInitiator } from '@view/selectors';
import { setCompletedOnboarding } from '@view/store/actions';
import { connect } from 'react-redux';
import EndOfFlow from './component';

const firstTimeFlowTypeNameMap = {
  create: 'New Wallet Created',
  import: 'New Wallet Imported',
};

const mapStateToProps = (state) => {
  const {
    metamask: { firstTimeFlowType },
  } = state;

  return {
    completionMetaMetricsName: firstTimeFlowTypeNameMap[firstTimeFlowType],
    onboardingInitiator: getOnboardingInitiator(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCompletedOnboarding: () => dispatch(setCompletedOnboarding()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EndOfFlow);
