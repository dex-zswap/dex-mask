import { useState, useEffect, useRef } from 'react';
import { isEqual } from 'lodash';
export default function useDeepEffect(fn, deps = []) {
  const isFirst = useRef(true);
  const prevDeps = useRef(deps);
  useEffect(() => {
    const isSame = isEqual(prevDeps.current, deps);

    if (isFirst.current || !isSame) {
      fn();
      prevDeps.current = deps;

      if (isFirst.current) {
        isFirst.current = false;
      }
    }
  }, deps);
}
