import React, { Component } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import PermissionsConnectFooter from '@c/app/permission/connect-footer'
import PermissionsConnectHeader from '@c/app/permission/connect-header'
import UserPreferencedCurrencyDisplay from '@c/app/user-preferenced/currency-display'
import Button from '@c/ui/button'
import CheckBox, { CHECKED, INDETERMINATE, UNCHECKED } from '@c/ui/check-box'
import LongLetter from '@c/ui/long-letter'
import Identicon from '@c/ui/identicon'
import Tooltip from '@c/ui/tooltip'
import { PRIMARY } from '@view/helpers/constants/common'
export default class ChooseAccount extends Component {
  state = {
    selectedAccounts: this.props.selectedAccountAddresses,
  }
  static defaultProps = {
    addressLastConnectedMap: {},
  }
  static contextTypes = {
    t: PropTypes.func,
  }

  handleAccountClick(address) {
    const { selectedAccounts } = this.state
    const newSelectedAccounts = new Set(selectedAccounts)

    if (newSelectedAccounts.has(address)) {
      newSelectedAccounts.delete(address)
    } else {
      newSelectedAccounts.add(address)
    }

    this.setState({
      selectedAccounts: newSelectedAccounts,
    })
  }

  selectAll() {
    const { accounts } = this.props
    const newSelectedAccounts = new Set(
      accounts.map((account) => account.address),
    )
    this.setState({
      selectedAccounts: newSelectedAccounts,
    })
  }

  deselectAll() {
    this.setState({
      selectedAccounts: new Set(),
    })
  }

  allAreSelected() {
    const { accounts } = this.props
    const { selectedAccounts } = this.state
    return accounts.every(({ address }) => selectedAccounts.has(address))
  }

  renderAccountsList = () => {
    const { accounts, nativeCurrency, addressLastConnectedMap } = this.props
    const { selectedAccounts } = this.state
    return (
      <div className='permissions-connect-choose-account__accounts-list'>
        {accounts.map((account, index) => {
          const { address, label, addressSliced, balance } = account
          return (
            <div
              key={`permissions-connect-choose-account-${index}`}
              onClick={() => this.handleAccountClick(address)}
              className='permissions-connect-choose-account__account'
            >
              <div className='permissions-connect-choose-account__account-info-wrapper'>
                <CheckBox
                  className='permissions-connect-choose-account__list-check-box'
                  checked={selectedAccounts.has(address)}
                />
                <Identicon
                  className='permissions-connect-choose-account__list-avatar'
                  diameter={28}
                  address={address}
                />
                <div className='permissions-connect-choose-account__account__info'>
                  <div className='permissions-connect-choose-account__account__label'>
                    <LongLetter text={label} length={10} subfix={addressSliced} />
                  </div>
                  <UserPreferencedCurrencyDisplay
                    className='permissions-connect-choose-account__account__balance'
                    type={PRIMARY}
                    value={balance}
                    style={{
                      color: '#C6C6C6',
                    }}
                    suffix={nativeCurrency}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  renderAccountsListHeader() {
    const { t } = this.context
    const { selectNewAccountViaModal, accounts } = this.props
    const { selectedAccounts } = this.state
    let checked

    if (this.allAreSelected()) {
      checked = CHECKED
    } else if (selectedAccounts.size === 0) {
      checked = UNCHECKED
    } else {
      checked = INDETERMINATE
    }

    return (
      <div
        className={classnames({
          'permissions-connect-choose-account__accounts-list-header--one-item':
            accounts.length === 1,
          'permissions-connect-choose-account__accounts-list-header--two-items':
            accounts.length > 1,
        })}
      >
        {accounts.length > 1 ? (
          <div className='permissions-connect-choose-account__select-all'>
            <CheckBox
              className='permissions-connect-choose-account__header-check-box'
              checked={checked}
              onClick={() =>
                this.allAreSelected() ? this.deselectAll() : this.selectAll()
              }
            />
            <div className='permissions-connect-choose-account__text-grey'>
              {this.context.t('selectAll')}
            </div>
            <Tooltip
              position='bottom'
              html={
                <div
                  style={{
                    width: 200,
                    padding: 4,
                  }}
                >
                  {t('selectingAllWillAllow')}
                </div>
              }
            >
              <div>
                <img src='/images/settings/info.png' width={12} height={12} />
              </div>
            </Tooltip>
          </div>
        ) : null}
      </div>
    )
  }

  render() {
    const {
      selectAccounts,
      permissionsRequestId,
      cancelPermissionsRequest,
      targetDomainMetadata,
      accounts,
    } = this.props
    const { selectedAccounts } = this.state
    const { t } = this.context
    return (
      <div className='permissions-connect-choose-account dex-page-container space-between base-width'>
        <div className='permissions-connect-choose-account__body-container'>
          <PermissionsConnectHeader
            icon={targetDomainMetadata.icon}
            iconName={targetDomainMetadata.name}
            headerText={
              accounts.length > 0
                ? t('selectAccounts')
                : t('connectAccountOrCreate')
            }
            siteOrigin={targetDomainMetadata.origin}
          />
          {this.renderAccountsListHeader()}
          {this.renderAccountsList()}
        </div>
        <div className='permissions-connect-choose-account__footer-container'>
          <PermissionsConnectFooter />
          <div className='permissions-connect-choose-account__bottom-buttons'>
            <Button
              className='half-button'
              onClick={() => cancelPermissionsRequest(permissionsRequestId)}
            >
              {t('cancel')}
            </Button>
            <Button
              className='half-button'
              onClick={() => selectAccounts(selectedAccounts)}
              type='primary'
              disabled={selectedAccounts.size === 0}
            >
              {t('next')}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
