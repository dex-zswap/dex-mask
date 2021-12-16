import React, { useState, useCallback, useMemo } from 'react';

import classnames from 'classnames';

export default function Selector({ options, onSelect, selectedValue, labelRender, itemRender, className, small }) {
  const [ show, setShow ] = useState(false);
  const toggleShow = useCallback(() => setShow(show => !show), []);
  const onChange = useCallback((value, detail) => {
    toggleShow();
    onSelect(value, detail);
  }, [onSelect]);

  const selectedItem = useMemo(() => options.find(({ value }) => value === selectedValue), [options, selectedValue]);
  const selectedLabel = useMemo(() => selectedItem.label || '', [selectedItem]);

  return (
    <div className={classnames(['selector-component', small && 'small', show ? 'menu-opened' : 'menu-hidden', className])}>
      <div className="current-label" onClick={toggleShow}>
        {labelRender && selectedItem ? labelRender(selectedItem) : selectedLabel}
      </div>
      {
        show && 
        (
          <div className="selector-menu">
            {
              options.map(({ label, value }, index) => (
                <div className={classnames(['select-option'])} onClick={() => onChange(value, options[index])} key={value}>
                  {itemRender ? itemRender(options[index]) : label }
                </div>
              ))
            }
          </div>
        )
      }
    </div>
  );
}
