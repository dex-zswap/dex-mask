import React from 'react';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import LongLetter from '@c/ui/long-letter';
import TokenImage from '@c/ui/token-image';
import { getNativeCurrency, getTokens } from '@reducer/dexmask/dexmask';
import { NETWORK_TO_NAME_MAP } from '@shared/constants/network';
import { PRIMARY, SECONDARY } from '@view/helpers/constants/common';
import { useCurrencyDisplay } from '@view/hooks/useCurrencyDisplay';
import { useI18nContext } from '@view/hooks/useI18nContext';
import { useTokenFiatAmount } from '@view/hooks/useTokenFiatAmount';
import { useTokenTracker } from '@view/hooks/useTokenTracker';
import { useUserPreferencedCurrency } from '@view/hooks/useUserPreferencedCurrency';
import { getAssetImages, getCurrentAccountWithSendEtherInfo, getCurrentChainId, getNativeCurrencyImage, getShouldHideZeroBalanceTokens } from '@view/selectors';
export default function TokenInfo({
  isNative,
  token
}) {
  const address = isNative ? null : token.address;
  const t = useI18nContext();
  const assetImages = useSelector(getAssetImages);
  const selectedAccountBalance = useSelector(state => getCurrentAccountWithSendEtherInfo(state).balance);
  const provider = useSelector(state => state.metamask.provider);
  const chainId = useSelector(getCurrentChainId);
  const nativeCurrency = useSelector(getNativeCurrency);
  const providerType = NETWORK_TO_NAME_MAP[provider.type] ?? provider.type.toUpperCase();
  const shouldHideZeroBalanceTokens = useSelector(getShouldHideZeroBalanceTokens);
  const {
    currency: primaryCurrency,
    numberOfDecimals: primaryNumberOfDecimals
  } = useUserPreferencedCurrency(PRIMARY, {
    ethNumberOfDecimals: 4
  });
  const {
    currency: secondaryCurrency,
    numberOfDecimals: secondaryNumberOfDecimals
  } = useUserPreferencedCurrency(SECONDARY, {
    ethNumberOfDecimals: 4
  });
  const [, primaryCurrencyProperties] = useCurrencyDisplay(selectedAccountBalance, {
    numberOfDecimals: primaryNumberOfDecimals,
    currency: primaryCurrency
  });
  const [secondaryCurrencyDisplay, secondaryCurrencyProperties] = useCurrencyDisplay(selectedAccountBalance, {
    numberOfDecimals: secondaryNumberOfDecimals,
    currency: secondaryCurrency
  });
  const primaryTokenImage = useSelector(getNativeCurrencyImage);
  const tokens = useSelector(getTokens, isEqual);
  const {
    loading,
    tokensWithBalances
  } = useTokenTracker(tokens, true, shouldHideZeroBalanceTokens);
  let tokenBalance, tokenSymbol, tokenImage, formattedFiat;

  if (isNative) {
    tokenBalance = primaryCurrencyProperties.value;
    tokenSymbol = nativeCurrency;
    tokenImage = primaryTokenImage;
  } else {
    tokenBalance = (tokensWithBalances.find(({
      address: tokenAddress
    }) => address === tokenAddress) ?? {}).string || '0';
    tokenSymbol = (tokensWithBalances.find(({
      address: tokenAddress
    }) => address === tokenAddress) ?? {}).symbol || 'UNKNOWN';
  }

  formattedFiat = useTokenFiatAmount(token?.address, tokenBalance, token?.symbol, {
    showFiat: true
  });

  if (isNative) {
    formattedFiat = secondaryCurrencyDisplay;
  }

  return <div className="asset__token-info">
      <div className="asset__token-info__token-image">
        <div className="asset__token-info__token-image-wrapper">
          {
          /* {isNative ? (
           <img className="image" src={tokenImage} />
          ) : (
           <Identicon address={address} diameter={54} />
          )} */
        }
          <TokenImage symbol={tokenSymbol} size={36} address={isNative ? ethers.constants.AddressZero : address} />
        </div>
      </div>
      <div className="asset__token-info__token-symbol-balance">
        <span className="symbol-text">{tokenSymbol}</span>
        <span className="balance-text" title={`${tokenBalance} ${tokenSymbol}`}>
          <LongLetter text={tokenBalance} length={8} />
        </span>
      </div>
      <div className="asset__token-info__token-usd-balance">
        <span className="symbol-text">
          {tokenSymbol} in {providerType} version
        </span>
        <span className="balance-text">{formattedFiat}</span>
      </div>
    </div>;
}
TokenInfo.propTypes = {
  isNative: PropTypes.bool,
  token: PropTypes.object
};