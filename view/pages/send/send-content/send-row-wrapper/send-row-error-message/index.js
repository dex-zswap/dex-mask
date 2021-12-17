import { connect } from 'react-redux';
import { getSendErrors } from '@reducer/send';
import SendRowErrorMessage from './component';
export default connect(mapStateToProps)(SendRowErrorMessage);

function mapStateToProps(state, ownProps) {
  return {
    errors: getSendErrors(state),
    errorType: ownProps.errorType,
  };
}
