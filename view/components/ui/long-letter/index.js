import React, { useMemo } from 'react'

const LongLetter = ({ text, length, prefix, subfix }) => {
  const displayText = useMemo(
    () => [prefix ?? '', text, subfix ?? ''].join(''),
    [text, prefix, subfix],
  )

  if (length >= text.length) {
    return displayText
  }

  return (
    <span title={displayText}>
      {[prefix ?? '', text.substring(0, length), '...', subfix ?? ''].join('')}
    </span>
  )
}

export default LongLetter
