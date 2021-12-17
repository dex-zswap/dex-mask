import React from 'react';
import TopHeader from '@c/ui/top-header';
import ChainSwitcher from '@c/app/chain-switcher';
import SelectedNativeToken from '@c/app/selected-token/native';
import TransactionList from '@c/app/transaction/list';
import { EthOverview } from '@c/app/wallet-overview';
import BackBar from '@c/ui/back-bar';
import { useI18nContext } from '@view/hooks/useI18nContext';
export default function NativeAsset({ nativeCurrency }) {
  const t = useI18nContext();
  return (
    <>
      <TopHeader />
      <BackBar title={t('yourAsset', [nativeCurrency])} />
      <ChainSwitcher />
      <SelectedNativeToken />
      <EthOverview className="asset__overview" />
      <TransactionList hideTokenTransactions />
    </>
  );
}
