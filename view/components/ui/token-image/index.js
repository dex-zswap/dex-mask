import { ethers } from 'ethers';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getIcon } from '@view/helpers/cross-chain-api';
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
  showLetter = false,
}) {
  const currentChainId = useSelector(getCurrentChainId);
  const letter = useChainIdNameLetter(chainId);
  const nativeCurrencyImage = useSelector(getNativeCurrencyImage);

  const isNativeCurrency = address === ethers.constants.AddressZero;

  const networkId = useMemo(() => {
    if (chainId) {
      return toBnString(chainId);
    }

    if (currentChainId) {
      return toBnString(currentChainId)
    }

    return '1';
  }, [chainId, currentChainId])

  const { loading, error, res } = useFetch(
    () =>
      getIcon({
        token_address: address,
        meta_chain_id: networkId
      }),
    [address, networkId],
  );

  const style = useMemo(
    () => ({
      width: `${size}px`,
      height: `${size}px`,
    }),
    [size],
  );

  const tokenImageUrl = useMemo(() => {
    if (loading || error || res?.c !== 200) {
      return null;
    }

    return res?.d?.icon;
  }, [loading, error, res]);

  let tokenImage;

  if (tokenImageUrl) {
    tokenImage = (
      <img className="img" src={`data:image/png;base64,${tokenImageUrl}`} />
    );
  } else {
    tokenImage = <div className="default-token-image" style={style}></div>;
  }

  if (isNativeCurrency && nativeCurrencyImage && !tokenImageUrl) {
    tokenImage = <img className="img native" src={nativeCurrencyImage} />;
  }

  if (isNativeCurrency && chainId && toBnString(currentChainId) !== toBnString(chainId) && CHAIN_ID_NATIVE_TOKEN_IMAGE[chainId] && !tokenImageUrl) {
    tokenImage = <img className="img native" src={CHAIN_ID_NATIVE_TOKEN_IMAGE[chainId]} />;
  }

  return (
    <div className="token-image__component" style={style}>
      {tokenImage}
      {showLetter && (
        <span className="token-image__component-letter">{letter}</span>
      )}
    </div>
  );
}
