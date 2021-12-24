import React from 'react'
import classnames from 'classnames' // Button.type default|primary|warning|transparent

const Button = ({
  type = 'default',
  large,
  children,
  rightArrow,
  leftArrow,
  disabled,
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
    >
      {leftArrow && <span className='button__left__arrow'></span>}
      {children}
      {rightArrow && <span className='button__right__arrow'></span>}
    </Tag>
  )
}

export default Button
