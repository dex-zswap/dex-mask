import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import copyToClipboard from 'copy-to-clipboard'
import { useI18nContext } from '@view/hooks/useI18nContext'
import { getSelectedIdentity } from '@view/selectors'
import QrView from '@c/ui/qr-code'
import TopHeader from '@c/ui/top-header'
import BackBar from '@c/ui/back-bar'
import Tooltip from '@c/ui/tooltip'
import { toChecksumHexAddress } from '@shared/modules/hexstring-utils'
import { SECOND } from '@shared/constants/time'

const ReciveToken = () => {
  const t = useI18nContext()
  const selectedIdentity = useSelector(getSelectedIdentity)
  const address = useMemo(
    () => toChecksumHexAddress(selectedIdentity.address),
    [selectedIdentity],
  )
  const [state, setState] = useState({
    copied: false,
  })
  const copyTimeout = useRef(null)
  const copyAddress = useCallback(() => {
    setState((state) =>
      Object.assign({}, state, {
        copied: true,
      }),
    )
    copyTimeout.current = setTimeout(
      () =>
        setState((state) =>
          Object.assign({}, state, {
            copied: false,
          }),
        ),
      SECOND * 3,
    )
    copyToClipboard(address)
  }, [address, copyToClipboard, copyTimeout.current, state.copied])
  useEffect(() => {
    return () => {
      copyTimeout.current && window.clearTimeout(copyTimeout.current)
    }
  }, [])
  return (
    <div className='recive-token dex-page-container base-width'>
      <TopHeader />
      <BackBar title={t('reciveToken')} />
      <p className='recive-token-tip'>{t('shareAddress')}</p>
      <div className='qr-wrapper'>
        <div className='qr-code'>
          <QrView
            hiddenAddress={true}
            cellWidth={5}
            darkColor='#fff'
            lightColor='transparent'
            Qr={{
              data: address,
            }}
          />
        </div>
        <div className='account-name'>{selectedIdentity.name}</div>
        <Tooltip
          position='top'
          title={state.copied ? t('copiedExclamation') : t('copyToClipboard')}
        >
          <div onClick={copyAddress} className='account-address'>
            {address}
          </div>
        </Tooltip>
      </div>
    </div>
  )
}

export default ReciveToken
