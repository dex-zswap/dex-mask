import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react'
import classnames from 'classnames'
export default function Selector({
  options,
  onSelect,
  selectedValue,
  labelRender,
  itemRender,
  className,
  footer,
  small,
  toTop
}) {
  const [show, setShow] = useState(false)
  const toggleShow = useCallback(() => setShow((show) => !show), [])
  const onChange = useCallback(
    (value, detail) => {
      toggleShow()
      onSelect(value, detail)
    },
    [onSelect],
  )
  const selectedItem = useMemo(
    () => options.find(({ value }) => value === selectedValue),
    [options, selectedValue],
  )
  const selectedLabel = useMemo(
    () => options.find(({ value }) => value === selectedValue)?.label || '',
    [options, selectedValue],
  )

  useEffect(() => {
    if (toTop) {
      const body = document.querySelector('body');
      if (show) {
        body.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
        body.classList.toggle('overflow-hidden')
      } else {
        if (body.classList.contains('overflow-hidden')) {
          body.classList.remove('overflow-hidden')
        }
      }
    }
  }, [toTop, show])

  return (
    <div
      className={classnames([
        'selector-component',
        small && 'small',
        show ? 'menu-opened' : 'menu-hidden',
        className,
      ])}
    >
      <div className='current-label' onClick={toggleShow}>
        {labelRender && selectedItem
          ? labelRender(selectedItem)
          : selectedLabel}
      </div>
      {show && (
        <>
          <div className='options-mask' onClick={() => setShow(false)}></div>
          <div className='selector-menu'>
            <div
              className={classnames(
                'select-menu-area',
                footer ? 'with-footer' : null,
              )}
            >
              {options.map(({ label, value }, index) => (
                <div
                  className={classnames([
                    'select-option',
                    selectedValue === value ? 'select-option-active-color' : '',
                  ])}
                  onClick={(e) => {
                    e.stopPropagation()
                    onChange(value, options[index])
                  }}
                  key={value}
                >
                  {itemRender ? itemRender(options[index]) : label}
                </div>
              ))}
            </div>
            {footer}
          </div>
        </>
      )}
    </div>
  )
}
