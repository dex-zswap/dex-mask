import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
export default function TransitionListItem({
  title,
  subtitle,
  onClick,
  children,
  titleIcon,
  icon,
  rightContent,
  midContent,
  className,
  'data-testid': dataTestId
}) {
  const primaryClassName = classnames('list-item', 'transition-list__row-item', className, subtitle || children ? '' : 'list-item--single-content-row');
  return <div className={primaryClassName} onClick={onClick} data-testid={dataTestId} role="button" tabIndex={0} onKeyPress={event => {
    if (event.key === 'Enter') {
      onClick();
    }
  }}>
      <div className="left-status">
        <div className="left-status__icon-wrapper">
          {icon && <div className="list-item__icon">{icon}</div>}
          <div className="headings">
            <div className="title">
              {React.isValidElement(title) ? title : <h2 className="list-item__title">{title}</h2>}
            </div>
            {subtitle && <div className="list-item__subheading">{subtitle}</div>}
          </div>
        </div>
      </div>
      {children && <div className="list-item__actions">{children}</div>}
      {midContent && <div className="list-item__mid-content">{midContent}</div>}
      {rightContent && <div className="list-item__right-content">{rightContent}</div>}
    </div>;
}
TransitionListItem.propTypes = {
  'title': PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  'titleIcon': PropTypes.node,
  'subtitle': PropTypes.node,
  'children': PropTypes.node,
  'icon': PropTypes.node,
  'rightContent': PropTypes.node,
  'midContent': PropTypes.node,
  'className': PropTypes.string,
  'onClick': PropTypes.func,
  'data-testid': PropTypes.string
};