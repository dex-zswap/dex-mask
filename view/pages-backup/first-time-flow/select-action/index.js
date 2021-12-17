import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getFirstTimeFlowTypeRoute } from '@view/selectors';
import { setFirstTimeFlowType } from '@view/store/actions';
import Welcome from './component';

const mapStateToProps = (state) => {
  return {
    nextRoute: getFirstTimeFlowTypeRoute(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFirstTimeFlowType: (type) => dispatch(setFirstTimeFlowType(type)),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Welcome);
