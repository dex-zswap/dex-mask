import React, { useMemo } from 'react'

const LongLetter = ({ text, length, prefix, subfix }) => {
  const subBlank = useMemo(() => subfix ? '  ' : '', [subfix])
  const preBlank = useMemo(() => prefix ? '  ' : '', [prefix])

  const displayText = useMemo(
    () => [prefix ?? '', preBlank, text, subBlank, subfix ?? ''].join(''),
    [text, prefix, subfix],
  )

  if (length >= text.length) {
    return displayText
  }

  return (
    <span title={displayText}>
      {[prefix ?? '', preBlank, text.substring(0, length), '...', preBlank , subfix ?? ''].join('')}
    </span>
  )
}

export default LongLetter
