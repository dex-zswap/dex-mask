import React, { useEffect, useMemo } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTokens } from '@reducer/dexmask/dexmask';
import { DEFAULT_ROUTE } from '@view/helpers/constants/routes';
import useDeepEffect from '@view/hooks/useDeepEffect';
import { getCurrentChainId, getSelectedAddress, getTokenDisplayOrders } from '@view/selectors';
import { setTokenDisplayOrders } from '@view/store/actions';
import clone from 'lodash/clone';
import NativeAsset from './components/native-asset';
import TokenAsset from './components/token-asset';

const Asset = () => {
  const dispatch = useDispatch();
  const nativeCurrency = useSelector(state => state.metamask.nativeCurrency);
  const chainId = useSelector(getCurrentChainId);
  const selectedAddress = useSelector(getSelectedAddress);
  const tokenOrders = useSelector(state => getTokenDisplayOrders(state, false));
  const tokens = useSelector(getTokens);
  const {
    asset
  } = useParams();
  const isNative = useMemo(() => nativeCurrency === asset, [nativeCurrency, asset]);
  const tokenDisplayOrder = useMemo(() => {
    const tokenOrderInfo = clone(tokenOrders);

    if (tokenOrderInfo[chainId]) {
      const existOrders = clone(tokenOrderInfo[chainId]?.[selectedAddress] ?? []);
      tokenOrderInfo[chainId] = Object.assign(tokenOrderInfo[chainId], {
        [selectedAddress]: [asset].concat(existOrders.filter(address => address !== asset))
      });
    } else {
      tokenOrderInfo[chainId] = {
        [selectedAddress]: [asset]
      };
    }

    return tokenOrderInfo;
  }, [chainId, selectedAddress, tokenOrders]);
  const token = tokens.find(({
    address
  }) => address === asset);
  useEffect(() => {
    const el = document.querySelector('.app');
    el.scroll(0, 0);
  }, []);
  useDeepEffect(() => {
    if (!isNative) {
      dispatch(setTokenDisplayOrders(tokenDisplayOrder));
    }
  }, [isNative, dispatch, setTokenDisplayOrders, tokenDisplayOrder]);
  let content;

  if (token) {
    content = <TokenAsset token={token} />;
  } else if (asset === nativeCurrency) {
    content = <NativeAsset nativeCurrency={nativeCurrency} />;
  } else {
    content = <Redirect to={{
      pathname: DEFAULT_ROUTE
    }} />;
  }

  return <div className="main-container asset__container">{content}</div>;
};

export default Asset;