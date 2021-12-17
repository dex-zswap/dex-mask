import classnames from 'classnames';
import React from 'react';

const Switch = ({ value, onChange, disabled }) => {
  return (
    <div
      className={classnames([
        'switch-wrap',
        value ? 'active-switch' : '',
        disabled ? 'disabled-switch' : '',
      ])}
      onClick={() => {
        if (disabled) return;
        onChange();
      }}
    ></div>
  );
};

export default Switch;
