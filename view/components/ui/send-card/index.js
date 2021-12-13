import { getNativeCurrency } from '@reducer/dexmask/dexmask';
import { conversionUtil } from '@shared/modules/conversion.utils';
import { getPrice } from '@view/helpers/cross-chain-api';
import { useFetch } from '@view/hooks/useFetch';
import { useTokenTracker } from '@view/hooks/useTokenTracker';
import { getCurrentChainId } from '@view/selectors';
import BigNumber from 'bignumber.js';
import { zeroAddress } from 'ethereumjs-util';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

export default function SendCardAmountInput({
  isNativeCurrency = false,
  accountVal = 0,
  token = { address: '', symbol: '', decimals: 18 },
  onAmountChange,
  accountAddress,
}) {
  const chainId = useSelector(getCurrentChainId);
  const nativeCurrency = useSelector(getNativeCurrency);
  const { tokensWithBalances } = useTokenTracker(
    token ? [token] : [],
    false,
    false,
    accountAddress,
  );

  const { string } = tokensWithBalances[0] || {};

  const initVal = useMemo(
    () =>
      isNativeCurrency
        ? Number(
            conversionUtil(accountVal, {
              fromNumericBase: 'hex',
              toNumericBase: 'dec',
              fromDenomination: 'WEI',
              numberOfDecimals: 6,
              fromCurrency: null,
              toCurrency: null,
              toDenomination: null,
              conversionRate: null,
              invertConversionRate: null,
            }),
          )
        : Number(string),
    [isNativeCurrency, accountVal, string],
  );

  const tokenSymbol = useMemo(
    () => (isNativeCurrency ? nativeCurrency : token?.symbol),
    [isNativeCurrency, nativeCurrency, token?.symbol],
  );

  const [tokenVal, setTokenVal] = useState('');

  // useEffect(() => {
  //   setTokenVal(initVal);
  //   onAmountChange(initVal);
  // }, [initVal]);

  const { res, error, loading } = useFetch(
    () =>
      getPrice({
        token_address: isNativeCurrency ? zeroAddress() : token?.address,
        symbol: isNativeCurrency ? nativeCurrency : token?.symbol,
      }),
    [isNativeCurrency, nativeCurrency, token?.address, token?.symbol],
  );

  const usdPrice = useMemo(() => {
    if (error || loading) {
      return 0;
    }
    return new BigNumber(
      new BigNumber(res?.d?.price || 0)
        .times(new BigNumber(tokenVal || 0))
        .toFixed(3),
    ).toFixed();
  }, [res, error, loading, tokenVal]);

  const changeTokenVal = useCallback(
    ({ target }) => {
      let val = target.value.trim().replace(/\n/gu, '') || null;
      if (!val || isNaN(Number(val)) || val < 0) {
        val = '';
      }
      if (val > initVal) {
        val = initVal;
      }
      setTokenVal(val);
      onAmountChange(val);
    },
    [initVal],
  );

  useEffect(() => {
    setTokenVal('');
  }, [chainId]);

  return (
    <div className="send-card-amount-input-wrap">
      <div>
        <label>{tokenVal}</label>
        <input
          type="text"
          placeholder="0"
          value={tokenVal}
          onChange={changeTokenVal}
        />
        <span>{tokenSymbol}</span>
      </div>
      <div>≈ {usdPrice} USD</div>
    </div>
  );
}
