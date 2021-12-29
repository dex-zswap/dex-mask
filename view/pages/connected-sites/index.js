import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { getMostRecentOverviewPage } from '@reducer/history/history'
import { CONNECT_ROUTE } from '@view/helpers/constants/routes'
import {
  getConnectedDomainsForSelectedAddress,
  getCurrentAccountWithSendEtherInfo,
  getOriginOfCurrentTab,
  getPermissionDomains,
  getPermissionsMetadataHostCounts,
  getPermittedAccountsByOrigin,
  getSelectedAddress,
} from '@view/selectors'
import {
  getOpenMetamaskTabsIds,
  removePermissionsFor,
  removePermittedAccount,
  requestAccountsPermissionWithId,
} from '@view/store/actions'
import ConnectedSites from './component'

const mapStateToProps = (state) => {
  const { openMetaMaskTabs } = state.appState
  const { id } = state.activeTab
  const connectedDomains = getConnectedDomainsForSelectedAddress(state)
  const originOfCurrentTab = getOriginOfCurrentTab(state)
  const permittedAccountsByOrigin = getPermittedAccountsByOrigin(state)
  const selectedAddress = getSelectedAddress(state)
  const currentTabHasNoAccounts = !permittedAccountsByOrigin[originOfCurrentTab]
    ?.length
  let tabToConnect

  if (originOfCurrentTab && currentTabHasNoAccounts && !openMetaMaskTabs[id]) {
    tabToConnect = {
      origin: originOfCurrentTab,
    }
  }

  return {
    accountLabel: getCurrentAccountWithSendEtherInfo(state).name,
    connectedDomains,
    domains: getPermissionDomains(state),
    domainHostCount: getPermissionsMetadataHostCounts(state),
    mostRecentOverviewPage: getMostRecentOverviewPage(state),
    permittedAccountsByOrigin,
    selectedAddress,
    tabToConnect,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getOpenMetamaskTabsIds: () => dispatch(getOpenMetamaskTabsIds()),
    disconnectAccount: (domainKey, address) => {
      dispatch(removePermittedAccount(domainKey, address))
    },
    disconnectAllAccounts: (domainKey, domain) => {
      const permissionMethodNames = domain.permissions.map(
        ({ parentCapability }) => parentCapability,
      )
      dispatch(
        removePermissionsFor({
          [domainKey]: permissionMethodNames,
        }),
      )
    },
    requestAccountsPermissionWithId: (origin) =>
      dispatch(requestAccountsPermissionWithId(origin)),
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {
    connectedDomains,
    domains,
    mostRecentOverviewPage,
    selectedAddress,
    tabToConnect,
  } = stateProps
  const {
    disconnectAccount,
    disconnectAllAccounts,
    // eslint-disable-next-line no-shadow
    requestAccountsPermissionWithId,
  } = dispatchProps
  const { history, onClose } = ownProps
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    closePopover: onClose,
    disconnectAccount: (domainKey) => {
      disconnectAccount(domainKey, selectedAddress)

      if (connectedDomains.length === 1) {
        onClose()
      }
    },
    disconnectAllAccounts: (domainKey) => {
      disconnectAllAccounts(domainKey, domains[domainKey])

      if (connectedDomains.length === 1) {
        onClose()
      }
    },
    requestAccountsPermission: async () => {
      const id = await requestAccountsPermissionWithId(tabToConnect.origin)
      history.push(`${CONNECT_ROUTE}/${id}`)
    },
  }
}

export default compose(withRouter, connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
))(ConnectedSites)
