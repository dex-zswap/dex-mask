import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getQrCodeData } from '@reducer/app';
import {
  getEnsError,
  getEnsResolution,
  resetEnsResolution,
} from '@reducer/ens';
import {
  addToAddressBook,
  qrCodeDetected,
  showQrScanner,
} from '@view/store/actions';
import AddContact from './component';

const mapStateToProps = (state) => {
  return {
    qrCodeData: getQrCodeData(state),
    ensError: getEnsError(state),
    ensResolution: getEnsResolution(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToAddressBook: (recipient, nickname) =>
      dispatch(addToAddressBook(recipient, nickname)),
    scanQrCode: () => dispatch(showQrScanner()),
    qrCodeDetected: (data) => dispatch(qrCodeDetected(data)),
    resetEnsResolution: () => dispatch(resetEnsResolution()),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(AddContact);
