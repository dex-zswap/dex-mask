import React, { useCallback, useState, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import classnames from 'classnames'
import LongLetter from '@c/ui/long-letter'
import { Menu, MenuItem } from '@c/ui/menu'
import Identicon from '@c/ui/identicon'
import { getDexMaskAccountsOrdered, getSelectedIdentity } from '@view/selectors'
import { showAccountDetail } from '@view/store/actions'
import { shortenAddress } from '@view/helpers/utils'
export default function AccountSwitcher() {
  const [showAccounts, setShowAccounts] = useState(false)
  const dropTrigger = useRef(null)
  const dispatch = useDispatch()
  const accounts = useSelector(getDexMaskAccountsOrdered)
  const selectedIdentity = useSelector(getSelectedIdentity)
  const toggleAccountDrop = useCallback(() => {
    setShowAccounts((state) => !state)
  }, [])
  const selectedAddress = useMemo(() => selectedIdentity.address, [
    selectedIdentity.address,
  ])
  const selectAccount = useCallback(
    (address) => {
      toggleAccountDrop()

      if (selectedAddress === address) {
        return
      }

      dispatch(showAccountDetail(address))
    },
    [selectedAddress, showAccountDetail, dispatch],
  )
  return (
    <div className='selected-token-account-switcher'>
      {showAccounts && (
        <Menu
          className='base-width selected-token-account-switcher-menu'
          anchorElement={dropTrigger.current}
          onHide={toggleAccountDrop}
        >
          {accounts.map((account) => (
            <MenuItem
              wrapChildAsDiv
              key={account.address}
              onClick={() => selectAccount(account.address)}
            >
              <div className='account-list-option flex space-between items-center'>
                <div className='left-avatar flex items-center'>
                  <Identicon address={account.address} diameter={28} />
                  <p
                    className={classnames(
                      'account-name',
                      selectedAddress === account.address && 'active',
                    )}
                  >
                    <LongLetter text={account.name} length={9} />
                  </p>
                </div>
                <p
                  className={classnames(
                    'account-address',
                    selectedAddress === account.address && 'active',
                  )}
                >
                  {shortenAddress(account.address, 9, -6)}
                </p>
              </div>
            </MenuItem>
          ))}
        </Menu>
      )}
      <div className='account flex items-center'>
        <LongLetter text={selectedIdentity.name} length={10} />
        <div
          className='drop-trigger'
          onClick={toggleAccountDrop}
          ref={(el) => (dropTrigger.current = el)}
        ></div>
      </div>
    </div>
  )
}
