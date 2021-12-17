import React from 'react';

const Switch = ({ value, onChange }) => {
  return (
    <div
      className={value ? 'switch-wrap active-switch' : 'switch-wrap'}
      onClick={onChange}
    ></div>
  );
};

export default Switch;
