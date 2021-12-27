import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { COLORS } from '@view/helpers/constants/design-system'
import Chip from '.'
export function ChipWithInput({
  className,
  borderColor = COLORS.UI1,
  inputValue,
  setInputValue,
}) {
  return (
    <Chip
      className={classnames(className, 'chip--with-input')}
      borderColor={borderColor}
    >
      {setInputValue && (
        <input
          type='text'
          className='chip__input'
          onChange={(e) => {
            setInputValue(e.target.value)
          }}
          value={inputValue}
        />
      )}
    </Chip>
  )
}
ChipWithInput.propTypes = {
  borderColor: PropTypes.oneOf(Object.values(COLORS)),
  className: PropTypes.string,
  inputValue: PropTypes.string,
  setInputValue: PropTypes.func,
}
