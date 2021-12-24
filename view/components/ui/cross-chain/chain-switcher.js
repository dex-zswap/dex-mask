import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { ethers } from 'ethers'
import LongLetter from '@c/ui/long-letter'
import { Menu, MenuItem } from '@c/ui/menu'
import { toBnString } from '@view/helpers/utils/conversions.util'
import {
  BSC_CHAIN_ID,
  CHAIN_ID_NAME_MAP,
  CHAIN_ID_TYPE_MAP,
  DEX_CHAIN_ID,
  GOERLI_CHAIN_ID,
  KOVAN_CHAIN_ID,
  MAINNET_CHAIN_ID,
  RINKEBY_CHAIN_ID,
  ROPSTEN_CHAIN_ID,
} from './constants'
const chainIdOrders = [
  DEX_CHAIN_ID,
  MAINNET_CHAIN_ID,
  BSC_CHAIN_ID,
  ROPSTEN_CHAIN_ID,
  RINKEBY_CHAIN_ID,
  GOERLI_CHAIN_ID,
  KOVAN_CHAIN_ID,
]

const ChainSwitcher = ({ onChange, currentChainId, outSideChains }) => {
  const anchorElement = useRef(null)
  const frequentRpcList = useSelector(
    (state) => state.metamask.frequentRpcListDetail || [],
  )
  const [menuOpened, setMenuOpened] = useState(false)
  const toggleMenu = useCallback(() => {
    setMenuOpened(!menuOpened)
  }, [menuOpened])
  const selectChain = useCallback(
    (chainId, type, isRpc, chainInfo) => {
      toggleMenu()

      if (isRpc) {
        onChange(chainId, chainInfo, true)
        return
      }

      if (type === 'built-in') {
        const providerType = CHAIN_ID_TYPE_MAP[chainId]
        onChange(providerType, chainId)
      }
    },
    [toggleMenu, onChange],
  )
  const chainList = useMemo(() => {
    const chains = chainIdOrders
      .map((chainId) => ({
        chainId,
        chainNumber: ethers.BigNumber.from(chainId).toString(),
        nickName: CHAIN_ID_NAME_MAP[chainId],
        isRpc: false,
        type: 'built-in',
        iconBg:
          DEX_CHAIN_ID === chainId
            ? '/images/dex-token.png'
            : MAINNET_CHAIN_ID === chainId
            ? '/images/eth_logo.png'
            : BSC_CHAIN_ID === chainId
            ? '/images/bnb.png'
            : '/images/dex/settings/chain-icon.png',
      }))
      .concat(
        frequentRpcList.map((rpc) => ({
          ...rpc,
          chainNumber: rpc.nickname,
          chainNumber: ethers.BigNumber.from(rpc.chainId).toString(),
          nickName: rpc.nickname,
          isRpc: true,
          type: 'built-in',
        })),
      )

    if (outSideChains) {
      const outSideChainIds = outSideChains.map(({ chainId }) => chainId)
      return chains.filter(({ chainNumber }) =>
        outSideChainIds.includes(chainNumber),
      )
    }

    return chains
  }, [outSideChains, frequentRpcList])
  const chainName = useMemo(() => {
    if (!currentChainId) {
      return 'UNKNOWN'
    }

    const find = chainList.find(
      ({ chainNumber }) => chainNumber === toBnString(currentChainId),
    )

    if (find) {
      return find.nickName
    }

    return 'UNKNOWN'
  }, [chainList, currentChainId])
  return (
    <>
      <div
        className='cross-chain__chain-switcher'
        ref={(el) => (anchorElement.current = el)}
        onClick={toggleMenu}
      >
        <div className='cross-chain__chain-switcher-name'>{chainName}</div>
        <div className='cross-chain__chain-switcher-icon'></div>
      </div>
      {menuOpened && (
        <Menu
          className='cross-chain__chain-menu'
          anchorElement={anchorElement.current}
          onHide={toggleMenu}
        >
          {chainList.map(
            ({
              iconBg,
              chainId,
              chainNumber,
              type,
              nickName,
              isRpc,
              rpcUrl,
              ticker,
              nickname,
            }) => (
              <MenuItem
                className={
                  toBnString(currentChainId) === toBnString(chainNumber)
                    ? 'active'
                    : ''
                }
                key={chainId}
                onClick={() =>
                  selectChain(chainId, type, isRpc, {
                    rpcUrl,
                    chainId,
                    ticker,
                    nickname,
                  })
                }
              >
                <div
                  style={{
                    background: `url(${
                      iconBg || '/images/dex/settings/chain-icon.png'
                    }) no-repeat
            center / cover`,
                  }}
                  className='cross-chain__chain-icon'
                ></div>
                <div
                  className={
                    toBnString(currentChainId) === toBnString(chainNumber)
                      ? 'chain-name chain-name-checked'
                      : 'chain-name'
                  }
                >
                  <LongLetter text={nickName} length={13} />
                </div>
                {toBnString(currentChainId) === toBnString(chainNumber) && (
                  <div className='chain-checked'>
                    <img
                      width='7px'
                      src='images/dex/account-menu/checked.png'
                    />
                  </div>
                )}
              </MenuItem>
            ),
          )}
        </Menu>
      )}
    </>
  )
}

export default ChainSwitcher
