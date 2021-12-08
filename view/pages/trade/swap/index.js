import Button from '@c/ui/button';
import { useI18nContext } from '@view/hooks/useI18nContext';
import React, { useCallback } from 'react';

export default function Swap() {
  const t = useI18nContext();

  const toPage = useCallback(() => {
    global.platform.openTab({
      url: 'http://103.43.11.66:9999/swap',
    });
  }, []);

  return (
    <div className="trade-swap__wrapper">
      <p className="trade-swap__text">{t('toSwap')}</p>
      <Button type="primary" onClick={toPage} rightArrow>
        {t('goOpen')}
      </Button>
    </div>
  );
}
