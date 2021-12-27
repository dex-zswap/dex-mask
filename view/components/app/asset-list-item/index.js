import React, { useMemo } from 'react'
import classnames from 'classnames'
import { ethers } from 'ethers'
import TokenImage from '@c/ui/token-image'

const AssetListItem = ({
  className,
  onClick,
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  tokenImage,
  primary,
  secondary,
}) => {
  const isNativeAsset = !tokenAddress
  return (
    <div
      className={classnames(
        'asset-list-item',
        `asset-${tokenAddress ?? 'native'}`,
        className,
      )}
      onClick={onClick}
    >
      <div className='symbol-image'>
        <TokenImage
          symbol={tokenSymbol}
          size={32}
          address={isNativeAsset ? ethers.constants.AddressZero : tokenAddress}
        />
        <p className='token-symbol'>{tokenSymbol}</p>
      </div>
      <div className='token-balance'>
        <div className='balance'>{primary}</div>
      </div>
    </div>
  )
}

export default AssetListItem
