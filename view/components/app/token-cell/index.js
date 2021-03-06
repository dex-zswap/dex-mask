import AssetListItem from '@c/app/asset-list-item';
import LongLetter from '@c/ui/long-letter';
import { useI18nContext } from '@view/hooks/useI18nContext';
import { useTokenFiatAmount } from '@view/hooks/useTokenFiatAmount';
import { getSelectedAddress } from '@view/selectors';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

export default function TokenCell({
  address,
  decimals,
  balanceError,
  symbol,
  string,
  image,
  onClick,
  isERC721,
}) {
  const userAddress = useSelector(getSelectedAddress);
  const t = useI18nContext();

  const formattedFiat = useTokenFiatAmount(address, string, symbol, {
    showFiat: true,
  });

  const warning = balanceError ? (
    <span>
      {t('troubleTokenBalances')}
      <a
        href={`https://ethplorer.io/address/${userAddress}`}
        rel="noopener noreferrer"
        target="_blank"
        onClick={(event) => event.stopPropagation()}
        style={{ color: '#F7861C' }}
      >
        {t('here')}
      </a>
    </span>
  ) : null;

  return (
    <AssetListItem
      className={classnames('token-cell', {
        'token-cell--outdated': Boolean(balanceError),
      })}
      hideSuffixSymbol={true}
      iconClassName="token-cell__icon"
      onClick={onClick.bind(null, address)}
      tokenAddress={address}
      tokenImage={image}
      tokenSymbol={symbol}
      tokenDecimals={decimals}
      primary={
        <div className="asset-list-item__token-detail">
          <div
            className="asset-list-item__token-amount"
            title={`${string || '0'}${symbol}`}
          >
            <LongLetter text={string || '0'} length={10} />
            &nbsp;&nbsp;
            {symbol}
          </div>
          {formattedFiat && (
            <div className="asset-list-item__token-usd">{formattedFiat}</div>
          )}
        </div>
      }
      isERC721={isERC721}
    />
  );
}

TokenCell.propTypes = {
  address: PropTypes.string,
  balanceError: PropTypes.object,
  symbol: PropTypes.string,
  decimals: PropTypes.number,
  string: PropTypes.string,
  image: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  isERC721: PropTypes.bool,
};

TokenCell.defaultProps = {
  balanceError: null,
};
