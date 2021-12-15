import React, { PureComponent } from 'react';
import { Tooltip as ReactTippy } from 'react-tippy';

import merge from 'lodash/merge';

const defaultProps = {
  arrow: true,
  children: null,
  containerClassName: '',
  html: null,
  interactive: undefined,
  onHidden: null,
  position: 'left',
  offset: 0,
  size: 'small',
  title: null,
  trigger: 'mouseenter focus',
  wrapperClassName: undefined,
  theme: '',
  tag: 'div',
};

export default function Tooltip(props) {
  const {
    arrow,
    children,
    containerClassName,
    disabled,
    position,
    html,
    interactive,
    size,
    title,
    trigger,
    onHidden,
    offset,
    wrapperClassName,
    style,
    theme,
    tabIndex,
    tag,
  } = merge(defaultProps, props);

  if (!title && !html) {
    return <div className={wrapperClassName}>{children}</div>;
  }

  return React.createElement(
    tag,
    { className: wrapperClassName },
    <ReactTippy
      arrow={arrow}
      className={containerClassName}
      disabled={disabled}
      hideOnClick={false}
      html={html}
      interactive={interactive}
      onHidden={onHidden}
      position={position}
      size={size}
      offset={offset}
      style={style}
      title={title}
      trigger={trigger}
      theme={theme}
      tabIndex={tabIndex || 0}
      tag={tag}
    >
      {children}
    </ReactTippy>,
  );
}
