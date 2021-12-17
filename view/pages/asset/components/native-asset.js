import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  createCustomAccountLink,
  getAccountLink,
} from '@metamask/etherscan-link';
import TransactionList from '@c/app/transaction/list';
import { EthOverview } from '@c/app/wallet-overview';
import {
  getCurrentChainId,
  getRpcPrefsForCurrentProvider,
  getSelectedAddress,
  getSelectedIdentity,
} from '@selectors/selectors';
import { CHAINID_EXPLORE_MAP } from '@shared/constants/network';
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
      <EthOverview className="asset__overview" />
      <TransactionList hideTokenTransactions />
    </>
  );
}
