import classnames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';

export default function Selector({
  options,
  onSelect,
  selectedValue,
  labelRender,
  itemRender,
  className,
  small,
}) {
  const [show, setShow] = useState(false);
  const toggleShow = useCallback(() => setShow((show) => !show), []);
  const onChange = useCallback(
    (value, detail) => {
      toggleShow();
      onSelect(value, detail);
    },
    [onSelect],
  );

  const selectedItem = useMemo(
    () => options.find(({ value }) => value === selectedValue),
    [options, selectedValue],
  );
  const selectedLabel = useMemo(
    () => options.find(({ value }) => value === selectedValue)?.label || '',
    [options, selectedValue],
  );

  return (
    <div
      className={classnames([
        'selector-component',
        small && 'small',
        show ? 'menu-opened' : 'menu-hidden',
        className,
      ])}
    >
      <div className="current-label" onClick={toggleShow}>
        {labelRender && selectedItem
          ? labelRender(selectedItem)
          : selectedLabel}
      </div>
      {show && (
        <>
          <div className="options-mask" onClick={() => setShow(false)}></div>
          <div className="selector-menu">
            {options.map(({ label, value }, index) => (
              <div
                className={classnames([
                  'select-option',
                  selectedValue === value ? 'select-option-active-color' : '',
                ])}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(value);
                }}
                key={value}
              >
                {itemRender ? itemRender(options[index]) : label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
