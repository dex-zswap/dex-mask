import { connect } from 'react-redux';
import { getIsAssetSendable, getSendTo } from '@reducer/send';
import { accountsWithSendEtherInfoSelector, checkNetworkAndAccountSupports1559, getAddressBookEntry, getIsEthGasPriceFetched, getNoGasPriceFetched } from '@view/selectors';
import * as actions from '@view/store/actions';
import SendContent from './component';

function mapStateToProps(state) {
  const ownedAccounts = accountsWithSendEtherInfoSelector(state);
  const to = getSendTo(state);
  return {
    isAssetSendable: getIsAssetSendable(state),
    isOwnedAccount: Boolean(ownedAccounts.find(({
      address
    }) => address.toLowerCase() === to.toLowerCase())),
    contact: getAddressBookEntry(state, to),
    isEthGasPrice: getIsEthGasPriceFetched(state),
    noGasPrice: getNoGasPriceFetched(state),
    to,
    networkAndAccountSupports1559: checkNetworkAndAccountSupports1559(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showAddToAddressBookModal: recipient => dispatch(actions.showModal({
      name: 'ADD_TO_ADDRESSBOOK',
      recipient
    }))
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const {
    to,
    ...restStateProps
  } = stateProps;
  return { ...ownProps,
    ...restStateProps,
    showAddToAddressBookModal: () => dispatchProps.showAddToAddressBookModal(to)
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SendContent);