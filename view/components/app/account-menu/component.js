import React, { Component } from 'react'
import classnames from 'classnames'
import Fuse from 'fuse.js'
import { debounce } from 'lodash'
import PropTypes from 'prop-types'
import UserPreferencedCurrencyDisplay from '@c/app/user-preferenced/currency-display'
import SearchIcon from '@c/ui/search-icon'
import TextField from '@c/ui/text-field'
import Identicon from '@c/ui/identicon'
import { PRIMARY } from '@view/helpers/constants/common'
import {
  DEFAULT_ROUTE,
  IMPORT_ACCOUNT_ROUTE,
  NEW_ACCOUNT_ROUTE,
  SETTINGS_ROUTE,
} from '@view/helpers/constants/routes'
export function AccountMenuItem(props) {
  const { icon, children, text, subText, className, onClick } = props
  const itemClassName = classnames('account-menu__item', className, {
    'account-menu__item--clickable': Boolean(onClick),
  })
  return children ? (
    <div className={itemClassName} onClick={onClick}>
      {children}
    </div>
  ) : (
    <div className={itemClassName} onClick={onClick}>
      {icon ? <div className='account-menu__item__icon'>{icon}</div> : null}
      {text ? <div className='account-menu__item__text'>{text}</div> : null}
      {subText ? (
        <div className='account-menu__item__subtext'>{subText}</div>
      ) : null}
    </div>
  )
}
export default class AccountMenu extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }
  static propTypes = {
    shouldShowAccountsSearch: PropTypes.bool,
    accounts: PropTypes.array,
    history: PropTypes.object,
    isAccountMenuOpen: PropTypes.bool,
    keyrings: PropTypes.array,
    lockDexmask: PropTypes.func,
    selectedAddress: PropTypes.string,
    showAccountDetail: PropTypes.func,
    toggleAccountMenu: PropTypes.func,
    addressConnectedDomainMap: PropTypes.object,
    originOfCurrentTab: PropTypes.string,
  }
  accountsRef
  state = {
    searchQuery: '',
  }
  addressFuse = new Fuse([], {
    threshold: 0.45,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      {
        name: 'name',
        weight: 0.5,
      },
      {
        name: 'address',
        weight: 0.5,
      },
    ],
  })

  renderAccounts() {
    const {
      accounts,
      selectedAddress,
      keyrings,
      showAccountDetail,
      addressConnectedDomainMap,
      originOfCurrentTab,
    } = this.props
    const { searchQuery } = this.state
    let filteredIdentities = accounts

    if (searchQuery) {
      this.addressFuse.setCollection(accounts)
      filteredIdentities = this.addressFuse.search(searchQuery)
    }

    if (filteredIdentities.length === 0) {
      return (
        <p className='account-menu__no-accounts'>
          {this.context.t('noAccountsFound')}
        </p>
      )
    }

    return filteredIdentities.map((identity) => {
      const isSelected = identity.address === selectedAddress
      const simpleAddress = identity.address.substring(2).toLowerCase()
      const keyring = keyrings.find((kr) => {
        return (
          kr.accounts.includes(simpleAddress) ||
          kr.accounts.includes(identity.address)
        )
      })
      const addressDomains = addressConnectedDomainMap[identity.address] || {}
      const iconAndNameForOpenDomain = addressDomains[originOfCurrentTab]
      return (
        <div
          className={classnames([
            'account-menu__account flex items-center',
            isSelected && 'selected',
          ])}
          onClick={() => {
            showAccountDetail(identity.address)
          }}
          key={identity.address}
        >
          <div className='account-avatar'>
            <Identicon address={identity.address} diameter={28} />
          </div>
          <div className='account-menu__account-info'>
            <div className='account-menu__name'>{identity.name || ''}</div>
            <UserPreferencedCurrencyDisplay
              className='account-menu__balance'
              value={identity.balance}
              type={PRIMARY}
            />
          </div>
        </div>
      )
    })
  }

  render() {
    const { t } = this.context
    const {
      shouldShowAccountsSearch,
      isAccountMenuOpen,
      toggleAccountMenu,
      lockDexmask,
      history,
    } = this.props

    if (!isAccountMenuOpen) {
      return null
    }

    return (
      <>
        <div className='account-menu__close-area' onClick={toggleAccountMenu} />
        <div className='account-menu'>
          <AccountMenuItem className='account-menu__header flex space-between items-center'>
            {t('myAccounts')}
            <button
              className='account-menu__lock-button'
              onClick={() => {
                lockDexmask()
                history.push(DEFAULT_ROUTE)
              }}
            >
              {t('lock')}
            </button>
          </AccountMenuItem>
          <div className='account-menu__accounts-container'>
            <div
              className='account-menu__accounts'
              onScroll={this.onScroll}
              ref={(ref) => {
                this.accountsRef = ref
              }}
            >
              {this.renderAccounts()}
            </div>
          </div>
          <AccountMenuItem
            onClick={() => {
              toggleAccountMenu()
              history.push(NEW_ACCOUNT_ROUTE)
            }}
            className='account-menu__btn flex items-center'
            icon={<div className='icon account-menu__item-create-icon'></div>}
            text={t('createAccount')}
          />
          <AccountMenuItem
            onClick={() => {
              toggleAccountMenu()
              history.push(IMPORT_ACCOUNT_ROUTE)
            }}
            className='account-menu__btn flex items-center'
            icon={<div className='icon account-menu__item-import-icon'></div>}
            text={t('importAccount')}
          />
          <AccountMenuItem
            onClick={() => {
              toggleAccountMenu()
              history.push(SETTINGS_ROUTE)
            }}
            className='account-menu__btn flex items-center'
            icon={<div className='icon account-menu__item-settings-icon'></div>}
            text={t('settings')}
          />
        </div>
      </>
    )
  }
}
