import React from 'react';
import TopHeader from '@c/ui/top-header';
import ChainSwitcher from '@c/app/chain-switcher';
import SelectedToken from '@c/app/selected-token/token';
import TransactionList from '@c/app/transaction/list';
import { TokenOverview } from '@c/app/wallet-overview';
import BackBar from '@c/ui/back-bar';
import { useI18nContext } from '@view/hooks/useI18nContext';
export default function TokenAsset({ token }) {
  const t = useI18nContext();
  return (
    <>
      <TopHeader />
      <BackBar title={t('yourAsset', [token.symbol])} />
      <ChainSwitcher />
      <SelectedToken token={token} />
      <TokenOverview className="asset__overview" token={token} />
      <TransactionList tokenAddress={token.address} />
    </>
  );
}
