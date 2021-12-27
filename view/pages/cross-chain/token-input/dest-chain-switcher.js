import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import classnames from 'classnames'
import { ethers } from 'ethers'
import { getDexMaskState } from '@reducer/dexmask/dexmask'
import { getCrossChainState } from '@view/selectors'
import { updateCrossChainState } from '@view/store/actions'
import { toBnString } from '@view/helpers/utils/conversions.util'
import { setProviderType, setRpcTarget } from '@view/store/actions'
import { checkTokenBridge } from '@view/helpers/cross-chain-api'
import { DEFAULT_NETWORK_LIST } from '@shared/constants/network'

const CrossDestChainSwitcher = () => {
  const dispatch = useDispatch()
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
          label,
          provider,
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
  }, [frequentRpcListDetail])
  const isNative = useMemo(
    () => ethers.constants.AddressZero === crossChainState.coinAddress,
    [crossChainState.coinAddress],
  )
  const destChainInfo = useMemo(
    () =>
      allNetworks.find(
        ({ networkId, chainId }) =>
          networkId === crossChainState.destChain ||
          chainId === crossChainState.destChain,
      ) ?? {},
    [crossChainState.destChain, allNetworks],
  )
  const toggleChainSwitcher = useCallback(
    () =>
      chains.length > 1 &&
      setShowChainSwitcher((showChainSwitcher) => !showChainSwitcher),
    [chains],
  )
  useEffect(() => {
    checkTokenBridge({
      meta_chain_id: toBnString(crossChainState.fromChain),
      token_address: crossChainState.coinAddress,
    })
      .then((res) => res.json())
      .then((res) => {
        const chains = []
        const chainIds = []
        let find

        if (res.c === 200) {
          res.d.forEach((bridge) => {
            find = allNetworks.find(
              ({ networkId }) => networkId === bridge.target_meta_chain_id,
            )

            if (find && !chainIds.includes(bridge.target_meta_chain_id)) {
              chains.push(find)
            }
          })
          setChains(chains)
        }
      })
  }, [allNetworks, crossChainState.fromChain, crossChainState.coinAddress])
  return (
    <div className='cross-dest-chain-switcher base-width flex space-between items-center'>
      <div
        className='current-chain-info flex space-between items-center'
        onClick={toggleChainSwitcher}
      >
        <div className='chain-info'>
          <i
            className={classnames(
              'network-icon',
              (destChainInfo?.provider ?? 'rpc').toLowerCase(),
            )}
          ></i>
          {destChainInfo?.label}
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
                      chain.chainId === destChainInfo?.chainId
                        ? 'selected'
                        : '',
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      dispatch(
                        updateCrossChainState({
                          destChain: chain.chainId,
                        }),
                      )
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

export default CrossDestChainSwitcher