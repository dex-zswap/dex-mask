import { hideModal, qrCodeDetected } from '@view/store/actions';
import { connect } from 'react-redux';
import QrScanner from './component';

const mapDispatchToProps = (dispatch) => {
  return {
    hideModal: () => dispatch(hideModal()),
    qrCodeDetected: (data) => dispatch(qrCodeDetected(data)),
  };
};

export default connect(null, mapDispatchToProps)(QrScanner);
