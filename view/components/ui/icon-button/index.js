import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const defaultRender = (inner) => inner

export default function IconButton({
  onClick,
  Icon,
  disabled,
  label,
  tooltipRender,
  className,
  iconSize,
  ...props
}) {
  const renderWrapper = tooltipRender ?? defaultRender
  return (
    <button
      className={classNames('icon-button', className, {
        'icon-button--disabled': disabled,
      })}
      data-testid={props['data-testid'] ?? undefined}
      onClick={onClick}
      disabled={disabled}
    >
      {renderWrapper(
        <>
          <div className='icon-button__circle'>
            <Icon width={iconSize} height={iconSize} />
          </div>
          <span className='icon-button__label'>{label}</span>
        </>,
      )}
    </button>
  )
}
IconButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  Icon: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  tooltipRender: PropTypes.func,
  className: PropTypes.string,
  'data-testid': PropTypes.string,
}
