import React, { useState, useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import SendTokenInput from '@c/app/send-token-input'
import SendAddressInput from '@c/app/send-address-input'
import { getTokens } from '@reducer/dexmask/dexmask'
import useDeepEffect from '@view/hooks/useDeepEffect'
import { getDexMaskState } from '@reducer/dexmask/dexmask'
import { getCrossChainState } from '@view/selectors'
import { updateCrossChainState } from '@view/store/actions'
import { getAllSupportBridge, checkTokenBridge } from '@view/helpers/cross-chain-api'
import { toBnString } from '@view/helpers/utils/conversions.util'
import { isBurnAddress, isValidHexAddress } from '@shared/modules/hexstring-utils'
import { setProviderType, setRpcTarget } from '@view/store/actions'
import { DEFAULT_NETWORK_LIST } from '@shared/constants/network'
import CrossDestChainSwitcher from './dest-chain-switcher'
import CrossFromChainSwitcher from './from-chain-switcher'

export default function CrossChainTokenInput() {
  const [state, setState] = useState({
    includesNativeCurrencyToken: true,
    tokenList: [],
    reverseAble: false
  })
  const dispatch = useDispatch()
  const crossChainState = useSelector(getCrossChainState)
  const tokens = useSelector(getTokens)
  const { frequentRpcListDetail } = useSelector(getDexMaskState)

  const allNetworks = useMemo(() => {
    return DEFAULT_NETWORK_LIST.map(({
      chainId,
      symbol,
      provider,
      isBulitIn,
      label
    }) => {
      return {
        chainId,
        isBulitIn,
        label,
        provider,
        networkId: toBnString(chainId),
      };
    }).concat(frequentRpcListDetail.map(({
      chainId,
      nickname,
      rpcUrl,
      ticker
    }) => {
      return {
        chainId,
        isBulitIn: false,
        label: nickname,
        setPrcParams: [rpcUrl, chainId, ticker, nickname],
        networkId: toBnString(chainId)
      }
    }))
  }, [frequentRpcListDetail])

  const isNative = useMemo(
    () => crossChainState.coinAddress === ethers.constants.AddressZero,
    [crossChainState.coinAddress],
  )
  const chainId = useMemo(() => toBnString(crossChainState.fromChain), [
    crossChainState.fromChain,
  ])
  const tokenAddresses = useMemo(
    () => tokens.map(({ address }) => address.toLowerCase()),
    [tokens],
  )
  const updateCrossState = useCallback((state) => {
    dispatch(updateCrossChainState(state))
  }, [])
  const reverseCross = useCallback(() => {
    checkTokenBridge({
      token_address: crossChainState.targetCoinAddress,
      meta_chain_id: toBnString(crossChainState.destChain),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.c === 200) {
          const target = res.d.find(
            ({ target_meta_chain_id, token_address }) =>
            target_meta_chain_id === toBnString(crossChainState.fromChain) && token_address === crossChainState.coinAddress,
          )
          const newCrossInfo = Object.assign({}, crossChainState, {
            destChain: crossChainState.fromChain,
            fromChain: crossChainState.destChain,
            coinAddress: crossChainState.targetCoinAddress,
            coinSymbol: crossChainState.targetCoinSymbol,
            targetCoinAddress: crossChainState.coinAddress,
            targetCoinSymbol: crossChainState.coinSymbol,
            userInputValue: '',
            supportChains: res.d,
            target,
          })

          const targetChainInfo = allNetworks.find(({ networkId }) => networkId === toBnString(newCrossInfo.fromChain))
          dispatch(targetChainInfo.isBulitIn ? setProviderType(targetChainInfo.provider) : setRpcTarget(...targetChainInfo.setPrcParams)).then(() => {
            updateCrossState(newCrossInfo)
          })
        }
      })
  }, [crossChainState, allNetworks])
  useDeepEffect(() => {
    const tokenList = []
    let reverseAble = false
    let includesNativeCurrencyToken = false
    let tokenIndex
    getAllSupportBridge({
      offset: 0,
      limit: 1000000,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.c === 200) {
          const destChain = toBnString(crossChainState.destChain)
          const destToken = crossChainState.targetCoinAddress

          res.d.forEach((item) => {
            if (item.meta_chain_id === chainId) {
              if (item.token_address === ethers.constants.AddressZero) {
                includesNativeCurrencyToken = true
              }

              if (item.token_address !== ethers.constants.AddressZero) {
                tokenIndex = tokenAddresses.findIndex(
                  (address) => address === item.token_address,
                )

                if (tokenIndex > -1 && tokens[tokenIndex]) {
                  tokenList.push(tokens[tokenIndex])
                }
              }
            }

            if (item.meta_chain_id === destChain && item.token_address === destToken) {
              reverseAble = true;
            }
          })
        }

        setState(() => ({
          includesNativeCurrencyToken,
          tokenList,
          reverseAble
        }))
      })
  }, [chainId, tokenAddresses, tokens, crossChainState.destChain, crossChainState.targetCoinAddress])

  return (
    <div>
      <CrossFromChainSwitcher />
      <SendTokenInput
        {...state}
        accountAddress={crossChainState.from}
        tokenAddress={crossChainState.coinAddress}
        autoChangeAccount={true}
        maxSendAmount={
          isNative
            ? crossChainState.nativeMaxSendAmount
            : crossChainState.maxSendAmount
        }
        onReverse={reverseCross}
        changeToken={({ address: coinAddress, decimals: tokenDecimals, string }) => {
          updateCrossState({
            coinAddress,
            tokenDecimals,
            maxSendAmount: new BigNumber(string).toString(),
          })
        }}
        changeAmount={(userInputValue) => {
          updateCrossState({
            userInputValue,
          })
        }}
        changeAccount={({ address: from }) =>
          updateCrossState({
            from
          })
        }
      />
      <CrossDestChainSwitcher />
      <SendAddressInput
        optionsDirection="top"
        accountAddress={crossChainState.dest}
        selectedAddress={crossChainState.dest}
        autoChangeAccount={false}
        onChange={(dest) => {
          if (!isBurnAddress(dest) && isValidHexAddress(dest)) {
            updateCrossState({
              dest
            })
          }
        }}
        onPaste={(dest) => {
          if (!isBurnAddress(dest) && isValidHexAddress(dest)) {
            updateCrossState({
              dest
            })
          }
        }}
        changeAccount={({ address: dest }) =>
          updateCrossState({
            dest
          })
        }
        onReset={() =>
          updateCrossState({
            dest: '',
          })
        }
        toggleCheck={(isInWallet) => 
          updateCrossState({
            dest: isInWallet ? crossChainState.from : ''
          })
        }
      />
    </div>
  )
}
