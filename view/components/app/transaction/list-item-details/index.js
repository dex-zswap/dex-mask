import { connect } from 'react-redux';
import { toChecksumHexAddress } from '@shared/modules/hexstring-utils';
import { getAddressBook, getCurrentChainId, getRpcPrefsForCurrentProvider } from '@view/selectors';
import { tryReverseResolveAddress } from '@view/store/actions';
import TransactionListItemDetails from './component';

const mapStateToProps = (state, ownProps) => {
  const {
    metamask
  } = state;
  const {
    ensResolutionsByAddress
  } = metamask;
  const {
    recipientAddress,
    senderAddress
  } = ownProps;
  let recipientEns;

  if (recipientAddress) {
    const address = toChecksumHexAddress(recipientAddress);
    recipientEns = ensResolutionsByAddress[address] || '';
  }

  const addressBook = getAddressBook(state);

  const getNickName = address => {
    const entry = addressBook.find(contact => {
      return address.toLowerCase() === contact.address.toLowerCase();
    });
    return entry && entry.name || '';
  };

  const rpcPrefs = getRpcPrefsForCurrentProvider(state);
  return {
    rpcPrefs,
    recipientEns,
    provider: state.metamask.provider,
    chainId: getCurrentChainId(state),
    senderNickname: getNickName(senderAddress),
    recipientNickname: recipientAddress ? getNickName(recipientAddress) : null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    tryReverseResolveAddress: address => {
      return dispatch(tryReverseResolveAddress(address));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionListItemDetails);