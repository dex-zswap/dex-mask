import React from 'react';

const LongLetter = ({
  text,
  length
}) => {
  if (length >= text.length) {
    return text;
  }

  return [text.substring(0, length), '...'].join('');
};

export default LongLetter;