import React, { useMemo, useCallback } from 'react'
import { useI18nContext } from '@view/hooks/useI18nContext'
import BackBar from '@c/ui/back-bar'
import Button from '@c/ui/button'
import TopHeader from '@c/ui/top-header'
export default function Trade() {
  const t = useI18nContext()
  const openSwap = useCallback(() => {
    global.platform.openTab({
      url: 'http://103.43.11.66:9999',
    })
  }, [])
  return (
    <div className='trade-page dex-page-container base-width'>
      <TopHeader />
      <BackBar title={t('swap')} />
      <div className='swap-background'></div>
      <div className='swap-welcome'>{t('swapWelcome')}</div>
      <div className='swap-description'>{t('swapWelcomeDescription')}</div>
      <Button type='primary' onClick={openSwap} rightArrow>
        {t('toSwap')}
      </Button>
    </div>
  )
}
