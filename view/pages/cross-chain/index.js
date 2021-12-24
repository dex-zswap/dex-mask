import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TopHeader from '@c/ui/top-header';
import BackBar from '@c/ui/back-bar';
import { useI18nContext } from '@view/hooks/useI18nContext';
import { getSelectedAccount, getCurrentChainId, getCrossChainState } from '@view/selectors';
import { initializeCrossState, disposePollingGas } from '@reducer/cross-chain/cross-chain';
import CrossChainButton from './button';
import CrossChainTokenInput from './token-input';
 
export default function CrossChain() {
  const t = useI18nContext();
  const dispatch = useDispatch();
  const selectedAccount = useSelector(getSelectedAccount);
  const crossChainState = useSelector(getCrossChainState);

  const cleanUp = useCallback(() => {
    dispatch(disposePollingGas());
  }, []);

  useEffect(() => {
    console.log(selectedAccount)
    dispatch(initializeCrossState(selectedAccount.balance));

    return () => cleanUp();
  }, [crossChainState.fromChain, selectedAccount.address, selectedAccount.balance]);

  return (
    <div className="cross-chain-page dex-page-container space-between base-width">
      <div className='cross-chain-top'>
        <TopHeader />
        <BackBar title={[t('sendToken'), t('dexBridge')].join(' - ')} backCb={cleanUp} />
        <CrossChainTokenInput />
      </div>
      <CrossChainButton />
    </div>
  );
}