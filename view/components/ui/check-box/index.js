import React, { useLayoutEffect, useRef } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
const CHECKBOX_STATE = {
  CHECKED: 'CHECKED',
  INDETERMINATE: 'INDETERMINATE',
  UNCHECKED: 'UNCHECKED',
}
export const { CHECKED, INDETERMINATE, UNCHECKED } = CHECKBOX_STATE

const CheckBox = ({ className, disabled, id, onClick, checked, title }) => {
  if (typeof checked === 'boolean') {
    checked = checked ? CHECKBOX_STATE.CHECKED : CHECKBOX_STATE.UNCHECKED
  }

  const ref = useRef(null)
  useLayoutEffect(() => {
    ref.current.indeterminate = checked === CHECKBOX_STATE.INDETERMINATE
  }, [checked])
  return (
    <input
      checked={checked === CHECKBOX_STATE.CHECKED}
      className={classnames('check-box', className, {
        'check-box__checked': checked === CHECKBOX_STATE.CHECKED,
        'check-box__indeterminate': checked === CHECKBOX_STATE.INDETERMINATE,
      })}
      disabled={disabled}
      id={id}
      onClick={
        onClick
          ? (event) => {
              event.preventDefault()
              onClick()
            }
          : null
      }
      readOnly
      ref={ref}
      title={title}
      type='checkbox'
    />
  )
}

export default CheckBox
