import React, { useCallback, useState, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import SendAddressInput from '@c/app/send-address-input'
import SendTokenInput from '@c/app/send-token-input'
import {
  getDexMaskState,
  getTokens,
  getAllAccountTokens,
} from '@reducer/dexmask/dexmask'
import { DEFAULT_NETWORK_LIST } from '@shared/constants/network'
import {
  isBurnAddress,
  isValidHexAddress,
} from '@shared/modules/hexstring-utils'
import {
  checkTokenBridge,
  getAllSupportBridge,
} from '@view/helpers/cross-chain-api'
import { initializeCrossState } from '@reducer/cross-chain/cross-chain'
import { toBnString } from '@view/helpers/utils/conversions.util'
import useDeepEffect from '@view/hooks/useDeepEffect'
import { useI18nContext } from '@view/hooks/useI18nContext'
import { getCrossChainState, getSelectedAccount } from '@view/selectors'
import {
  setProviderType,
  setRpcTarget,
  updateCrossChainState,
  showLoadingIndication,
  hideLoadingIndication,
} from '@view/store/actions'
import CrossDestChainSwitcher from './dest-chain-switcher'
import CrossFromChainSwitcher from './from-chain-switcher'
export default function CrossChainTokenInput() {
  const tokenInputRef = useRef(null)
  const [state, setState] = useState({
    includesNativeCurrencyToken: false,
    tokenList: [],
    reverseAble: false,
  })
  const t = useI18nContext()
  const dispatch = useDispatch()
  const crossChainState = useSelector(getCrossChainState)
  const selectedAccount = useSelector(getSelectedAccount)
  const tokens = useSelector(getTokens)
  const allAccountTokens = useSelector(getAllAccountTokens)
  const { frequentRpcListDetail } = useSelector(getDexMaskState)
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
            ({ target_meta_chain_id, target_token_address }) =>
              target_meta_chain_id === toBnString(crossChainState.fromChain) &&
              target_token_address === crossChainState.coinAddress,
          )
          const newCrossInfo = Object.assign({}, crossChainState, {
            destChain: crossChainState.fromChain,
            fromChain: crossChainState.destChain,
            coinAddress: crossChainState.targetCoinAddress,
            targetCoinAddress: crossChainState.coinAddress,
            userInputValue: '',
            supportChains: res.d,
            target,
          })
          const targetChainInfo = allNetworks.find(
            ({ networkId }) => networkId === toBnString(newCrossInfo.fromChain),
          )
          dispatch(
            targetChainInfo.isBulitIn
              ? setProviderType(targetChainInfo.provider)
              : setRpcTarget(...targetChainInfo.setPrcParams),
          ).then(() => {
            updateCrossState(newCrossInfo)
            dispatch(initializeCrossState(selectedAccount.balance))
          })
        }
      })
    tokenInputRef.current?.resetAmount?.()
  }, [crossChainState, allNetworks, tokenInputRef.current, selectedAccount])
  useDeepEffect(() => {
    const tokenList = []
    let reverseAble = false
    let includesNativeCurrencyToken = false
    let tokenIndex
    dispatch(showLoadingIndication())
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

            if (
              item.meta_chain_id === destChain &&
              item.token_address === destToken
            ) {
              reverseAble = true

              if (
                !allAccountTokens[crossChainState.from][
                  crossChainState.destChain
                ].find(
                  (token) =>
                    token.address === crossChainState.targetCoinAddress,
                )
              ) {
                reverseAble = false
              }
            }
          })
        }

        setState(() => ({
          includesNativeCurrencyToken,
          tokenList,
          reverseAble,
        }))
        dispatch(hideLoadingIndication())
      })
  }, [chainId, tokenAddresses, tokens, allAccountTokens, crossChainState])
  return (
    <div>
      <CrossFromChainSwitcher
        resetAmount={tokenInputRef.current?.resetAmount}
      />
      {(Boolean(state.tokenList.length) ||
        state.includesNativeCurrencyToken) && (
        <SendTokenInput
          {...state}
          ref={(component) => (tokenInputRef.current = component)}
          tokenAddress={crossChainState.coinAddress}
          maxSendAmount={
            isNative
              ? crossChainState.nativeMaxSendAmount
              : crossChainState.maxSendAmount
          }
          gasLoading={crossChainState.gasLoading}
          onReverse={reverseCross}
          changeToken={({
            address: coinAddress,
            decimals: tokenDecimals,
            string,
          }) => {
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
              from,
            })
          }
        />
      )}
      <CrossDestChainSwitcher />
      <SendAddressInput
        optionsDirection='top'
        accountAddress={crossChainState.dest}
        selectedAddress={crossChainState.dest}
        onChange={(dest) => {
          if (!isBurnAddress(dest) && isValidHexAddress(dest)) {
            updateCrossState({
              dest,
            })
          }
        }}
        onPaste={(dest) => {
          if (!isBurnAddress(dest) && isValidHexAddress(dest)) {
            updateCrossState({
              dest,
            })
          }
        }}
        changeAccount={({ address: dest }) =>
          updateCrossState({
            dest,
          })
        }
        onReset={() =>
          updateCrossState({
            dest: '',
          })
        }
        toggleCheck={(isInWallet) =>
          updateCrossState({
            dest: isInWallet ? selectedAccount.address : '',
          })
        }
      />
    </div>
  )
}
