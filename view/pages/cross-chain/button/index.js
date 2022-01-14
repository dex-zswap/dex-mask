import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ethers } from 'ethers'
import Button from '@c/ui/button'
import { getMostRecentOverviewPage } from '@reducer/history/history'
import { MAX_UINT_256 } from '@shared/constants/app'
import BRIDGE_ABI from '@shared/contract-abis/bridge'
import MINTABLE_ABI from '@shared/contract-abis/mintable'
import {
  CONFIRM_TRANSACTION_ROUTE,
  CROSSCHAIN_ROUTE,
} from '@view/helpers/constants/routes'
import { expandDecimals } from '@view/helpers/utils/conversions.util'
import { useI18nContext } from '@view/hooks/useI18nContext'
import useInterval from '@view/hooks/useInterval'
import useDeepEffect from '@view/hooks/useDeepEffect'
import { getCrossChainState } from '@view/selectors'
import { showConfTxPage, updateConfirmAction } from '@view/store/actions'
const mintAbiInterface = new ethers.utils.Interface(MINTABLE_ABI)
const bridgeAbiInterface = new ethers.utils.Interface(BRIDGE_ABI)
export const CONFIRM_SEND_BRIDGE = 'CONFIRM_SEND_BRIDGE'
export const SEND_BEIDGE_TOKEN = 'SEND_BEIDGE_TOKEN'
export default function CrossChainButton() {
  const t = useI18nContext()
  const history = useHistory()
  const dispatch = useDispatch()
  const crossChainState = useSelector(getCrossChainState)
  const mostRecentOverviewPage = useSelector(getMostRecentOverviewPage)
  const isNativeAsset = useMemo(
    () => crossChainState.coinAddress === ethers.constants.AddressZero,
    [crossChainState.coinAddress],
  )
  const mounted = useRef(false || isNativeAsset)
  const allowed = useRef(false || isNativeAsset)
  const decimals = useMemo(() => {
    if (isNativeAsset) {
      return 18
    }

    return crossChainState.tokenDecimals
  }, [isNativeAsset, crossChainState.tokenDecimals])
  const userInputValue = useMemo(() => crossChainState.userInputValue ?? '0', [
    crossChainState.userInputValue,
  ])
  const disableButton = useMemo(() => {
    if (!allowed.current && !isNativeAsset) {
      return false
    }

    return (
      !Boolean(crossChainState.userInputValue) ||
      expandDecimals(crossChainState.userInputValue).isZero() ||
      !Boolean(crossChainState.dest)
    )
  }, [crossChainState, allowed.current, isNativeAsset])
  const crossChain = useCallback(() => {
    const sendData = [
      '0x',
      ethers.utils
        .hexZeroPad(
          ethers.BigNumber.from(
            expandDecimals(crossChainState.userInputValue, decimals),
          ).toHexString(),
          32,
        )
        .substr(2),
      ethers.utils
        .hexZeroPad(
          ethers.utils.hexlify((crossChainState.from.length - 2) / 2),
          32,
        )
        .substr(2),
      crossChainState.dest.substr(2),
    ].join('')
    const data = bridgeAbiInterface.encodeFunctionData('deposit', [
      crossChainState.target.target_chain_id,
      crossChainState.target.resource_id,
      sendData,
    ])
    const value = isNativeAsset
      ? ethers.utils.hexZeroPad(
          ethers.BigNumber.from(expandDecimals(crossChainState.target.fee))
            .add(expandDecimals(crossChainState.userInputValue))
            .toHexString(),
          32,
        )
      : ethers.utils.hexZeroPad(
          ethers.BigNumber.from(
            expandDecimals(crossChainState.target.fee),
          ).toHexString(),
          32,
        )
    global.ethQuery.sendTransaction(
      {
        from: crossChainState.from,
        to: crossChainState.target.bridge,
        value,
        data,
      },
      (e) => {},
    )
    dispatch(
      showConfTxPage({
        isBridge: true,
      }),
    )
    localStorage[CONFIRM_SEND_BRIDGE] = crossChainState.dest
    localStorage[SEND_BEIDGE_TOKEN] = crossChainState.coinAddress
    dispatch(updateConfirmAction(null))
    history.push(CONFIRM_TRANSACTION_ROUTE)
  }, [decimals, isNativeAsset, crossChainState])
  const approve = useCallback(() => {
    const data = mintAbiInterface.encodeFunctionData('approve', [
      crossChainState.target.handler,
      MAX_UINT_256,
    ])
    global.ethQuery.sendTransaction(
      {
        from: crossChainState.from,
        to: crossChainState.coinAddress,
        data,
      },
      (e, hash) => {},
    )
    dispatch(showConfTxPage())
    dispatch(updateConfirmAction(CROSSCHAIN_ROUTE))
    history.push(CONFIRM_TRANSACTION_ROUTE)
  }, [crossChainState])
  useDeepEffect(() => {
    if (!isNativeAsset) {
      mounted.current = false
      allowed.current = false
    } else {
      mounted.current = true
      allowed.current = true
    }
  }, [isNativeAsset, crossChainState.coinAddress, crossChainState.target])
  useInterval(() => {
    if (isNativeAsset || (mounted.current && allowed.current)) {
      return
    }

    const mintContract = global.eth
      .contract(MINTABLE_ABI)
      .at(crossChainState.coinAddress)
    mintContract
      .allowance(crossChainState.from, crossChainState.target?.handler)
      .then((res) => {
        allowed.current = !res[0].isZero()
        mounted.current = true
      })
  }, 500)

  return (
    <div className='cross-chain-buttons flex space-between'>
      <Button
        className='half-button'
        onClick={() => history.push(mostRecentOverviewPage)}
      >
        {t('back')}
      </Button>
      {mounted.current ? (
        <>
          {allowed.current || isNativeAsset ? (
            <Button
              type='primary'
              className='half-button'
              disabled={disableButton}
              onClick={crossChain}
            >
              {t('next')}
            </Button>
          ) : (
            <Button type='primary' className='half-button' onClick={approve}>
              {t('approveButtonText')}
            </Button>
          )}
        </>
      ) : (
        <Button disabled={true} type='primary' className='half-button'>
          {t('loading')}
        </Button>
      )}
    </div>
  )
}
