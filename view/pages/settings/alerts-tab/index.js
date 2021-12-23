import React from 'react';
import { useSelector } from 'react-redux';
import Switch from '@c/ui/switch';
import Tooltip from '@c/ui/tooltip';
import { getAlertEnabledness } from '@reducer/dexmask/dexmask';
import { ALERT_TYPES } from '@shared/constants/alerts';
import { useI18nContext } from '@view/hooks/useI18nContext';
import { setAlertEnabledness } from '@view/store/actions';

const AlertSettingsEntry = ({ alertId, description, title }) => {
  const isEnabled = useSelector((state) => getAlertEnabledness(state)[alertId]);
  return (
    <div className="setting-item">
      <div className="setting-label">
        <span>{title}</span>
        <Tooltip position="top" title={description}>
          <div>
            <img
              style={{
                margin: '3px 0 0 10px',
              }}
              width="12px"
              src="images/settings/info.png"
            />
          </div>
        </Tooltip>
      </div>
      <Switch
        value={isEnabled}
        onChange={() => setAlertEnabledness(alertId, !isEnabled)}
      />
    </div>
  );
};

export default function AlertsTab() {
  const t = useI18nContext();
  const alertConfig = {
    [ALERT_TYPES.unconnectedAccount]: {
      title: t('alertSettingsUnconnectedAccount'),
      description: t('alertSettingsUnconnectedAccountDescription'),
    },
    [ALERT_TYPES.web3ShimUsage]: {
      title: t('alertSettingsWeb3ShimUsage'),
      description: t('alertSettingsWeb3ShimUsageDescription'),
    },
  };
  return (
    <div className="base-width">
      {Object.entries(alertConfig).map(([alertId, { title, description }]) => (
        <AlertSettingsEntry
          alertId={alertId}
          description={description}
          key={alertId}
          title={title}
        />
      ))}
    </div>
  );
}
