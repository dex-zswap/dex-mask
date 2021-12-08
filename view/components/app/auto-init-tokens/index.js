import { getTokens } from '@reducer/dexmask/dexmask';
import { getIndexAssets } from '@view/helpers/cross-chain-api';
import { toBnString } from '@view/helpers/utils/conversions.util';
import useDeepEffect from '@view/hooks/useDeepEffect';
import { useEqualityCheck } from '@view/hooks/useEqualityCheck';
import {
  getCurrentChainId,
  getSelectedAddress,
  getTokenDisplayOrders,
} from '@view/selectors';
import { addTokens, setTokenDisplayOrders } from '@view/store/actions';
import classnames from 'classnames';
import clone from 'lodash/clone';
import isEqual from 'lodash/isEqual';
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const AutoInitTokens = () => {
  const dispatch = useDispatch();
  const [paddingTokens, setPaddingTokens] = useState({});
  const userTokens = useSelector(getTokens);
  const chainId = useSelector(getCurrentChainId);
  const userAddress = useSelector(getSelectedAddress);
  const tokenOrders = useSelector((state) =>
    getTokenDisplayOrders(state, false),
  );
  const memoizedTokenOrders = useEqualityCheck(tokenOrders);

  const userTokenAddress = useMemo(
    () => userTokens.map(({ address }) => address),
    [userTokens],
  );

  useDeepEffect(() => {
    getIndexAssets({
      offset: 0,
      limit: 1000,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.c === 200) {
          const chain = toBnString(chainId);
          const tokenMap = {};
          const tokenAddesses = [];

          res.d.forEach((token) => {
            if (
              !userTokenAddress.includes(token.token_address) &&
              chain === token.meta_chain_id
            ) {
              tokenMap[token.token_address] = {
                address: token.token_address,
                decimals: token.decimals,
                symbol: token.token,
              };
              tokenAddesses.push(token.token_address);
            }
          });

          if (tokenAddesses.length) {
            const orderInfo = clone(memoizedTokenOrders);

            if (orderInfo[chainId]) {
              const existOrders = clone(
                orderInfo[chainId]?.[userAddress] ?? [],
              );
              orderInfo[chainId] = Object.assign(orderInfo[chainId], {
                [userAddress]: tokenAddesses.concat(
                  existOrders.filter(
                    (address) => !tokenAddesses.includes(address),
                  ),
                ),
              });
            } else {
              orderInfo[chainId] = {
                [userAddress]: tokenAddesses,
              };
            }

            if (!isEqual(orderInfo, memoizedTokenOrders)) {
              dispatch(setTokenDisplayOrders(orderInfo));
            }
          }

          setPaddingTokens(tokenMap);
        }
      });
  }, [
    chainId,
    userAddress,
    userTokens,
    userTokenAddress,
    memoizedTokenOrders,
    dispatch,
    setTokenDisplayOrders,
  ]);

  useDeepEffect(() => {
    dispatch(addTokens(paddingTokens));
  }, [paddingTokens, dispatch, addTokens]);

  return (
    <div
      className={classnames(
        Object.keys(paddingTokens).map(
          (address) => `auto-inited-token-${address}`,
        ),
      )}
    ></div>
  );
};

export default AutoInitTokens;
