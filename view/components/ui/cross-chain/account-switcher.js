import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Menu, MenuItem } from '@c/ui/menu'
import { useI18nContext } from '@view/hooks/useI18nContext'
import { getDexMaskAccountsOrdered } from '@view/selectors'

const AccountSwitcher = ({ onChange, address, needOutSide }) => {
  const accounts = useSelector(getDexMaskAccountsOrdered)
  const anchorElement = useRef(null)
  const t = useI18nContext()
  const [menuOpened, setMenuOpened] = useState(false)
  const allAccounts = useMemo(() => {
    const outside = needOutSide
    const allAccounts = accounts.map((account) =>
      Object.assign({}, account, {
        outside: false,
      }),
    )

    if (outside) {
      allAccounts.push({
        address: 'out-side-address',
        lastSelected: -1,
        name: t('outSide'),
      })
    }

    return allAccounts
  }, [needOutSide, accounts, t])
  const selectedAccount = useMemo(() => {
    return allAccounts.find((account) => address === account.address) || {}
  }, [address, allAccounts])
  const toggleMenu = useCallback(() => {
    setMenuOpened(!menuOpened)
  }, [menuOpened])
  const accountChange = useCallback(
    (account) => {
      toggleMenu()
      onChange(account)
    },
    [onChange, toggleMenu],
  )
  return (
    <div className='cross-chain__account-switcher'>
      <div
        className='cross-chain__account-switcher-name'
        ref={(el) => (anchorElement.current = el)}
        onClick={toggleMenu}
      >
        <span className='account-name' title={selectedAccount.name}>
          {selectedAccount.name}
        </span>
        <div className='account-switcher'></div>
        {menuOpened && (
          <Menu
            className='cross-chain__account-menu'
            anchorElement={anchorElement.current}
            onHide={toggleMenu}
          >
            {allAccounts.map((account) => (
              <MenuItem
                className={
                  selectedAccount.address === account.address ? 'active' : ''
                }
                key={account.address}
                onClick={() => accountChange(account)}
              >
                <div className='account-avatar'></div>
                <div className='account-name'>{account.name}</div>
              </MenuItem>
            ))}
          </Menu>
        )}
      </div>
    </div>
  )
}

export default AccountSwitcher
