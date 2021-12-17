import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const Tab = (props) => {
  const {
    activeClassName,
    className,
    'data-testid': dataTestId,
    isActive,
    name,
    onClick,
    tabIndex,
  } = props;
  return (
    <li
      className={classnames('tab', className, {
        'tab--active': isActive,
        [activeClassName]: activeClassName && isActive,
      })}
      data-testid={dataTestId}
      onClick={(event) => {
        event.preventDefault();
        onClick(tabIndex);
      }}
    >
      <button>{name}</button>
    </li>
  );
};

export default Tab;
