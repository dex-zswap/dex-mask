import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { CONTACT_LIST_ROUTE, CONTACT_VIEW_ROUTE } from '@view/helpers/constants/routes';
import { getAddressBookEntry } from '@view/selectors';
import { addToAddressBook, removeFromAddressBook, setAccountLabel } from '@view/store/actions';
import EditContact from './component';

const mapStateToProps = (state, ownProps) => {
  const {
    location
  } = ownProps;
  const {
    pathname
  } = location;
  const pathNameTail = pathname.match(/[^/]+$/u)[0];
  const pathNameTailIsAddress = pathNameTail.includes('0x');
  const address = pathNameTailIsAddress ? pathNameTail.toLowerCase() : ownProps.match.params.id;
  const contact = getAddressBookEntry(state, address) || state.metamask.identities[address];
  const {
    memo,
    name
  } = contact || {};
  const {
    chainId
  } = state.metamask.provider;
  return {
    address: contact ? address : null,
    chainId,
    name,
    memo,
    viewRoute: CONTACT_VIEW_ROUTE,
    listRoute: CONTACT_LIST_ROUTE
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addToAddressBook: (recipient, nickname, memo) => dispatch(addToAddressBook(recipient, nickname, memo)),
    removeFromAddressBook: (chainId, addressToRemove) => dispatch(removeFromAddressBook(chainId, addressToRemove)),
    setAccountLabel: (address, label) => dispatch(setAccountLabel(address, label))
  };
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(EditContact);