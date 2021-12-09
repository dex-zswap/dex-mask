import TokenCell from '@c/app/token-cell';
import { getTokens } from '@reducer/dexmask/dexmask';
import { useI18nContext } from '@view/hooks/useI18nContext';
import { useTokenTracker } from '@view/hooks/useTokenTracker';
import {
  getAssetImages,
  getShouldHideZeroBalanceTokens,
  getTokenDisplayOrders,
} from '@view/selectors';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

export default function TokenList({ onTokenClick }) {
  const t = useI18nContext();
  const tokenDisplayOrders = useSelector(getTokenDisplayOrders);
  const assetImages = useSelector(getAssetImages);

  const shouldHideZeroBalanceTokens = useSelector(
    getShouldHideZeroBalanceTokens,
  );
  // use `isEqual` comparison function because the token array is serialized
  // from the background so it has a new reference with each background update,
  // even if the tokens haven't changed
  const tokens = useSelector(getTokens, isEqual);
  const { loading, tokensWithBalances } = useTokenTracker(
    tokens,
    true,
    shouldHideZeroBalanceTokens,
  );

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          height: '250px',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px',
        }}
      >
        {t('loadingTokens')}
      </div>
    );
  }

  return (
    <div>
      {tokensWithBalances.map((tokenData, index) => {
        if (tokenData) {
          tokenData.image = assetImages[tokenData.address];
          return (
            <TokenCell key={index} {...tokenData} onClick={onTokenClick} />
          );
        } else {
          return null;
        }
      })}
    </div>
  );
}

TokenList.propTypes = {
  onTokenClick: PropTypes.func.isRequired,
};
