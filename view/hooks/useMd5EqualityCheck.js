import { useState, useLayoutEffect } from 'react';

import { isEqual } from 'lodash';

import md5 from '@view/helpers/utils/md5.util';

export function useMd5EqualityCheck(value, process = JSON.stringify, equalityFn = isEqual) {
  const [computedValue, setComputedValue] = useState(value);

  useLayoutEffect(() => {
    if (!equalityFn(md5(process(value)), md5(process(computedValue)))) {
      setComputedValue(value);
    }
  }, [value, equalityFn, computedValue]);

  return computedValue;
}
