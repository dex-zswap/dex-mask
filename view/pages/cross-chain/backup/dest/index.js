import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ethers } from 'ethers'
import ChainSwitcher from '@c/ui/cross-chain/chain-switcher'
import EnsInput from '@pages/send/send-content/add-recipient/ens-input'
import { checkTokenBridge } from '@view/helpers/cross-chain-api'
import { toBnString } from '@view/helpers/utils/conversions.util'
import useDeepEffect from '@view/hooks/useDeepEffect'
import { useFetch } from '@view/hooks/useFetch'
import { useI18nContext } from '@view/hooks/useI18nContext'
import { getCrossChainState } from '@view/selectors'
import { showQrScanner, updateCrossChainState } from '@view/store/actions'
import Dest from './dest'
export default function CrossChainDestWrapper() {
  const dispatch = useDispatch()
  const t = useI18nContext()
  const crossInfo = useSelector(getCrossChainState)
  const isNativeAsset = crossInfo.coinAddress === ethers.constants.AddressZero
  const targetIsNative =
    crossInfo.targetCoinAddress === ethers.constants.AddressZero
  const { loading, error, res } = useFetch(
    () =>
      checkTokenBridge({
        meta_chain_id: toBnString(crossInfo.fromChain),
        token_address: isNativeAsset
          ? ethers.constants.AddressZero
          : crossInfo.coinAddress,
      }),
    [crossInfo.fromChain, crossInfo.coinAddress],
  )
  useDeepEffect(() => {
    if (!loading && !error && res?.c === 200) {
      const supportChains = res?.d.map((chain) => ({
        ...chain,
        chainId: chain.target_meta_chain_id,
      }))
      const target = supportChains[0]
      dispatch(
        updateCrossChainState({
          supportChains,
        }),
      )
    }
  }, [loading, error, res])
  return (
    <div className='cross-chain-dest__wrapper'>
      <div className='cross-chain-dest-type-selector'>
        <div
          className='toggle'
          onClick={() => {
            dispatch(
              updateCrossChainState({
                isInternalTrans: !crossInfo.isInternalTrans,
                dest: crossInfo.isInternalTrans ? '' : crossInfo.from,
              }),
            )
          }}
        >
          <img
            src={
              crossInfo.isInternalTrans
                ? 'images/dex/send/checked.png'
                : 'images/dex/send/checkbox.png'
            }
            alt='checkbox'
          />
          <span>{t('dex_trans')}</span>
        </div>
        {!crossInfo.isInternalTrans && (
          <ChainSwitcher
            currentChainId={crossInfo.destChain}
            outSideChains={crossInfo.supportChains}
            onChange={(type, changedChainId) => {
              dispatch(
                updateCrossChainState({
                  destChain: changedChainId,
                }),
              )
            }}
          />
        )}
      </div>
      <div>
        {crossInfo.isInternalTrans ? (
          <Dest />
        ) : (
          <EnsInput
            userInput={crossInfo.dest}
            chainId={crossInfo.destChain}
            className='send__to-row'
            onChange={(userInputAddress) =>
              dispatch(
                updateCrossChainState({
                  userInputAddress,
                }),
              )
            }
            onValidAddressTyped={(dest) =>
              dispatch(
                updateCrossChainState({
                  dest,
                }),
              )
            }
            selectedAddress={crossInfo.dest}
            onPaste={(text) =>
              dispatch(
                updateCrossChainState({
                  dest: text,
                }),
              )
            }
            onReset={() =>
              dispatch(
                updateCrossChainState({
                  dest: '',
                  userInputAddress: '',
                }),
              )
            }
            scanQrCode={() => {
              dispatch(showQrScanner())
            }}
          />
        )}
      </div>
    </div>
  )
}
