import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import InfoIcon from '@c/ui/icon/info-icon.component'
import Tooltip from '@c/ui/tooltip'
import { SEVERITIES } from '@view/helpers/constants/design-system'
import { useI18nContext } from '@view/hooks/useI18nContext'
import { getSelectedAccount } from '@view/selectors'
export default function AccountMismatchWarning({ address }) {
  const selectedAccount = useSelector(getSelectedAccount)
  const t = useI18nContext()

  if (selectedAccount.address === address) {
    return null
  }

  return (
    <Tooltip
      position='bottom'
      html={<p>{t('notCurrentAccount')}</p>}
      wrapperClassName='account-mismatch-warning__tooltip-wrapper'
      containerClassName='account-mismatch-warning__tooltip-container'
    >
      <div className='account-mismatch-warning__tooltip-container-icon'>
        <InfoIcon severity={SEVERITIES.WARNING} />
      </div>
    </Tooltip>
  )
}
