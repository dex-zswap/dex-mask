import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@c/ui/button';
import Switch from '@c/ui/switch';
import { I18nContext } from '@view/contexts/i18n';
import { REVEAL_SEED_ROUTE } from '@view/helpers/constants/routes';
import { setFeatureFlag, setUsePhishDetect } from '@view/store/actions';
export default function SecurityTab() {
  const t = useContext(I18nContext);
  const history = useHistory();
  const dispatch = useDispatch();
  const { warning } = useSelector((state) => state.appState);
  const metamask = useSelector((state) => state.metamask);
  const {
    featureFlags: { showIncomingTransactions } = {},
    usePhishDetect,
  } = metamask;
  return (
    <div className="base-width">
      {warning && <div className="settings-tab__error">{warning}</div>}
      <div className="setting-item">
        <div className="setting-label">{t('revealSeedWords')}</div>
        <Button
          type="primary"
          onClick={(event) => {
            event.preventDefault();
            history.push(REVEAL_SEED_ROUTE);
          }}
        >
          {t('revealSeedWords')}
        </Button>
      </div>
      <div className="setting-item">
        <div className="setting-label">{t('showIncomingTransactions')}</div>
        <div className="setting-value">
          {t('showIncomingTransactionsDescription')}
        </div>
        <Switch
          value={showIncomingTransactions}
          onChange={() =>
            dispatch(
              setFeatureFlag(
                'showIncomingTransactions',
                !showIncomingTransactions,
              ),
            )
          }
        />
      </div>
      <div className="setting-item">
        <div className="setting-label">{t('usePhishingDetection')}</div>
        <div className="setting-value">
          {t('usePhishingDetectionDescription')}
        </div>
        <Switch
          value={usePhishDetect}
          onChange={() => dispatch(setUsePhishDetect(!usePhishDetect))}
        />
      </div>
    </div>
  );
}
