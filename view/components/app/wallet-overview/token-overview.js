import React, { useContext, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ethers } from 'ethers'
import CurrencyDisplay from '@c/ui/currency-display'
import IconButton from '@c/ui/icon-button'
import Identicon from '@c/ui/identicon'
import BuyIcon from '@c/ui/overview-icons/buy'
import SendIcon from '@c/ui/overview-icons/recive'
import SwapIcon from '@c/ui/overview-icons/swap'
import { ASSET_TYPES, updateSendAsset } from '@reducer/send'
import {
  getAssetImages,
  getCurrentChainId,
  getCurrentKeyring,
  getIsSwapsChain,
  getSelectedAccount,
} from '@selectors/selectors'
import { I18nContext } from '@view/contexts/i18n'
import {
  CROSSCHAIN_ROUTE,
  RECIVE_TOKEN_ROUTE,
  SEND_ROUTE,
  TRADE_ROUTE,
} from '@view/helpers/constants/routes'
import { checkTokenBridge } from '@view/helpers/cross-chain-api'
import { toBnString } from '@view/helpers/utils/conversions.util'
import { useFetch } from '@view/hooks/useFetch'
import { useTokenFiatAmount } from '@view/hooks/useTokenFiatAmount'
import { useTokenTracker } from '@view/hooks/useTokenTracker'
import { updateCrossChainState } from '@view/store/actions'
import WalletOverview from './wallet-overview'

const TokenOverview = ({ className, token }) => {
  const dispatch = useDispatch()
  const t = useContext(I18nContext)
  const history = useHistory()
  const selectedAccount = useSelector(getSelectedAccount)
  const chainId = useSelector(getCurrentChainId)
  const { loading, error, res } = useFetch(
    () =>
      checkTokenBridge({
        meta_chain_id: toBnString(chainId),
        token_address: token.address,
      }),
    [chainId, token.address],
  )
  const supportCrossChain = useMemo(() => {
    if (loading || error || res?.c !== 200) {
      return false
    }

    return res?.d?.length
  }, [loading, error, res])
  const supportChains = useMemo(() => {
    return supportCrossChain ? res.d : []
  }, [supportCrossChain, res])
  const defaultTargetChain = useMemo(
    () => (supportCrossChain ? res.d[0] : null),
    [supportCrossChain, res],
  )
  const overViewButtons = useMemo(() => {
    const buttons = [
      {
        key: 'send',
        iconClass: 'send-icon',
        label: t('send'),
        onClick: () =>
          dispatch(
            updateSendAsset({
              type: ASSET_TYPES.TOKEN,
              details: token,
            }),
          ).then(() => {
            history.push(SEND_ROUTE)
          }),
      },
      {
        key: 'recive',
        iconClass: 'recive-icon',
        label: t('buy'),
        onClick: () => history.push(RECIVE_TOKEN_ROUTE),
      },
      {
        key: 'swap',
        iconClass: 'swap-icon',
        label: t('swap'),
        onClick: () => history.push(TRADE_ROUTE),
      },
    ]

    if (supportCrossChain) {
      buttons.push({
        key: 'cross-chain',
        iconClass: 'cross-chain-icon',
        label: t('crossChain'),
        onClick: () => {
          dispatch(
            updateCrossChainState({
              coinAddress: token.address,
              targetCoinAddress: defaultTargetChain.target_token_address,
              coinSymbol: token.symbol,
              from: selectedAccount.address,
              fromChain: chainId,
              target: defaultTargetChain,
              destChain: defaultTargetChain.target_meta_chain_id,
              supportChains,
            }),
          )
          history.push(CROSSCHAIN_ROUTE)
        },
      })
    }

    return buttons
  }, [supportCrossChain, defaultTargetChain, t, token, history])
  return <WalletOverview buttons={overViewButtons} />
}

export default TokenOverview
