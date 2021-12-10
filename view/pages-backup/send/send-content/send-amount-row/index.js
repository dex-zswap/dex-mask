import {
  getSendAmount,
  getSendAsset,
  sendAmountIsInError,
  updateSendAmount,
} from '@reducer/send';
import { connect } from 'react-redux';
import SendAmountRow from './component';

export default connect(mapStateToProps, mapDispatchToProps)(SendAmountRow);

function mapStateToProps(state) {
  return {
    amount: getSendAmount(state),
    inError: sendAmountIsInError(state),
    asset: getSendAsset(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSendAmount: (newAmount) => dispatch(updateSendAmount(newAmount)),
  };
}
