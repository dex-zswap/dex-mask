<<<<<<< HEAD
import React from 'react'
import classnames from 'classnames' // Button.type default|primary|warning|transparent
=======
import classnames from 'classnames'; // Button.type default|primary|warning|transparent
import React from 'react';
>>>>>>> 6f848f0de64bc29fe937d85d990914e88be7e7dc

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
