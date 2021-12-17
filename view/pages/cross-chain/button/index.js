import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';
import Button from '@c/ui/button';
import { getTokens } from '@reducer/dexmask/dexmask';
import { MAX_UINT_256 } from '@shared/constants/app';
import BRIDGE_ABI from '@shared/contract-abis/bridge';
import MINTABLE_ABI from '@shared/contract-abis/mintable';
import { CONFIRM_TRANSACTION_ROUTE, CROSSCHAIN_ROUTE } from '@view/helpers/constants/routes';
import { expandDecimals } from '@view/helpers/utils/conversions.util';
import { useI18nContext } from '@view/hooks/useI18nContext';
import useInterval from '@view/hooks/useInterval';
import { getCrossChainState } from '@view/selectors';
import { showConfTxPage, updateConfirmAction, updateCrossChainState } from '@view/store/actions';

const CrossChainButton = () => {
  const t = useI18nContext();
  const dispatch = useDispatch();
  const history = useHistory();
  const crossInfo = useSelector(getCrossChainState);
  const tokens = useSelector(getTokens);
  const isNativeAsset = crossInfo.coinAddress === ethers.constants.AddressZero;
  const decimals = useMemo(() => {
    if (isNativeAsset) {
      return 18;
    }

    const token = tokens.find(({
      address
    }) => address === crossInfo.coinAddress);
    return token?.decimals ?? 18;
  }, [crossInfo.coinAddress, tokens]);
  const [mounted, setMounted] = useState(false || isNativeAsset);
  const [allowed, setAllowed] = useState(false || isNativeAsset);
  const userInput = useMemo(() => crossInfo.userInputValue ? expandDecimals(crossInfo.userInputValue) : ethers.constants.Zero, [crossInfo.userInputValue]);
  const shouldDisable = useMemo(() => userInput.isZero() || !Boolean(crossInfo.dest), [userInput, crossInfo]);
  const approve = useCallback(() => {
    const abiInterface = new ethers.utils.Interface(MINTABLE_ABI);
    const data = abiInterface.encodeFunctionData('approve', [crossInfo.target.handler, MAX_UINT_256]);
    global.ethQuery.sendTransaction({
      from: crossInfo.from,
      to: crossInfo.coinAddress,
      data
    }, (e, hash) => {});
    dispatch(showConfTxPage());
    dispatch(updateConfirmAction(CROSSCHAIN_ROUTE));
    history.push(CONFIRM_TRANSACTION_ROUTE);
  }, [crossInfo, history]);
  const transfer = useCallback(() => {
    const abiInterface = new ethers.utils.Interface(BRIDGE_ABI);
    const sendData = ['0x', ethers.utils.hexZeroPad(ethers.BigNumber.from(expandDecimals(crossInfo.userInputValue, decimals)).toHexString(), 32).substr(2), ethers.utils.hexZeroPad(ethers.utils.hexlify((crossInfo.from.length - 2) / 2), 32).substr(2), crossInfo.dest.substr(2)].join('');
    const data = abiInterface.encodeFunctionData('deposit', [crossInfo.target.target_chain_id, crossInfo.target.resource_id, sendData]);
    const value = isNativeAsset ? ethers.utils.hexZeroPad(ethers.BigNumber.from(expandDecimals(crossInfo.target.fee)).add(expandDecimals(crossInfo.userInputValue)).toHexString(), 32) : ethers.utils.hexZeroPad(ethers.BigNumber.from(expandDecimals(crossInfo.target.fee)).toHexString(), 32);
    global.ethQuery.sendTransaction({
      from: crossInfo.from,
      to: crossInfo.target.bridge,
      value,
      data
    }, e => {});
    dispatch(showConfTxPage());
    dispatch(updateConfirmAction(null));
    history.push(CONFIRM_TRANSACTION_ROUTE);
  }, [crossInfo, decimals]);
  useInterval(() => {
    if (!isNativeAsset && !allowed && crossInfo.target?.handler) {
      const mintContract = global.eth.contract(MINTABLE_ABI).at(crossInfo.coinAddress);
      mintContract.allowance(crossInfo.from, crossInfo.target?.handler).then(res => {
        setAllowed(!res[0].isZero());
        setMounted(true);
      });
    } else {
      setAllowed(true);
      setMounted(true);
    }
  }, 2000);
  useEffect(() => {
    return () => dispatch(updateCrossChainState({
      userInputValue: ''
    }));
  }, [dispatch, updateCrossChainState]);
  useEffect(() => {
    setMounted(false);
    setAllowed(false);
  }, [crossInfo.coinAddress]);
  return mounted ? <div className="cross-chain__button">
      {allowed ? <Button type="primary" disabled={shouldDisable} rightArrow onClick={transfer}>
          Trans
        </Button> : <Button type="primary" disabled={shouldDisable} rightArrow onClick={approve}>
          Allow
        </Button>}
    </div> : null;
};

export default CrossChainButton;