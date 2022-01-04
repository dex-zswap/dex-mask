import React, { useState, useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import classnames from 'classnames'
import { ethers } from 'ethers'
import { getDexMaskState } from '@reducer/dexmask/dexmask'
import { getCrossChainState } from '@view/selectors'
import { updateCrossChainState } from '@view/store/actions'
import useDeepEffect from '@view/hooks/useDeepEffect'
import { toBnString } from '@view/helpers/utils/conversions.util'
import { setProviderType, setRpcTarget } from '@view/store/actions'
import {
  getAllSupportBridge,
  checkTokenBridge,
} from '@view/helpers/cross-chain-api'
import { useI18nContext } from '@view/hooks/useI18nContext'
import { DEFAULT_NETWORK_LIST } from '@shared/constants/network'

const CrossFromChainSwitcher = () => {
  const dispatch = useDispatch()
  const t = useI18nContext()
  const crossChainState = useSelector(getCrossChainState)
  const { frequentRpcListDetail } = useSelector(getDexMaskState)
  const [chains, setChains] = useState([])
  const [showChainSwitcher, setShowChainSwitcher] = useState(false)
  const allNetworks = useMemo(() => {
    return DEFAULT_NETWORK_LIST.map(
      ({ chainId, symbol, provider, isBulitIn, label }) => {
        return {
          chainId,
          isBulitIn,
          provider,
          label: t(provider),
          networkId: toBnString(chainId),
        }
      },
    ).concat(
      frequentRpcListDetail.map(({ chainId, nickname, rpcUrl, ticker }) => {
        return {
          chainId,
          isBulitIn: false,
          label: nickname,
          setPrcParams: [rpcUrl, chainId, ticker, nickname],
          networkId: toBnString(chainId),
        }
      }),
    )
  }, [frequentRpcListDetail, t])
  const isNative = useMemo(
    () => ethers.constants.AddressZero === crossChainState.coinAddress,
    [crossChainState.coinAddress],
  )
  const fromChainInfo = useMemo(
    () =>
      allNetworks.find(
        ({ chainId, networkId }) =>
          chainId === crossChainState.fromChain ||
          networkId === crossChainState.fromChain,
      ) ?? {},
    [crossChainState.fromChain, allNetworks],
  )
  const toggleChainSwitcher = useCallback(
    () =>
      chains.length > 1 &&
      setShowChainSwitcher((showChainSwitcher) => !showChainSwitcher),
    [chains],
  )
  const selectChain = useCallback(
    (chain) => {
      if (fromChainInfo.chainId == chain.chainId) {
        return
      }

      checkTokenBridge({
        meta_chain_id: toBnString(chain.chainId),
        token_address: ethers.constants.AddressZero,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.c === 200 && res.d.length) {
            dispatch(
              chain.isBulitIn
                ? setProviderType(chain.provider)
                : setRpcTarget(...chain.setPrcParams),
            ).then(() => {
              const defaultTargetChain = res.d[0]
              dispatch(
                updateCrossChainState({
                  fromChain: chain.chainId,
                  coinAddress: ethers.constants.AddressZero,
                  targetCoinAddress: defaultTargetChain.target_token_address,
                  destChain: defaultTargetChain.target_meta_chain_id,
                  target: defaultTargetChain,
                  supportChains: res.d
                }),
              )
            })
          }
        })
    },
    [fromChainInfo],
  )
  useDeepEffect(() => {
    getAllSupportBridge({
      offset: 0,
      limit: 1000000,
    })
      .then((res) => res.json())
      .then((res) => {
        const chains = []
        const chainIds = []
        let find

        if (res.c === 200) {
          res.d.forEach((bridge) => {
            find = allNetworks.find(
              ({ networkId }) => networkId === bridge.meta_chain_id,
            )

            if (find && !chainIds.includes(bridge.meta_chain_id)) {
              chainIds.push(bridge.meta_chain_id)
              chains.push(find)
            }
          })
          setChains(chains)
        }
      })
  }, [allNetworks])
  return (
    <div className='cross-from-chain-switcher base-width'>
      <div
        className='current-chain-info flex space-between items-center'
        onClick={toggleChainSwitcher}
      >
        <div className='chain-info'>
          <i
            className={classnames(
              'network-icon',
              (fromChainInfo.provider ?? 'rpc').toLowerCase(),
            )}
          ></i>
          {fromChainInfo.label}
        </div>
        {chains.length > 1 ? (
          <i
            className={classnames('drop-icon', showChainSwitcher ? 'open' : '')}
          ></i>
        ) : null}
        {showChainSwitcher && (
          <>
            <div
              className='switcher-select-mask'
              onClick={(e) => {
                e.stopPropagation()
                toggleChainSwitcher()
              }}
            ></div>
            <div className='switcher-menu'>
              {chains.map((chain) => {
                return (
                  <div
                    key={chain.chainId}
                    className={classnames(
                      'switcher-menu-item chain-info flex items-center',
                      chain.chainId === fromChainInfo.chainId ? 'selected' : '',
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      selectChain(chain)
                      toggleChainSwitcher()
                    }}
                  >
                    <i
                      className={classnames(
                        'network-icon',
                        (chain.provider ?? 'rpc').toLowerCase(),
                      )}
                    ></i>
                    {chain.label}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CrossFromChainSwitcher
