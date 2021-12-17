import React from 'react';
import classnames from 'classnames';
import { GWEI } from '@view/helpers/constants/common';
import { useCurrencyDisplay } from '@view/hooks/useCurrencyDisplay';
export default function CurrencyDisplay({
  value,
  displayValue,
  style,
  className,
  prefix,
  prefixComponent,
  hideLabel,
  hideTitle,
  numberOfDecimals,
  denomination,
  currency,
  suffix
}) {
  const [title, parts] = useCurrencyDisplay(value, {
    displayValue,
    prefix,
    numberOfDecimals,
    hideLabel,
    denomination,
    currency,
    suffix
  });
  return <div className={classnames('currency-display-component', className)} style={style} title={!hideTitle && title || null}>
      {prefixComponent}
      <span className="currency-display-component__text">
        {parts.prefix}
        {['0.00', '$0.00'].includes(parts.value) ? '0' : parts.value ?? '0'}
      </span>
      {parts.suffix && <span className="currency-display-component__suffix">
          {parts.suffix}
        </span>}
    </div>;
}