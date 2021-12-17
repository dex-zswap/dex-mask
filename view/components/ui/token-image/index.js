import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { getAssetIcon } from '@view/helpers/cross-chain-api';
import useChainIdNameLetter from '@view/hooks/useChainIdNameLetter';
import { useFetch } from '@view/hooks/useFetch';
import { getNativeCurrencyImage, getCurrentChainId } from '@view/selectors';
import { toBnString } from '@view/helpers/utils/conversions.util';
import { CHAIN_ID_NATIVE_TOKEN_IMAGE } from '@shared/constants/network';
export default function TokenImage({
  address,
  symbol,
  size,
  chainId = '',
  showLetter = false
}) {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [src, setSrc] = useState('');
  const currentChainId = useSelector(getCurrentChainId);
  const letter = useChainIdNameLetter(chainId);
  const nativeCurrencyImage = useSelector(getNativeCurrencyImage);
  const isNativeCurrency = address === ethers.constants.AddressZero;
  const networkId = useMemo(() => {
    if (chainId) {
      return toBnString(chainId);
    }

    if (currentChainId) {
      return toBnString(currentChainId);
    }

    return '1';
  }, [chainId, currentChainId]);
  const style = useMemo(() => ({
    width: `${size}px`,
    height: `${size}px`
  }), [size]);
  const tokenImage = useMemo(() => {
    if (success) {
      return <img className="img" src={src} style={style} />;
    }

    return <div className="default-token-image" style={style}></div>;
  }, [success, src, style]);
  useEffect(() => {
    setLoading(true);
    setSuccess(false);
    setSrc('');
    const img = new Image();
    img.src = getAssetIcon({
      meta_chain_id: networkId,
      token_address: address
    });
    img.addEventListener('load', () => {
      setLoading(false);
      setSuccess(true);
      setSrc(img.src);
    });
    img.addEventListener('error', () => {
      setLoading(false);
      setSuccess(false);
    });
  }, [networkId, address]);
  return <div className="token-image__component" style={style}>
      {tokenImage}
      {showLetter && <span className="token-image__component-letter">{letter}</span>}
    </div>;
}