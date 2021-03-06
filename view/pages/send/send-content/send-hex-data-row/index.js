import { getSendHexData, updateSendHexData } from '@reducer/send';
import { connect } from 'react-redux';
import SendHexDataRow from './component';

export default connect(mapStateToProps, mapDispatchToProps)(SendHexDataRow);

function mapStateToProps(state) {
  return {
    data: getSendHexData(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSendHexData(data) {
      return dispatch(updateSendHexData(data));
    },
  };
}
