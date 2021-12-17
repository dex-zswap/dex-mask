import { connect } from 'react-redux';
import { getNativeCurrency } from '@reducer/dexmask/dexmask';
import { getSendAssetAddress, updateSendAsset } from '@reducer/send';
import {
  getAssetImages,
  getDexMaskAccounts,
  getNativeCurrencyImage,
} from '@view/selectors';
import SendAssetRow from './component';

function mapStateToProps(state) {
  return {
    tokens: state.metamask.tokens,
    selectedAddress: state.metamask.selectedAddress,
    sendAssetAddress: getSendAssetAddress(state),
    accounts: getDexMaskAccounts(state),
    nativeCurrency: getNativeCurrency(state),
    nativeCurrencyImage: getNativeCurrencyImage(state),
    assetImages: getAssetImages(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSendAsset: ({ type, details }) =>
      dispatch(
        updateSendAsset({
          type,
          details,
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SendAssetRow);
