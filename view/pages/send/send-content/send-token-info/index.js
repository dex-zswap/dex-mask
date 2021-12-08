import { getNativeCurrency } from '@reducer/dexmask/dexmask';
import {
  getSendAssetAddress,
  getSendStage,
  updateSendAsset,
} from '@reducer/send';
import {
  getAssetImages,
  getMetaMaskAccounts,
  getNativeCurrencyImage,
} from '@view/selectors';
import { showAccountDetail } from '@view/store/actions';
import { connect } from 'react-redux';
import SendAssetRow from './component';

function mapStateToProps(state) {
  return {
    tokens: state.metamask.tokens,
    sendAssetAddress: getSendAssetAddress(state),
    accounts: getMetaMaskAccounts(state),
    nativeCurrency: getNativeCurrency(state),
    nativeCurrencyImage: getNativeCurrencyImage(state),
    assetImages: getAssetImages(state),
    sendStage: getSendStage(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSendAsset: ({ type, details }) =>
      dispatch(updateSendAsset({ type, details })),
    showAccountDetail: (address) => dispatch(showAccountDetail(address)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SendAssetRow);
