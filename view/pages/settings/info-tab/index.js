import { useI18nContext } from '@view/hooks/useI18nContext';
import React from 'react';

export default function InfoTab() {
  const t = useI18nContext();

  return (
    <div className="base-width">
      <div className="setting-item">
        <div className="setting-label">{global.platform.getVersion()}</div>
        <div className="setting-value">{t('builtAroundTheWorld')}</div>
      </div>
    </div>
  );
}
