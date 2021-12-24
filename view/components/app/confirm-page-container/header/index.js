import React from 'react'
import PropTypes from 'prop-types'
import { getEnvironmentType } from '@app/scripts/lib/util'
import NetworkDisplay from '@c/app/network-display'
import AccountMismatchWarning from '@c/ui/account-mismatch-warning'
import Identicon from '@c/ui/identicon'
import {
  ENVIRONMENT_TYPE_NOTIFICATION,
  ENVIRONMENT_TYPE_POPUP,
} from '@shared/constants/app'
import { shortenAddress } from '@view/helpers/utils'
import { useI18nContext } from '@view/hooks/useI18nContext'
export default function ConfirmPageContainerHeader({
  onEdit,
  showEdit,
  accountAddress,
  showAccountInHeader,
  children,
}) {
  const t = useI18nContext()
  const windowType = getEnvironmentType()
  const isFullScreen =
    windowType !== ENVIRONMENT_TYPE_NOTIFICATION &&
    windowType !== ENVIRONMENT_TYPE_POPUP
  return children

  if (!showEdit && isFullScreen) {
    return children
  }

  return (
    <div className='confirm-page-container-header'>
      <div className='confirm-page-container-header__row'>
        {showAccountInHeader ? (
          <div className='confirm-page-container-header__address-container'>
            <div className='confirm-page-container-header__address-identicon'>
              <Identicon address={accountAddress} diameter={24} />
            </div>
            <div className='confirm-page-container-header__address'>
              {shortenAddress(accountAddress)}
            </div>
            <AccountMismatchWarning address={accountAddress} />
          </div>
        ) : (
          <div
            className='confirm-page-container-header__back-button-container'
            style={{
              visibility: showEdit ? 'initial' : 'hidden',
            }}
          >
            <span
              className='confirm-page-container-header__back-button'
              onClick={() => onEdit()}
            >
              {t('edit')}
            </span>
          </div>
        )}
        {!isFullScreen && <NetworkDisplay />}
      </div>
      {children}
    </div>
  )
}
ConfirmPageContainerHeader.propTypes = {
  accountAddress: PropTypes.string,
  showAccountInHeader: PropTypes.bool,
  showEdit: PropTypes.bool,
  onEdit: PropTypes.func,
  children: PropTypes.node,
}
