import React from 'react'
import { useSelector } from 'react-redux'
import Button from '@c/ui/button'
import { useI18nContext } from '@view/hooks/useI18nContext'
export default function CrossChainButton() {
  const t = useI18nContext()

  

  return (
    <div className='cross-chain-buttons flex space-between'>
      <Button className='half-button'>{t('back')}</Button>
      <Button type='primary' className='half-button'>
        {t('next')}
      </Button>
    </div>
  )
}
