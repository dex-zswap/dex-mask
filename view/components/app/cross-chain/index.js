import React, { useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ethers } from 'ethers'
import { getNativeCurrency } from '@reducer/dexmask/dexmask'
import { getCurrentChainId, getSelectedAccount } from '@selectors/selectors'
import { NETWORK_TO_NAME_MAP } from '@shared/constants/network'
import { CROSSCHAIN_ROUTE } from '@view/helpers/constants/routes'
import { checkTokenBridge } from '@view/helpers/cross-chain-api'
import { toBnString, toHexString } from '@view/helpers/utils/conversions.util'
import { useFetch } from '@view/hooks/useFetch'
import { useI18nContext } from '@view/hooks/useI18nContext'
import { updateCrossChainState } from '@view/store/actions'
export default function CrossChainBtn() {
  const t = useI18nContext()
  const history = useHistory()
  const dispatch = useDispatch()
  const chainId = useSelector(getCurrentChainId)
  const selectedAccount = useSelector(getSelectedAccount)
  const nativeCurrency = useSelector(getNativeCurrency)
  const provider = useSelector((state) => state.metamask.provider)
  const { loading, error, res } = useFetch(
    () =>
      checkTokenBridge({
        meta_chain_id: toBnString(chainId),
        token_address: ethers.constants.AddressZero,
      }),
    [chainId],
  )
  const supportCrossChain = useMemo(() => {
    if (loading || error || res?.c !== 200) {
      return false
    }

    return res?.d?.length
  }, [loading, error, res])
  const supportChains = useMemo(() => {
    return supportCrossChain ? res.d : [];
  },[supportCrossChain, res])
  const defaultTargetChain = useMemo(
    () => (supportCrossChain ? res.d[0] : null),
    [supportCrossChain, res],
  )
  return (
    <>
      {supportCrossChain ? (
        <div
          className='cross-chain-transfer-button flex items-center'
          onClick={() => {
            dispatch(
              updateCrossChainState({
                coinAddress: ethers.constants.AddressZero,
                targetCoinAddress: defaultTargetChain.target_token_address,
                target: defaultTargetChain,
                from: selectedAccount.address,
                fromChain: chainId,
                destChain: defaultTargetChain.target_meta_chain_id,
                supportChains,
              }),
            )
            history.push(CROSSCHAIN_ROUTE)
          }}
        >
          <div className='icon'></div>
          <p className='text'>
            {t('InterBlockchain', [
              NETWORK_TO_NAME_MAP[provider.type] || provider.type,
            ])}
          </p>
        </div>
      ) : null}
    </>
  )
}
