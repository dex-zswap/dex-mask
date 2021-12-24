import React from 'react'
import classnames from 'classnames'

const Switch = ({ value, onChange, disabled }) => {
  return (
    <div
      className={classnames([
        'switch-wrap',
        value ? 'active-switch' : '',
        disabled ? 'disabled-switch' : '',
      ])}
      onClick={() => {
        if (disabled) return
        onChange()
      }}
    ></div>
  )
}

export default Switch
