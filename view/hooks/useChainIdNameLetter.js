import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { NETWORK_TYPE_TO_ID_MAP } from '@shared/constants/network'
import { toBnString } from '@view/helpers/utils/conversions.util'
import { getCurrentChainId } from '@view/selectors'
export default function useChainIdNameLetter(chainId) {
  const currentChainId = useSelector(getCurrentChainId)
  const frequentRpcList = useSelector(
    (state) => state.metamask.frequentRpcListDetail || [],
  )
  useEffect(() => {
    frequentRpcList.map(({ chainId, nickname }) => {
      NETWORK_TYPE_TO_ID_MAP[chainId] = nickname.substring(0, 1).toUpperCase()
    })
  }, [frequentRpcList])
  const chainIdKeys = useMemo(() => Object.keys(NETWORK_TYPE_TO_ID_MAP), [
    NETWORK_TYPE_TO_ID_MAP,
  ])
  return useMemo(() => {
    const id = chainId || currentChainId

    for (let i = 0, { length } = chainIdKeys; i < length; i++) {
      if (NETWORK_TYPE_TO_ID_MAP[chainIdKeys[i]].networkId === toBnString(id)) {
        return NETWORK_TYPE_TO_ID_MAP[chainIdKeys[i]].symbol.substring(0, 1)
      }
    }

    return 'U'
  }, [chainId, currentChainId, NETWORK_TYPE_TO_ID_MAP])
}
