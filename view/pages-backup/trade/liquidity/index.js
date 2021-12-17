import React, { useCallback } from 'react';
import Button from '@c/ui/button';
import { useI18nContext } from '@view/hooks/useI18nContext';
export default function Liquidity() {
  const t = useI18nContext();
  const toPage = useCallback(() => {
    global.platform.openTab({
      url: 'http://103.43.11.66:9999/liquidity',
    });
  }, []);
  return (
    <div className="trade-liquidity__wrapper">
      <p className="trade-liquidity__text">{t('toLiquidity')}</p>
      <Button type="primary" onClick={toPage} rightArrow>
        {t('goOpen')}
      </Button>
    </div>
  );
}
