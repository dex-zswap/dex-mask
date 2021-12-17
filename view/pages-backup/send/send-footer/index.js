import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';
import { addHexPrefix } from '@app/scripts/lib/util';
import { getSendToAccounts } from '@reducer/dexmask/dexmask';
import { getMostRecentOverviewPage } from '@reducer/history/history';
import {
  getGasPrice,
  getSendAmount,
  getSendErrors,
  getSendTo,
  isSendFormInvalid,
  resetSendState,
  signTransaction,
} from '@reducer/send';
import { addToAddressBook } from '@view/store/actions';
import SendFooter from './component';
export default connect(mapStateToProps, mapDispatchToProps)(SendFooter);

function addressIsNew(toAccounts, newAddress) {
  const newAddressNormalized = newAddress.toLowerCase();
  const foundMatching = toAccounts.some(
    ({ address }) => address.toLowerCase() === newAddressNormalized,
  );
  return !foundMatching;
}

function mapStateToProps(state) {
  // const gasButtonInfo = getRenderableEstimateDataForSmallButtonsFromGWEI(state);
  const gasPrice = getGasPrice(state); // const activeButtonIndex = getDefaultActiveButtonIndex(
  //   gasButtonInfo,
  //   gasPrice,
  // );
  // const gasEstimateType =
  //   activeButtonIndex >= 0
  //     ? gasButtonInfo[activeButtonIndex].gasEstimateType
  //     : 'custom';

  const amount = getSendAmount(state);
  return {
    disabled:
      isSendFormInvalid(state) ||
      !amount ||
      new BigNumber(amount).eq(new BigNumber(0)),
    to: getSendTo(state),
    toAccounts: getSendToAccounts(state),
    sendErrors: getSendErrors(state),
    // gasEstimateType,
    mostRecentOverviewPage: getMostRecentOverviewPage(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    resetSendState: () => dispatch(resetSendState()),
    sign: () => dispatch(signTransaction()),
    addToAddressBookIfNew: (newAddress, toAccounts, nickname = '') => {
      const hexPrefixedAddress = addHexPrefix(newAddress);

      if (addressIsNew(toAccounts, hexPrefixedAddress)) {
        // TODO: nickname, i.e. addToAddressBook(recipient, nickname)
        dispatch(addToAddressBook(hexPrefixedAddress, nickname));
      }
    },
  };
}
