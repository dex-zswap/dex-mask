import React, { useState, useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import SendTokenInput from '@c/app/send-token-input'
import SendAddressInput from '@c/app/send-address-input'
import { getTokens } from '@reducer/dexmask/dexmask'
import useDeepEffect from '@view/hooks/useDeepEffect'
import {
  getCrossChainState,
  getShouldHideZeroBalanceTokens,
} from '@view/selectors'
import { updateCrossChainState } from '@view/store/actions'
import { getAllSupportBridge } from '@view/helpers/cross-chain-api'
import { toBnString } from '@view/helpers/utils/conversions.util'
export default function CrossChainTokenInput() {
  const [state, setState] = useState({
    includesNativeCurrencyToken: true,
    tokenList: [],
  })
  const dispatch = useDispatch()
  const crossChainState = useSelector(getCrossChainState)
  const tokens = useSelector(getTokens)

  const isNative = useMemo(() => crossChainState.coinAddress === ethers.constants.AddressZero, [crossChainState.coinAddress])

  const chainId = useMemo(() => toBnString(crossChainState.fromChain), [
    crossChainState.fromChain,
  ])
  const tokenAddresses = useMemo(
    () => tokens.map(({ address }) => address.toLowerCase()),
    [tokens],
  )
  const tokenChanged = useCallback(({ address: coinAddress, string }) => {
    dispatch(
      updateCrossChainState({
        coinAddress,
        maxSendAmount: new BigNumber(string).toString()
      }),
    )
  }, [])

  const updateCrossState = useCallback((state) => {
    updateCrossChainState(state)
  }, [])

  useDeepEffect(() => {
    const tokenList = []
    let includesNativeCurrencyToken = false
    let tokenIndex
    getAllSupportBridge({
      offset: 0,
      limit: 1000000,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.c === 200) {
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
          })
        }

        setState(() => ({
          includesNativeCurrencyToken,
          tokenList,
        }))
      })
  }, [chainId, tokenAddresses, tokens])

  return (
    <div>
      <SendTokenInput
        {...state}
        tokenAddress={crossChainState.coinAddress}
        maxSendAmount={isNative ? crossChainState.nativeMaxSendAmount : crossChainState.maxSendAmount}
        changeToken={tokenChanged}
        changeAmount={(userInputValue) => {
          updateCrossState({
            userInputValue
          })
        }}
      />
      <SendAddressInput
        userInput={crossChainState.dest}
        onChange={(dest) => updateCrossState({ dest })}
        onReset={() => updateCrossState({ dest: '' })}
      />
    </div>
  )
}
