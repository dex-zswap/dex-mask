import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
/**
 * Access known method data and attempt to resolve unknown method data
 *
 * encapsulates an effect that will fetch methodData when the component mounts,
 * and subsequently anytime the provided data attribute changes. Note that
 * the getContractMethodData action handles over-fetching prevention, first checking
 * if the data is in the store and returning it directly. While using this hook
 * in multiple places in a tree for the same data will create extra event ticks and
 * hit the action more frequently, it should only ever result in a single store update
 * @param {string} data - the transaction data to find method data for
 * @return {Object} contract method data
 */

import { getKnownMethodData } from '@selectors/selectors'
import { getContractMethodData as getContractMethodDataAction } from '@view/store/actions'
export function useMethodData(data) {
  const dispatch = useDispatch()
  const knownMethodData = useSelector((state) =>
    getKnownMethodData(state, data),
  )
  const getContractMethodData = useCallback(
    (methodData) => dispatch(getContractMethodDataAction(methodData)),
    [dispatch],
  )
  useEffect(() => {
    if (data) {
      getContractMethodData(data)
    }
  }, [getContractMethodData, data])
  return knownMethodData
}
