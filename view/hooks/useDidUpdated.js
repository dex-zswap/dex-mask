import { useRef } from 'react'
import useDeepEffect from './useDeepEffect'
export default function useDidUpdated(callback, deps = []) {
  const mounted = useRef(false)
  useDeepEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }

    callback()
    return () => (mounted.current = false)
  }, [mounted.current, ...deps])
}
