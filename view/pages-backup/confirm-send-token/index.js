import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { clearConfirmTransaction } from '@reducer/confirm-transaction/confirm-transaction.duck';
import { ASSET_TYPES, editTransaction } from '@reducer/send';
import { sendTokenTokenAmountAndToAddressSelector } from '@view/selectors';
import { showSendTokenPage } from '@view/store/actions';
import ConfirmSendToken from './component';

const mapStateToProps = (state) => {
  const { tokenAmount } = sendTokenTokenAmountAndToAddressSelector(state);
  return {
    tokenAmount,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editTransaction: ({ txData, tokenData, tokenProps: assetDetails }) => {
      const { id } = txData;
      dispatch(
        editTransaction(
          ASSET_TYPES.TOKEN,
          id.toString(),
          tokenData,
          assetDetails,
        ),
      );
      dispatch(clearConfirmTransaction());
      dispatch(showSendTokenPage());
    },
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ConfirmSendToken);
