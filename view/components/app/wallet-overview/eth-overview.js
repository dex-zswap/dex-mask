import IconButton from '@c/ui/icon-button';
import Identicon from '@c/ui/identicon';
import BuyIcon from '@c/ui/overview-icons/buy';
import SendIcon from '@c/ui/overview-icons/recive';
import SwapIcon from '@c/ui/overview-icons/swap';
import { getNativeCurrency } from '@reducer/dexmask/dexmask';
import {
  getCurrentChainId,
  getCurrentKeyring,
  getIsMainnet,
  getIsSwapsChain,
  getIsTestnet,
  getNativeCurrencyImage,
  getSelectedAccount,
  getShouldShowFiat,
  getSwapsDefaultToken,
  isBalanceCached,
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
import { updateCrossChainState } from '@view/store/actions';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
import React, { useContext, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath, useHistory } from 'react-router-dom';
import WalletOverview from './wallet-overview';

const EthOverview = ({ className }) => {
  const dispatch = useDispatch();
  const t = useContext(I18nContext);
  const history = useHistory();
  const keyring = useSelector(getCurrentKeyring);
  const usingHardwareWallet = keyring.type.search('Hardware') !== -1;
  const balanceIsCached = useSelector(isBalanceCached);
  const showFiat = useSelector(getShouldShowFiat);
  const selectedAccount = useSelector(getSelectedAccount);
  const { balance } = selectedAccount;
  const isMainnetChain = useSelector(getIsMainnet);
  const isTestnetChain = useSelector(getIsTestnet);
  const isSwapsChain = useSelector(getIsSwapsChain);
  const primaryTokenImage = useSelector(getNativeCurrencyImage);
  const nativeCurrency = useSelector(getNativeCurrency);
  const chainId = useSelector(getCurrentChainId);

  const defaultSwapsToken = useSelector(getSwapsDefaultToken);

  return (
    <WalletOverview
      balance={null}
      buttons={
        <>
          <IconButton
            className="eth-overview__button"
            Icon={BuyIcon}
            iconSize={40}
            label={t('send')}
            onClick={() => {
              history.push(SEND_ROUTE);
            }}
          />
          <IconButton
            className="eth-overview__button"
            Icon={SendIcon}
            iconSize={40}
            label={t('buy')}
            onClick={() => {
              history.push(
                generatePath(RECIVE_TOKEN_ROUTE, {
                  address: ethers.constants.AddressZero,
                }),
              );
            }}
          />
          {/* <IconButton
            className="eth-overview__button"
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
      icon={<Identicon diameter={32} image={primaryTokenImage} imageBorder />}
    />
  );
};

EthOverview.propTypes = {
  className: PropTypes.string,
};

EthOverview.defaultProps = {
  className: undefined,
};

export default EthOverview;
