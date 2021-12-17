import React from 'react';
import CrossChainButton from './button';
import CrossChainDest from './dest';
import CrossChainSplitor from './splitor';
import CrossChainFrom from './from';
import { useI18nContext } from '@view/hooks/useI18nContext';
export default function CrossChain() {
  const t = useI18nContext();
  return (
    <div className="cross-chain-component__wrapper">
      <CrossChainFrom />
      <CrossChainSplitor />
      <CrossChainDest />
      <CrossChainButton />
    </div>
  );
}
