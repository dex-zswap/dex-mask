import { getSendErrors } from '@reducer/send';
import { connect } from 'react-redux';
import SendRowErrorMessage from './component';

export default connect(mapStateToProps)(SendRowErrorMessage);

function mapStateToProps(state, ownProps) {
  return {
    errors: getSendErrors(state),
    errorType: ownProps.errorType,
  };
}
