import CurrencyDisplay from '@c/ui/currency-display';
import IconButton from '@c/ui/icon-button';
import Identicon from '@c/ui/identicon';
import BuyIcon from '@c/ui/overview-icons/buy';
import SendIcon from '@c/ui/overview-icons/recive';
import SwapIcon from '@c/ui/overview-icons/swap';
import { ASSET_TYPES, updateSendAsset } from '@reducer/send';
import {
  getAssetImages,
  getCurrentChainId,
  getCurrentKeyring,
  getIsSwapsChain,
  getSelectedAccount,
} from '@selectors/selectors';
import { I18nContext } from '@view/contexts/i18n';
import {
  CROSSCHAIN_ROUTE,
  RECIVE_TOKEN_ROUTE,
  SEND_ROUTE,
  TRADE_ROUTE,
} from '@view/helpers/constants/routes';
import { checkTokenBridge } from '@view/helpers/cross-chain-api';
import { toBnString } from '@view/helpers/utils/conversions.util';
import { useFetch } from '@view/hooks/useFetch';
import { useTokenFiatAmount } from '@view/hooks/useTokenFiatAmount';
import { useTokenTracker } from '@view/hooks/useTokenTracker';
import { updateCrossChainState } from '@view/store/actions';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
import React, { useContext, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath, useHistory } from 'react-router-dom';
import WalletOverview from './wallet-overview';

const TokenOverview = ({ className, token }) => {
  const dispatch = useDispatch();
  const t = useContext(I18nContext);
  const history = useHistory();
  const assetImages = useSelector(getAssetImages);

  const selectedAccount = useSelector(getSelectedAccount);

  const keyring = useSelector(getCurrentKeyring);
  const usingHardwareWallet = keyring.type.search('Hardware') !== -1;
  const { tokensWithBalances } = useTokenTracker([token]);
  const balanceToRender = tokensWithBalances[0]?.string;
  const balance = tokensWithBalances[0]?.balance;
  const formattedFiatBalance = useTokenFiatAmount(
    token.address,
    balanceToRender,
    token.symbol,
  );
  const isSwapsChain = useSelector(getIsSwapsChain);
  const chainId = useSelector(getCurrentChainId);

  return (
    <WalletOverview
      balance={
        <div className="token-overview__balance">
          <CurrencyDisplay
            className="token-overview__primary-balance"
            displayValue={balanceToRender}
            suffix={token.symbol}
          />
          {formattedFiatBalance ? (
            <CurrencyDisplay
              className="token-overview__secondary-balance"
              displayValue={formattedFiatBalance}
              hideLabel
            />
          ) : null}
        </div>
      }
      buttons={
        <>
          <IconButton
            className="token-overview__button"
            onClick={() => {
              dispatch(
                updateSendAsset({
                  type: ASSET_TYPES.TOKEN,
                  details: token,
                }),
              ).then(() => {
                history.push(SEND_ROUTE);
              });
            }}
            Icon={BuyIcon}
            iconSize={40}
            label={t('send')}
            data-testid="eth-overview-send"
            disabled={token.isERC721}
          />
          <IconButton
            className="eth-overview__button"
            Icon={SendIcon}
            iconSize={40}
            label={t('buy')}
            onClick={() => {
              history.push(
                generatePath(RECIVE_TOKEN_ROUTE, {
                  address: token.address,
                }),
              );
            }}
          />
          {/* <IconButton
            className="token-overview__button"
            Icon={SwapIcon}
            iconSize={40}
            onClick={() => {
              history.push(TRADE_ROUTE);
            }}
            label={t('swap')}
          /> */}
        </>
      }
      className={className}
      icon={
        <Identicon
          diameter={32}
          address={token.address}
          image={assetImages[token.address]}
        />
      }
    />
  );
};

TokenOverview.propTypes = {
  className: PropTypes.string,
  token: PropTypes.shape({
    address: PropTypes.string.isRequired,
    decimals: PropTypes.number,
    symbol: PropTypes.string,
    isERC721: PropTypes.bool,
  }).isRequired,
};

TokenOverview.defaultProps = {
  className: undefined,
};

export default TokenOverview;
