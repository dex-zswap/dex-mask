import TokenTracker from '@metamask/eth-token-tracker';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import isEqual from 'lodash/isEqual';
import clone from 'lodash/clone';
import { SECOND } from '@shared/constants/time';
import { getCurrentChainId, getSelectedAddress, getTokenDisplayOrders } from '@view/selectors';
import { setTokenDisplayOrders } from '@view/store/actions';
import { useEqualityCheck } from './useEqualityCheck';

export function useTokenTracker(
  tokens,
  includeFailedTokens = false,
  hideZeroBalanceTokens = false,
  address = '',
) {
  const chainId = useSelector(getCurrentChainId);
  const selectedAddress = useSelector(getSelectedAddress);
  const tokenOrders = useSelector((state) => getTokenDisplayOrders(state, false));
  const userAddress = useMemo(() => address || selectedAddress, [
    address,
    selectedAddress,
  ]);
  const [loading, setLoading] = useState(() => tokens?.length >= 0);
  const [tokensWithBalances, setTokensWithBalances] = useState([]);
  const userTokens = useRef([]);
  const [error, setError] = useState(null);
  const tokenTracker = useRef(null);
  const memoizedTokens = useEqualityCheck(tokens);
  const memoizedTokenOrders = useEqualityCheck(tokenOrders);
  const dispatch = useDispatch();

  const updateBalances = useCallback(
    (tokenWithBalances) => {
      const matchingTokens = hideZeroBalanceTokens
        ? tokenWithBalances.filter((token) => Number(token.balance) > 0)
        : tokenWithBalances;
      // TODO: improve this pattern for adding this field when we improve support for
      // EIP721 tokens.
      const matchingTokensWithIsERC721Flag = matchingTokens.map((token) => {
        const additionalTokenData = memoizedTokens.find(
          (t) => t.address === token.address,
        );
        return { ...token, isERC721: additionalTokenData?.isERC721 };
      });
      setTokensWithBalances(matchingTokensWithIsERC721Flag);
      setLoading(false);
      setError(null);
    },
    [hideZeroBalanceTokens, memoizedTokens],
  );

  const updateFirstTokenAddress = useCallback((tokenBalances) => {
    if (userTokens.current.length === 0) {
      userTokens.current = tokenBalances;
      return;
    }

    let diffed;

    for (let i = 0, { length } = tokenBalances, current = null, cached = null; i < length; i ++) {
      current = tokenBalances[i];
      cached = userTokens.current.find(({ address }) => address === current.address);
      if (cached && current.string !== cached.string) {
        diffed = current;
        break;
      }
    }

    if (diffed) {
      const tokenOrdersInfo = clone(memoizedTokenOrders);
  
      if (tokenOrdersInfo[chainId]) {
        const existOrders = clone(tokenOrdersInfo[chainId]?.[selectedAddress] ?? []);
        tokenOrdersInfo[chainId] = Object.assign(tokenOrdersInfo[chainId], {
          [selectedAddress]: [diffed.address].concat(existOrders.filter((address) => address !== diffed.address))
        });
      } else {
        tokenOrdersInfo[chainId] = {
          [selectedAddress]: [diffed.address]
        };
      }
      dispatch(setTokenDisplayOrders(tokenOrdersInfo));
    }

    userTokens.current = tokenBalances;
  }, [userTokens, dispatch, setTokenDisplayOrders, selectedAddress, chainId, memoizedTokenOrders]);

  const showError = useCallback((err) => {
    setError(err);
    setLoading(false);
  }, []);

  const teardownTracker = useCallback(() => {
    if (tokenTracker.current) {
      tokenTracker.current.stop();
      tokenTracker.current.removeAllListeners('update');
      tokenTracker.current.removeAllListeners('error');
      tokenTracker.current = null;
    }
  }, []);

  const buildTracker = useCallback(
    (address, tokenList) => {
      // clear out previous tracker, if it exists.
      teardownTracker();
      tokenTracker.current = new TokenTracker({
        userAddress: address,
        provider: global.ethereumProvider,
        tokens: tokenList,
        includeFailedTokens,
        pollingInterval: SECOND * 5,
      });

      tokenTracker.current.on('update', (tokenBalances) => {
        updateBalances(tokenBalances);
        updateFirstTokenAddress(tokenBalances);
      });
      tokenTracker.current.on('error', showError);
      tokenTracker.current.updateBalances();
    },
    [updateBalances, updateFirstTokenAddress, includeFailedTokens, showError, teardownTracker],
  );

  // Effect to remove the tracker when the component is removed from DOM
  // Do not overload this effect with additional dependencies. teardownTracker
  // is the only dependency here, which itself has no dependencies and will
  // never update. The lack of dependencies that change is what confirms
  // that this effect only runs on mount/unmount
  useEffect(() => {
    return teardownTracker;
  }, [teardownTracker]);

  // Effect to set loading state and initialize tracker when values change
  useEffect(() => {
    // This effect will only run initially and when:
    // 1. chainId is updated,
    // 2. userAddress is changed,
    // 3. token list is updated and not equal to previous list
    // in any of these scenarios, we should indicate to the user that their token
    // values are in the process of updating by setting loading state.
    setLoading(true);

    if (!userAddress || chainId === undefined || !global.ethereumProvider) {
      // If we do not have enough information to build a TokenTracker, we exit early
      // When the values above change, the effect will be restarted. We also teardown
      // tracker because inevitably this effect will run again momentarily.
      teardownTracker();
      return;
    }

    if (memoizedTokens.length === 0) {
      // sets loading state to false and token list to empty
      updateBalances([]);
    }

    buildTracker(userAddress, memoizedTokens);
  }, [
    userAddress,
    teardownTracker,
    chainId,
    memoizedTokens,
    updateBalances,
    buildTracker,
  ]);

  return { loading, tokensWithBalances, error };
}
