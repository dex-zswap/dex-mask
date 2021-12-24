import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ConnectedAccountsList from '@c/app/connected/accounts-list'
import ConnectedAccountsPermissions from '@c/app/connected/accounts-permissions'
import Popover from '@c/ui/popover'
export default class ConnectedAccounts extends PureComponent {
  static contextTypes = {
    t: PropTypes.func.isRequired,
  }
  static defaultProps = {
    accountToConnect: null,
    permissions: undefined,
  }

  render() {
    const {
      accountToConnect,
      activeTabOrigin,
      isActiveTabExtension,
      connectAccount,
      connectedAccounts,
      history,
      mostRecentOverviewPage,
      permissions,
      selectedAddress,
      removePermittedAccount,
      setSelectedAddress,
      onClose,
    } = this.props
    const { t } = this.context
    const connectedAccountsDescription =
      connectedAccounts.length > 1
        ? t('connectedAccountsDescriptionPlural', [connectedAccounts.length])
        : t('connectedAccountsDescriptionSingular')
    return (
      <Popover
        title={
          isActiveTabExtension
            ? t('currentExtension')
            : new URL(activeTabOrigin).host
        }
        subtitle={
          connectedAccounts.length
            ? connectedAccountsDescription
            : t('connectedAccountsEmptyDescription')
        }
        onClose={onClose}
        footerClassName='connected-accounts__footer'
        footer={<ConnectedAccountsPermissions permissions={permissions} />}
      >
        <ConnectedAccountsList
          accountToConnect={accountToConnect}
          connectAccount={connectAccount}
          connectedAccounts={connectedAccounts}
          selectedAddress={selectedAddress}
          removePermittedAccount={removePermittedAccount}
          setSelectedAddress={setSelectedAddress}
          shouldRenderListOptions
        />
      </Popover>
    )
  }
}
