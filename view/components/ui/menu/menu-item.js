import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

const MenuItem = ({
  children,
  className,
  'data-testid': dataTestId,
  iconClassName,
  onClick,
  subtitle,
  wrapChildAsDiv,
}) => (
  <button
    className={classnames('menu-item', className)}
    data-testid={dataTestId}
    onClick={onClick}
  >
    {iconClassName ? (
      <i className={classnames('menu-item__icon', iconClassName)} />
    ) : null}
    {wrapChildAsDiv ? (
      <div className='menu-item-children-wrapper'>{children}</div>
    ) : (
      <span>{children}</span>
    )}
    {subtitle}
  </button>
)

MenuItem.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  'data-testid': PropTypes.string,
  iconClassName: PropTypes.string,
  onClick: PropTypes.func,
  subtitle: PropTypes.node,
}
MenuItem.defaultProps = {
  className: undefined,
  'data-testid': undefined,
  iconClassName: undefined,
  onClick: undefined,
  subtitle: undefined,
}
export default MenuItem
