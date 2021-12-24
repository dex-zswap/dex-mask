import { connect } from 'react-redux'
import { getMostRecentOverviewPage } from '@reducer/history/history'
import { isExtensionUrl } from '@view/helpers/utils'
import {
  getAccountToConnectToActiveTab,
  getOrderedConnectedAccountsForActiveTab,
  getPermissionsForActiveTab,
  getSelectedAddress,
} from '@view/selectors'
import {
  addPermittedAccount,
  removePermittedAccount,
  setSelectedAddress,
} from '@view/store/actions'
import ConnectedAccounts from './component'

const mapStateToProps = (state) => {
  const { activeTab } = state
  const accountToConnect = getAccountToConnectToActiveTab(state)
  const connectedAccounts = getOrderedConnectedAccountsForActiveTab(state)
  const permissions = getPermissionsForActiveTab(state)
  const selectedAddress = getSelectedAddress(state)
  const isActiveTabExtension = isExtensionUrl(activeTab)
  return {
    accountToConnect,
    isActiveTabExtension,
    activeTabOrigin: activeTab.origin,
    connectedAccounts,
    mostRecentOverviewPage: getMostRecentOverviewPage(state),
    permissions,
    selectedAddress,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addPermittedAccount: (origin, address) =>
      dispatch(addPermittedAccount(origin, address)),
    removePermittedAccount: (origin, address) =>
      dispatch(removePermittedAccount(origin, address)),
    setSelectedAddress: (address) => dispatch(setSelectedAddress(address)),
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { activeTabOrigin } = stateProps
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    connectAccount: (address) =>
      dispatchProps.addPermittedAccount(activeTabOrigin, address),
    removePermittedAccount: (address) =>
      dispatchProps.removePermittedAccount(activeTabOrigin, address),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(ConnectedAccounts)
