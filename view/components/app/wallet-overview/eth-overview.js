import React, { useContext, useMemo } from 'react';
import { generatePath, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { getNativeCurrency } from '@reducer/dexmask/dexmask';
import { getCurrentChainId, getCurrentKeyring, getIsMainnet, getIsSwapsChain, getIsTestnet, getNativeCurrencyImage, getSelectedAccount, getShouldShowFiat, getSwapsDefaultToken, isBalanceCached } from '@selectors/selectors';
import { I18nContext } from '@view/contexts/i18n';
import { CROSSCHAIN_ROUTE, RECIVE_TOKEN_ROUTE, SEND_ROUTE, TRADE_ROUTE } from '@view/helpers/constants/routes';
import { checkTokenBridge } from '@view/helpers/cross-chain-api';
import { toBnString, toHexString } from '@view/helpers/utils/conversions.util';
import { useFetch } from '@view/hooks/useFetch';
import { updateCrossChainState } from '@view/store/actions';
import WalletOverview from './wallet-overview';

const EthOverview = ({
  className
}) => {
  const dispatch = useDispatch();
  const t = useContext(I18nContext);
  const history = useHistory();
  const selectedAccount = useSelector(getSelectedAccount);
  const chainId = useSelector(getCurrentChainId);
  const nativeCurrency = useSelector(getNativeCurrency);
  const defaultSwapsToken = useSelector(getSwapsDefaultToken);
  const {
    loading,
    error,
    res
  } = useFetch(() => checkTokenBridge({
    meta_chain_id: toBnString(chainId),
    token_address: ethers.constants.AddressZero
  }), [chainId]);
  const supportCrossChain = useMemo(() => {
    if (loading || error || res?.c !== 200) {
      return false;
    }

    return res?.d?.length;
  }, [loading, error, res]);
  const defaultTargetChain = useMemo(() => supportCrossChain ? res.d[0] : null, [supportCrossChain, res]);
  const overViewButtons = useMemo(() => {
    const buttons = [{
      key: 'send',
      iconClass: 'send-icon',
      label: t('send'),
      onClick: () => history.push(SEND_ROUTE)
    }, {
      key: 'recive',
      iconClass: 'recive-icon',
      label: t('buy'),
      onClick: () => history.push(generatePath(RECIVE_TOKEN_ROUTE, {
        address: ethers.constants.AddressZero
      }))
    }, {
      key: 'swap',
      iconClass: 'swap-icon',
      label: t('swap'),
      onClick: () => history.push(TRADE_ROUTE)
    }];

    if (supportCrossChain) {
      buttons.push({
        key: 'cross-chain',
        iconClass: 'cross-chain-icon',
        label: t('crossChain'),
        onClick: () => {
          const destChain = toHexString(defaultTargetChain.target_meta_chain_id);
          dispatch(updateCrossChainState({
            coinAddress: ethers.constants.AddressZero,
            targetCoinAddress: defaultTargetChain.target_token_address,
            coinSymbol: nativeCurrency,
            targetCoinSymbol: defaultTargetChain.target_token,
            from: selectedAccount.address,
            fromChain: chainId,
            target: defaultTargetChain,
            destChain,
            supportChains: [],
            chainTokens: []
          }));
          history.push(CROSSCHAIN_ROUTE);
        }
      });
    }

    return buttons;
  }, [dispatch, updateCrossChainState, nativeCurrency, supportCrossChain, defaultTargetChain, t, history]);
  return <WalletOverview buttons={overViewButtons} />;
};

export default EthOverview;