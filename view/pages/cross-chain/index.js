import React, { useEffect, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ethers } from 'ethers'
import TopHeader from '@c/ui/top-header'
import BackBar from '@c/ui/back-bar'
import { useI18nContext } from '@view/hooks/useI18nContext'
import {
  getSelectedAccount,
  getCurrentChainId,
  getCrossChainState,
} from '@view/selectors'
import { getTokens } from '@reducer/dexmask/dexmask'
import {
  initializeCrossState,
  disposePollingGas,
} from '@reducer/cross-chain/cross-chain'
import { useTokenTracker } from '@view/hooks/useTokenTracker'
import CrossChainButton from './button'
import CrossChainTokenInput from './token-input'
import { updateCrossChainState } from '@view/store/actions'
export default function CrossChain() {
  const t = useI18nContext()
  const dispatch = useDispatch()
  const selectedAccount = useSelector(getSelectedAccount)
  const crossChainState = useSelector(getCrossChainState)
  const tokens = useSelector(getTokens)
  const isNative = useMemo(
    () => crossChainState.coinAddress === ethers.constants.AddressZero,
    [crossChainState.coinAddress],
  )
  const { loading, tokensWithBalances } = useTokenTracker(tokens, true)
  const targetToken = useMemo(() => {
    if (isNative || loading) {
      return null
    }

    return tokensWithBalances.find(
      ({ address }) =>
        address.toLowerCase() === crossChainState.coinAddress.toLowerCase(),
    )
  }, [isNative, loading, tokensWithBalances, crossChainState.coinAddress])
  const cleanUp = useCallback(() => {
    dispatch(disposePollingGas())
    dispatch(
      updateCrossChainState({
        dest: '',
      }),
    )
  }, [])
  useEffect(() => {
    dispatch(initializeCrossState(selectedAccount.balance))
    return () => cleanUp()
  }, [
    crossChainState.fromChain,
    selectedAccount.address,
    selectedAccount.balance,
  ])
  useEffect(() => {
    if (targetToken) {
      dispatch(
        updateCrossChainState({
          maxSendAmount: targetToken.string,
        }),
      )
    }
  }, [targetToken])
  return (
    <div className='cross-chain-page dex-page-container space-between base-width'>
      <div className='cross-chain-top'>
        <TopHeader />
        <BackBar
          title={[t('sendToken'), t('dexBridge')].join(' - ')}
          backCb={cleanUp}
        />
        <CrossChainTokenInput />
      </div>
      <CrossChainButton />
    </div>
  )
}
