import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';
import AccountSwitcher from '@c/ui/cross-chain/account-switcher';
import ChainSwitcher from '@c/ui/cross-chain/chain-switcher';
import CurrentToken from '@c/ui/cross-chain/current-token';
import { checkTokenBridge } from '@view/helpers/cross-chain-api';
import useTokenBalance from '@view/helpers/token-balance';
import { toBnString } from '@view/helpers/utils/conversions.util';
import useDeepEffect from '@view/hooks/useDeepEffect';
import { useFetch } from '@view/hooks/useFetch';
import { useI18nContext } from '@view/hooks/useI18nContext';
import { getCrossChainState } from '@view/selectors';
import { updateCrossChainState } from '@view/store/actions';

const CrossChainDest = () => {
  const t = useI18nContext();
  const dispatch = useDispatch();
  const crossInfo = useSelector(getCrossChainState);
  const isNativeAsset = crossInfo.coinAddress === ethers.constants.AddressZero;
  const targetIsNative =
    crossInfo.targetCoinAddress === ethers.constants.AddressZero;
  const tokenBalance = useTokenBalance({
    tokenAddress: targetIsNative ? null : crossInfo.targetCoinAddress,
    wallet: crossInfo.dest,
    chainId: crossInfo.destChain,
    isNativeAsset: targetIsNative,
  });
  const { loading, error, res } = useFetch(
    () =>
      checkTokenBridge({
        meta_chain_id: toBnString(crossInfo.fromChain),
        token_address: isNativeAsset
          ? ethers.constants.AddressZero
          : crossInfo.coinAddress,
      }),
    [crossInfo.fromChain, crossInfo.coinAddress],
  );
  const chainChange = useCallback(
    (chainType, chain) => {
      const { supportChains } = crossInfo;
      const targetInfo = supportChains.find(
        ({ meta_chain_id }) => toBnString(meta_chain_id) === toBnString(chain),
      );
      dispatch(
        updateCrossChainState({
          destChain: chain,
          targetCoinAddress: targetInfo.target_token_address,
          targetCoinSymbol: targetInfo.target_token_name,
        }),
      );
    },
    [dispatch, updateCrossChainState, crossInfo],
  );
  const accountChange = useCallback(
    (account) => {
      dispatch(
        updateCrossChainState({
          dest: account.address,
        }),
      );
    },
    [dispatch, updateCrossChainState],
  );
  useDeepEffect(() => {
    if (!loading && !error && res?.c === 200) {
      const supportChains = res?.d.map((chain) => ({
        ...chain,
        chainId: chain.target_meta_chain_id,
      }));
      const target = supportChains[0];
      dispatch(
        updateCrossChainState({
          supportChains,
          destChain: target.chainId,
          targetCoinAddress: target.target_token_address,
          targetCoinSymbol: target.target_token,
          target,
        }),
      );
    }
  }, [loading, error, res, dispatch, updateCrossChainState]);
  return (
    <div className="cross-chain-dest__component">
      <div className="top">
        <CurrentToken
          useOut
          coinAddress={crossInfo.targetCoinAddress}
          diameter={40}
          coinSymbol={crossInfo.targetCoinSymbol}
          currentChainId={crossInfo.destChain}
        >
          <AccountSwitcher address={crossInfo.dest} onChange={accountChange} />
        </CurrentToken>
        <ChainSwitcher
          currentChainId={crossInfo.destChain}
          outSideChains={crossInfo.supportChains}
          onChange={chainChange}
        />
      </div>
      <div className="amount">
        {t('balance')}: {tokenBalance}
        {crossInfo.targetCoinSymbol}
      </div>
    </div>
  );
};

export default CrossChainDest;
