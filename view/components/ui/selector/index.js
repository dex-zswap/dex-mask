import React, { useState, useCallback, useMemo } from 'react';

import classnames from 'classnames';

export default function Selector({ options, onSelect, selectedValue, small }) {
  const [ show, setShow ] = useState(false);
  const toggleShow = useCallback(() => setShow(show => !show), []);
  const onChange = useCallback((value) => {
    toggleShow();
    onSelect(value);
  }, [onSelect]);

  const selectedLabel = useMemo(() => options.find(({ value }) => value === selectedValue)?.label || '', [options, selectedValue]);

  return (
    <div className={classnames(['selector-component', small && 'small', show ? 'menu-opened' : 'menu-hidden'])}>
      <div className="current-label" onClick={toggleShow}>{selectedLabel}</div>
      {
        show && 
        (
          <div className="selector-menu">
            {
              options.map(({ label, value }) => (
                <div className={classnames(['select-option'])} onClick={() => onChange(value)} key={value}>{label}</div>
              ))
            }
          </div>
        )
      }
    </div>
  );
}
