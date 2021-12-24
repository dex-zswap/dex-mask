import classnames from 'classnames'; // Button.type default|primary|warning|transparent
import React from 'react';

const Button = ({
  type = 'default',
  large,
  children,
  rightArrow,
  leftArrow,
  disabled = false,
  className,
  onClick,
  as,
}) => {
  let Tag = 'button'

  if (as) {
    Tag = as
  }

  return (
    <Tag
      onClick={onClick}
      className={classnames(
        'dex-button',
        `button-${type}`,
        className,
        disabled && 'button-disabled',
      )}
      disabled={disabled}
    >
      {leftArrow && <span className='button__left__arrow'></span>}
      {children}
      {rightArrow && <span className='button__right__arrow'></span>}
    </Tag>
  )
}

export default Button
