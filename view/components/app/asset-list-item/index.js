import Button from '@c/ui/button';
import InfoIcon from '@c/ui/icon/info-icon.component';
import ListItem from '@c/ui/list-item';
import TokenImage from '@c/ui/token-image';
import Tooltip from '@c/ui/tooltip';
import { ASSET_TYPES, updateSendAsset } from '@reducer/send';
import { SEVERITIES } from '@view/helpers/constants/design-system';
import { SEND_ROUTE } from '@view/helpers/constants/routes';
import { useI18nContext } from '@view/hooks/useI18nContext';
import classnames from 'classnames';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

const AssetListItem = ({
  className,
  'data-testid': dataTestId,
  iconClassName,
  onClick,
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  tokenImage,
  warning,
  primary,
  secondary,
  identiconBorder,
  hideSuffixSymbol,
  isERC721,
}) => {
  const t = useI18nContext();
  const dispatch = useDispatch();
  const history = useHistory();
  const isNativeAsset = !tokenAddress;
  const titleIcon = warning ? (
    <Tooltip
      wrapperClassName="asset-list-item__warning-tooltip"
      interactive
      position="bottom"
      html={warning}
    >
      <InfoIcon severity={SEVERITIES.WARNING} />
    </Tooltip>
  ) : null;

  const midContent = warning ? (
    <>
      <InfoIcon severity={SEVERITIES.WARNING} />
      <div className="asset-list-item__warning">{warning}</div>
    </>
  ) : null;

  const sendTokenButton = useMemo(() => {
    if (tokenAddress === null || tokenAddress === undefined) {
      return null;
    }
    return (
      <Button
        type="link"
        className="asset-list-item__send-token-button"
        onClick={(e) => {
          e.stopPropagation();
          dispatch(
            updateSendAsset({
              type: ASSET_TYPES.TOKEN,
              details: {
                address: tokenAddress,
                decimals: tokenDecimals,
                symbol: tokenSymbol,
              },
            }),
          ).then(() => {
            history.push(SEND_ROUTE);
          });
        }}
      >
        {t('sendSpecifiedTokens', [tokenSymbol])}
      </Button>
    );
  }, [tokenSymbol, tokenAddress, tokenDecimals, history, t, dispatch]);

  return (
    <ListItem
      className={classnames('asset-list-item', className)}
      data-testid={dataTestId}
      title={
        <button className="asset-list-item__token-button" onClick={onClick}>
          <h2>
            <span className="asset-list-item__token-value">{primary}</span>
            {!hideSuffixSymbol && (
              <span className="asset-list-item__token-symbol">
                {tokenSymbol}
              </span>
            )}
          </h2>
        </button>
      }
      titleIcon={titleIcon}
      subtitle={secondary ? <h3 title={secondary}>{secondary}</h3> : null}
      onClick={onClick}
      icon={
        <div className="asset-list-item__icon-wrapper">
          {/* <Identicon
            className={iconClassName}
            diameter={42}
            address={tokenAddress}
            image={tokenImage}
            alt={`${primary} ${tokenSymbol}`}
            imageBorder={identiconBorder}
          /> */}
          <TokenImage
            symbol={tokenSymbol}
            size={36}
            address={
              isNativeAsset ? ethers.constants.AddressZero : tokenAddress
            }
          />
          <span className="asset-list-item__icon-symbol">{tokenSymbol}</span>
        </div>
      }
      midContent={midContent}
    />
  );
};

AssetListItem.propTypes = {
  className: PropTypes.string,
  'data-testid': PropTypes.string,
  iconClassName: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  tokenAddress: PropTypes.string,
  tokenSymbol: PropTypes.string,
  tokenDecimals: PropTypes.number,
  tokenImage: PropTypes.string,
  warning: PropTypes.node,
  primary: PropTypes.any,
  secondary: PropTypes.string,
  identiconBorder: PropTypes.bool,
  isERC721: PropTypes.bool,
};

AssetListItem.defaultProps = {
  className: undefined,
  'data-testid': undefined,
  iconClassName: undefined,
  tokenAddress: undefined,
  tokenImage: undefined,
  warning: undefined,
};

export default AssetListItem;
