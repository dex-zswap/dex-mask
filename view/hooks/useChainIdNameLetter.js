import { CHAIN_ID_NAME_LETTER_MAP } from '@c/ui/cross-chain/constants';
import { toBnString } from '@view/helpers/utils/conversions.util';
import { getCurrentChainId } from '@view/selectors';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

const chainIdNameLetterMap = { ...CHAIN_ID_NAME_LETTER_MAP };

export default function useChainIdNameLetter(chainId) {
  const currentChainId = useSelector(getCurrentChainId);
  const frequentRpcList = useSelector(
    (state) => state.metamask.frequentRpcListDetail || [],
  );

  useEffect(() => {
    frequentRpcList.map(({ chainId, nickname }) => {
      chainIdNameLetterMap[chainId] = nickname.substring(0, 1).toUpperCase();
    });
  }, [frequentRpcList]);

  const chainIdKeys = useMemo(() => Object.keys(chainIdNameLetterMap), [
    chainIdNameLetterMap,
  ]);

  return useMemo(() => {
    const id = chainId || currentChainId;
    for (let i = 0, { length } = chainIdKeys; i < length; i++) {
      if (toBnString(chainIdKeys[i]) === toBnString(id)) {
        return chainIdNameLetterMap[chainIdKeys[i]];
      }
    }
  }, [chainId, currentChainId, chainIdNameLetterMap]);
}
