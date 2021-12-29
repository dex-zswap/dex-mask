import React from 'react'

const LongLetter = ({ text, length }) => {
  if (length >= text.length) {
    return text
  }

  return <span title={text}>{[text.substring(0, length), '...'].join('')}</span>
}

export default LongLetter
