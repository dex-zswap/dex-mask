import { I18nContext } from '@view/contexts/i18n';
import React, { useContext } from 'react';

export default function InfoTab() {
  const t = useContext(I18nContext);

  return (
    <div className="base-width">
      <div className="setting-item">
        <div className="setting-label">{global.platform.getVersion()}</div>
        <div className="setting-value">{t('builtAroundTheWorld')}</div>
      </div>
    </div>
  );
}
