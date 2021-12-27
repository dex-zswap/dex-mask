import React, { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ethers } from 'ethers'
import AccountSwitcher from '@c/ui/cross-chain/account-switcher'
import ChainSwitcher from '@c/ui/cross-chain/chain-switcher'
import CurrentToken from '@c/ui/cross-chain/current-token-cross'
import { getNativeCurrency } from '@reducer/dexmask/dexmask'
import { checkTokenBridge, getTokenGroup } from '@view/helpers/cross-chain-api'
import useTokenBalance from '@view/helpers/token-balance'
import { toBnString } from '@view/helpers/utils/conversions.util'
import useDeepEffect from '@view/hooks/useDeepEffect'
import { useFetch } from '@view/hooks/useFetch'
import { useI18nContext } from '@view/hooks/useI18nContext'
import { getCrossChainState } from '@view/selectors'
import {
  setProviderType,
  showAccountDetail,
  updateCrossChainState,
} from '@view/store/actions'
import UserInputValue from './user-input-value'

const CrossChainFrom = () => {
  const t = useI18nContext()
  const dispatch = useDispatch()
  const crossInfo = useSelector(getCrossChainState)
  const nativeCurrency = useSelector(getNativeCurrency)
  const isNativeAsset = crossInfo.coinAddress === ethers.constants.AddressZero
  const tokenBalance = useTokenBalance({
    tokenAddress: isNativeAsset ? null : crossInfo.coinAddress,
    wallet: crossInfo.from,
    chainId: crossInfo.fromChain,
    isNativeAsset,
  })
  const { loading, error, res } = useFetch(
    () =>
      getTokenGroup({
        token_address: isNativeAsset
          ? ethers.constants.AddressZero
          : crossInfo.coinAddress,
        meta_chain_id: toBnString(crossInfo.fromChain),
      }),
    [crossInfo.coinAddress, crossInfo.fromChain],
  )
  const groups = useMemo(() => {
    if (loading || error || res?.c !== 200) {
      return []
    }

    return res?.d.map((chain) => ({ ...chain, chainId: chain.meta_chain_id }))
  }, [loading, error, res])
  const chainChange = useCallback(
    (chainType, chain) => {
      const targetChain = ethers.BigNumber.from(chain).toString()
      const targetInfo = groups.find(({ chainId }) => chainId === targetChain)

      if (toBnString(targetChain) === toBnString(crossInfo.fromChain)) {
        return
      }

      dispatch(setProviderType(chainType))
      dispatch(
        updateCrossChainState({
          fromChain: targetInfo.chainId,
          coinAddress: targetInfo.token_address,
          coinSymbol: targetInfo.token,
        }),
      )
    },
    [groups, nativeCurrency],
  )
  const accountChange = useCallback((account) => {
    dispatch(showAccountDetail(account.address))
    dispatch(
      updateCrossChainState({
        from: account.address,
        userInputValue: '',
      }),
    )
  }, [])
  const outSideChains = useMemo(() => {
    return groups.filter(
      ({ chainId }) => toBnString(chainId) !== toBnString(crossInfo.destChain),
    )
  }, [groups, crossInfo])
  const tokenChange = useCallback(
    (token) => {
      checkTokenBridge({
        token_address: token.token_address,
        meta_chain_id: token.meta_chain_id,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.c === 200) {
            let target = res.d.find(
              ({ target_meta_chain_id }) =>
                toBnString(target_meta_chain_id) ===
                toBnString(crossInfo.destChain),
            )

            if (target) {
              dispatch(
                updateCrossChainState({
                  coinAddress: token.token_address,
                  coinSymbol: token.token,
                  targetCoinAddress: target.target_token_address,
                  targetCoinSymbol: target.target_token,
                  userInputValue: '',
                  target,
                  supportChains: res.d,
                }),
              )
            } else {
              target = res.d[0]
              dispatch(
                updateCrossChainState({
                  coinAddress: token.token_address,
                  coinSymbol: token.token,
                  targetCoinAddress: target.target_token_address,
                  targetCoinSymbol: target.target_token,
                  destChain: target.target_meta_chain_id,
                  userInputValue: '',
                  target,
                  supportChains: res.d,
                }),
              )
            }
          }
        })
    },
    [crossInfo],
  )
  useDeepEffect(() => {
    if (isNativeAsset) {
      dispatch(
        updateCrossChainState({
          coinSymbol: nativeCurrency,
        }),
      )
    }
  }, [nativeCurrency])
  return (
    <div className='cross-chain-from__wrapper'>
      <div className='top'>
        <CurrentToken
          selectable
          useOut
          coinAddress={crossInfo.coinAddress}
          diameter={40}
          coinSymbol={crossInfo.coinSymbol}
          currentChainId={crossInfo.fromChain}
          onChange={tokenChange}
        >
          <AccountSwitcher address={crossInfo.from} onChange={accountChange} />
        </CurrentToken>
        <ChainSwitcher
          currentChainId={crossInfo.fromChain}
          onChange={chainChange}
          outSideChains={outSideChains}
        />
      </div>
      <UserInputValue
        symbol={crossInfo.coinSymbol}
        coinAddress={crossInfo.coinAddress}
        tokenBalance={tokenBalance}
      />
      <div className='amount'>
        {t('max')}: {tokenBalance} {crossInfo.coinSymbol}
      </div>
    </div>
  )
}

export default CrossChainFrom
