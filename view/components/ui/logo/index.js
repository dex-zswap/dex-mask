import classnames from 'classnames';
import React, { useMemo } from 'react';

export default function Logo({ width, height, plain, className, isCenter }) {
  const style = useMemo(() => {
    const obj = {
      width: `${plain ? width ?? 38 : width ?? 100}px`,
      height: `${plain ? width ?? 46 : width ?? 86}px`,
      margin: isCenter ? 'auto' : '0',
    };
    if (isCenter) {
      obj.margin = 'auto';
    }
    return obj;
  }, [width, height, plain, isCenter]);

  return (
    <div
      className={classnames([
        'logo-component',
        plain ? 'plain-logo' : 'logo-text',
        className,
      ])}
      style={style}
    ></div>
  );
}
