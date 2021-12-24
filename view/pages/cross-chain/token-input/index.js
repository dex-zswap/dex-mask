import React, { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import SendTokenInput from '@c/app/send-token-input';
import { getTokens } from '@reducer/dexmask/dexmask';
import useDeepEffect from '@view/hooks/useDeepEffect';
import { getCrossChainState, getShouldHideZeroBalanceTokens } from '@view/selectors';
import { updateCrossChainState } from '@view/store/actions';
import { getAllSupportBridge } from '@view/helpers/cross-chain-api';
import { toBnString } from '@view/helpers/utils/conversions.util';
 
export default function CrossChainTokenInput() {
  const [state, setState] = useState({
    includesNativeCurrencyToken: true,
    tokenList: []
  });

  const dispatch = useDispatch();

  const crossChainState = useSelector(getCrossChainState);
  const tokens = useSelector(getTokens);

  const chainId = useMemo(() => toBnString(crossChainState.fromChain), [crossChainState.fromChain]);
  const tokenAddresses = useMemo(() => tokens.map(({ address }) => address.toLowerCase()), [tokens]);

  const tokenChanged = useCallback(({ address: coinAddress }) => {
    dispatch(updateCrossChainState({
      coinAddress
    }));
  }, []);

  useDeepEffect(() => {
    const tokenList = [];
    let includesNativeCurrencyToken = false;
    let tokenIndex;

    getAllSupportBridge({
      offset: 0,
      limit: 1000000
    })
    .then((res) => res.json())
    .then((res) => {
      if (res.c === 200) {
        res.d.forEach((item) => {
          if (item.meta_chain_id === chainId) {
            if (item.token_address === ethers.constants.AddressZero) {
              includesNativeCurrencyToken = true;
            }

            if (item.token_address !== ethers.constants.AddressZero) {
              tokenIndex = tokenAddresses.findIndex(address => address === item.token_address);
              if (tokenIndex > -1 && tokens[tokenIndex]) {
                tokenList.push(tokens[tokenIndex]);
              }
            }
          }
        });
      }

      setState(() => ({
        includesNativeCurrencyToken,
        tokenList
      }));
    });
  }, [chainId, tokenAddresses, tokens]);

  return (
    <div>
      <SendTokenInput {...state} tokenAddress={crossChainState.coinAddress} changeToken={tokenChanged} />
    </div>
  );
}