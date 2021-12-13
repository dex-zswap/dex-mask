import React, { useMemo } from 'react';
import classnames from 'classnames';

export default function Logo({ width, height, plain, className }) {
  const style = useMemo(() => {
    return {
      width: `${plain ? (width ?? 38) : (width ?? 100)}px`,
      height: `${plain ? (width ?? 46) : (width ?? 86)}px`
    };
  }, [width, height, plain]);

  return (
    <div className={classnames(['logo-component', plain ? 'plain-logo' : 'logo-text', className])} style={style}></div>
  );
}
