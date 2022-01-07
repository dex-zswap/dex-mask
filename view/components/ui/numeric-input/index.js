import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import TextField from '@c/ui/text-field'
import Typography from '@c/ui/typography'
import { COLORS, TYPOGRAPHY } from '@view/helpers/constants/design-system'
export default function NumericInput({
  detailText = '',
  value = 0,
  onChange,
  error = '',
  autoFocus = false,
  allowDecimals = true,
  disabled = false,
}) {
  return (
    <div
      className={classNames({
        'numeric-input--error': error,
      })}
    >
      <TextField
        type='number'
        value={value}
        onKeyDown={(e) => {
          if (!allowDecimals && e.key === '.') {
            e.preventDefault()
          }
        }}
        onChange={(e) => {
          onChange?.(parseFloat(e.target.value || 0, 10))
        }}
        min='0'
        autoFocus={autoFocus}
        disabled={disabled}
      ></TextField>
      {detailText && (
        <Typography color={COLORS.UI4} variant={TYPOGRAPHY.H7} tag='span'>
          {detailText}
        </Typography>
      )}
    </div>
  )
}
NumericInput.propTypes = {
  value: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
  detailText: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  autoFocus: PropTypes.bool,
  allowDecimals: PropTypes.bool,
  disabled: PropTypes.bool,
}
