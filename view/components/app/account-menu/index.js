import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getAddressConnectedDomainMap, getDexMaskAccountsOrdered, getMetaMaskKeyrings, getOriginOfCurrentTab, getSelectedAddress } from '@view/selectors';
import { hideSidebar, hideWarning, lockDexmask, showAccountDetail, toggleAccountMenu } from '@view/store/actions';
import AccountMenu from './component';
/**
 * The min amount of accounts to show search field
 */

const SHOW_SEARCH_ACCOUNTS_MIN_COUNT = 5;

function mapStateToProps(state) {
  const {
    metamask: {
      isAccountMenuOpen
    }
  } = state;
  const accounts = getDexMaskAccountsOrdered(state);
  const origin = getOriginOfCurrentTab(state);
  const selectedAddress = getSelectedAddress(state);
  return {
    isAccountMenuOpen,
    addressConnectedDomainMap: getAddressConnectedDomainMap(state),
    originOfCurrentTab: origin,
    selectedAddress,
    keyrings: getMetaMaskKeyrings(state),
    accounts,
    shouldShowAccountsSearch: accounts.length >= SHOW_SEARCH_ACCOUNTS_MIN_COUNT
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleAccountMenu: () => dispatch(toggleAccountMenu()),
    showAccountDetail: address => {
      dispatch(showAccountDetail(address));
      dispatch(hideSidebar());
      dispatch(toggleAccountMenu());
    },
    lockDexmask: () => {
      dispatch(lockDexmask());
      dispatch(hideWarning());
      dispatch(hideSidebar());
      dispatch(toggleAccountMenu());
    }
  };
}

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(AccountMenu);