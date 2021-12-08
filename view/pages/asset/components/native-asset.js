import TransactionList from '@c/app/transaction/list';
import { EthOverview } from '@c/app/wallet-overview';
import {
  createCustomAccountLink,
  getAccountLink,
} from '@metamask/etherscan-link';
import {
  getCurrentChainId,
  getRpcPrefsForCurrentProvider,
  getSelectedAddress,
  getSelectedIdentity,
} from '@selectors/selectors';
import { CHAINID_EXPLORE_MAP } from '@shared/constants/network';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Switchers from './switchers';
import TokenInfo from './token-info';

export default function NativeAsset({ nativeCurrency }) {
  const selectedAccountName = useSelector(
    (state) => getSelectedIdentity(state).name,
  );
  const dispatch = useDispatch();

  const chainId = useSelector(getCurrentChainId);
  const rpcPrefs = useSelector(getRpcPrefsForCurrentProvider);
  const address = useSelector(getSelectedAddress);
  const history = useHistory();
  let accountLink = getAccountLink(address, chainId, rpcPrefs);

  if (!accountLink && CHAINID_EXPLORE_MAP[chainId]) {
    accountLink = createCustomAccountLink(
      address,
      CHAINID_EXPLORE_MAP[chainId],
    );
  }

  return (
    <>
      <Switchers />
      <TokenInfo isNative={true} />
      <EthOverview className="asset__overview" />
      <TransactionList hideTokenTransactions />
    </>
  );
}

NativeAsset.propTypes = {
  nativeCurrency: PropTypes.string.isRequired,
};
