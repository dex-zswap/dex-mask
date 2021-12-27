import { useState } from 'react'
import useDeepEffect from './useDeepEffect'
export function useFetch(fetcher, deps) {
  const [loading, setLoading] = useState(true)
  const [res, setRes] = useState(null)
  const [error, setError] = useState(false)
  useDeepEffect(() => {
    if (typeof fetcher === 'function') {
      setLoading(true)
      fetcher()
        .then((res) => res.json())
        .then(
          (res) => {
            setRes(res)
            setLoading(false)
          },
          (error) => {
            setError(true)
            setLoading(false)
          },
        )
        .catch((error) => {
          setError(true)
          setLoading(false)
        })
    } else {
      setRes(null)
      setError(false)
      setLoading(false)
    }
  }, deps)
  return {
    loading,
    res,
    error,
  }
}
