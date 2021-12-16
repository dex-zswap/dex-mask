import React from 'react';

const Switch = ({ value, onChange }) => {
  return (
    <div className="switch-wrap" onClick={onChange}>
      <div className={value ? 'active-switch' : ''}></div>
    </div>
  );
};

export default Switch;
