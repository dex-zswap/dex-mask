import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTokenTrackerLink } from '@metamask/etherscan-link';
import PropTypes from 'prop-types';
import TransactionList from '@c/app/transaction/list';
import { TokenOverview } from '@c/app/wallet-overview';
import {
  getCurrentChainId,
  getRpcPrefsForCurrentProvider,
  getSelectedIdentity,
} from '@selectors/selectors';
export default function TokenAsset({ token }) {
  const dispatch = useDispatch();
  const chainId = useSelector(getCurrentChainId);
  const rpcPrefs = useSelector(getRpcPrefsForCurrentProvider);
  const selectedIdentity = useSelector(getSelectedIdentity);
  const selectedAccountName = selectedIdentity.name;
  const selectedAddress = selectedIdentity.address;
  const history = useHistory();
  const tokenTrackerLink = getTokenTrackerLink(
    token.address,
    chainId,
    null,
    selectedAddress,
    rpcPrefs,
  );
  return (
    <>
      <TokenOverview className="asset__overview" token={token} />
      <TransactionList tokenAddress={token.address} />
    </>
  );
}
TokenAsset.propTypes = {
  token: PropTypes.shape({
    address: PropTypes.string.isRequired,
    decimals: PropTypes.number,
    symbol: PropTypes.string,
  }).isRequired,
};
