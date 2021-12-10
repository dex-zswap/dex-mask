import React, { useMemo, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';

import { NETWORK_TYPE_TO_ID_MAP } from '@shared/constants/network';

import { toBnString } from '@view/helpers/utils/conversions.util';
import { getAllSupportBridge, checkTokenBridge } from '@view/helpers/cross-chain-api';
import useDeepEffect from '@view/hooks/useDeepEffect';
import { getCrossChainState } from '@view/selectors';
import { updateCrossChainState, setProviderType } from '@view/store/actions';
import { useI18nContext } from '@view/hooks/useI18nContext';

const CrossChainSplitor = () => {
  const t = useI18nContext();
  const dispatch = useDispatch();
  const [ reverseCross, setReverseCross ] = useState(false);
  const crossInfo = useSelector(getCrossChainState);

  const isDifferentChain = useMemo(() => toBnString(crossInfo.fromChain) !== toBnString(crossInfo.destChain), [crossInfo]);

  const fromChainProviderType = useMemo(() => {
    const types = Object.keys(NETWORK_TYPE_TO_ID_MAP);
    for (let i = 0, { length } = types, providerType, providerInfo; i < length; i ++) {
      providerType = types[i];
      providerInfo = NETWORK_TYPE_TO_ID_MAP[providerType];
      if (toBnString(providerInfo.chainId) === toBnString(crossInfo.destChain)) {
        return providerType;
      }
    }
  }, [crossInfo.destChain]);

  const reverseTokenAndChain = useCallback(() => {
    checkTokenBridge({
      token_address: crossInfo.targetCoinAddress,
      meta_chain_id: toBnString(crossInfo.destChain)
    }).then((res) => res.json())
    .then(async (res) => {
      if (res.c === 200) {
        const target = res.d.find(({ target_meta_chain_id, token_address }) => target_meta_chain_id === toBnString(crossInfo.fromChain) && token_address === crossInfo.coinAddress);
        const newCrossInfo = Object.assign({}, crossInfo, {
          destChain: crossInfo.fromChain,
          fromChain: crossInfo.destChain,
          coinAddress: crossInfo.targetCoinAddress,
          coinSymbol: crossInfo.targetCoinSymbol,
          targetCoinAddress: crossInfo.coinAddress,
          targetCoinSymbol: crossInfo.coinSymbol,
          userInputValue: '',
          supportChains: res.d,
          target
        });

        await dispatch(setProviderType(fromChainProviderType));

        setTimeout(() => dispatch(updateCrossChainState(newCrossInfo)), 1000);
      }
    });
  }, [reverseCross, crossInfo, updateCrossChainState, fromChainProviderType, dispatch, setProviderType]);

  useDeepEffect(() => {
    getAllSupportBridge({
      offset: 0,
      limit: 1000000
    }).then((res) => res.json())
      .then((res) => {
        if (res.c === 200) {
          const destChain = toBnString(crossInfo.destChain);
          const destToken = crossInfo.targetCoinAddress;
          const reverseCross = res.d.some(({ meta_chain_id, token_address }) => meta_chain_id === destChain && token_address === destToken);
          setReverseCross(reverseCross);
        }
      })
  }, [crossInfo]);

  return (
    <div className={classnames(['cross-chain__splitor', isDifferentChain && 'diffrent-chain'])}>
      <div>
        {
          isDifferentChain ? <div className="bridge">{t('dexBridge')}</div> : null
        }
        {
          reverseCross ?
          <div className="reverse-cross" onClick={reverseTokenAndChain}>
            <div className="cicle-arrow"></div>
          </div>
          :
          <div className="arrow"></div>
        }
      </div>
    </div>
  );
};

export default CrossChainSplitor;
