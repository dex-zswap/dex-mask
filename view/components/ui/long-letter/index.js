import React from 'react'

const LongLetter = ({ text, length, prefix, subfix }) => {
  if (length >= text.length) {
    return [prefix ?? '', text, subfix ?? ''].join('')
  }

  return <span title={text}>{[prefix ?? '', text.substring(0, length), '...', subfix ?? ''].join('')}</span>
}

export default LongLetter
