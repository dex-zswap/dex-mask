import React from 'react';

export default function Logo({ width, height }) {
  return (
    <>
      <img
        src="./images/dex/logo/logo.svg"
        width={width || 100}
        height={height || 100}
        alt=""
      />
    </>
  );
}
