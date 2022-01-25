import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import BigNumber from 'bignumber.js'
import Button from '@c/ui/button'
import {
  getSendAmount,
  getSendAssetAddress,
  isSendFormInvalid,
  resetSendState,
  signTransaction,
} from '@reducer/send'
import { CONFIRM_TRANSACTION_ROUTE } from '@view/helpers/constants/routes'
import { useI18nContext } from '@view/hooks/useI18nContext'
import { SEND_ASSET_TOKEN_ADDRESS } from '@pages/send'

export default function SendFooter({}) {
  const t = useI18nContext()
  const dispatch = useDispatch()
  const history = useHistory()
  const disabled = useSelector(isSendFormInvalid)
  const amount = useSelector(getSendAmount)
  const sendAddress = useSelector(getSendAssetAddress)
  const onCancel = useCallback(() => {
    dispatch(resetSendState())
    history.go(-1)
  }, [history])

  const onSubmit = useCallback((event) => {
    event.preventDefault()
    const promise = dispatch(signTransaction())
    Promise.resolve(promise).then(() => {
      localStorage[SEND_ASSET_TOKEN_ADDRESS] = sendAddress
      history.push(CONFIRM_TRANSACTION_ROUTE)
    })
    history.push(CONFIRM_TRANSACTION_ROUTE)
  }, [sendAddress])
  return (
    <div className='base-width flex space-between'>
      <Button className='half-button' onClick={onCancel}>
        {t('cancel')}
      </Button>
      <Button
        className='half-button'
        type='primary'
        onClick={onSubmit}
        disabled={
          disabled || !amount || new BigNumber(amount).eq(new BigNumber(0))
        }
      >
        {t('next')}
      </Button>
    </div>
  )
}
