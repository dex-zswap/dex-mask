import { getPlatform } from '@app/scripts/lib/util';
import Button from '@c/ui/button';
import Switch from '@c/ui/switch';
import TextField from '@c/ui/text-field';
import { PLATFORM_FIREFOX } from '@shared/constants/app';
import { exportAsFile } from '@view/helpers/utils';
import { useI18nContext } from '@view/hooks/useI18nContext';
import { getPreferences } from '@view/selectors';
import {
  displayWarning,
  setAutoLockTimeLimit,
  setDismissSeedBackUpReminder,
  setFeatureFlag,
  setIpfsGateway,
  setLedgerLivePreference,
  setShowFiatConversionOnTestnetsPreference,
  setThreeBoxSyncingPermission,
  setUseNonceField,
  showModal,
  turnThreeBoxSyncingOnAndInitialize,
} from '@view/store/actions';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

function addUrlProtocolPrefix(urlString) {
  if (!urlString.match(/(^http:\/\/)|(^https:\/\/)/u)) {
    return `https://${urlString}`;
  }

  return urlString;
}

let ipfsGatewayError = '';
export default function AdvancedTab({ lockTimeError }) {
  const t = useI18nContext();
  const dispatch = useDispatch();
  const { warning } = useSelector((state) => state.appState);
  const {
    featureFlags: { sendHexData, advancedInlineGas } = {},
    threeBoxSyncingAllowed,
    threeBoxDisabled,
    useNonceField,
    ipfsGateway,
    useLedgerLive,
    dismissSeedBackUpReminder,
  } = useSelector((state) => state.metamask);
  const { showFiatInTestnets, autoLockTimeLimit } = useSelector(getPreferences);
  let allowed = threeBoxSyncingAllowed;
  let description = t('syncWithThreeBoxDescription');

  if (threeBoxDisabled) {
    allowed = false;
    description = t('syncWithThreeBoxDisabled');
  }

  const handleIpfsGatewayChange = (url) => {
    try {
      const urlObj = new URL(addUrlProtocolPrefix(url));

      if (!urlObj.host) {
        throw new Error();
      } // don't allow the use of this gateway

      if (urlObj.host === 'gateway.ipfs.io') {
        throw new Error('Forbidden gateway');
      }

      setIpfsGateway(url);
    } catch (error) {
      ipfsGatewayError =
        error.message === 'Forbidden gateway'
          ? t('forbiddenIpfsGateway')
          : t('invalidIpfsGateway');
    }
  };

  return (
    <div className="setting-advanced-wrap base-width">
      {warning && <div className="settings-tab__error">{warning}</div>}
      <div className="setting-item">
        <div className="setting-label">{t('stateLogs')}</div>
        <div className="setting-value">{t('stateLogsDescription')}</div>
        <Button
          type="primary"
          onClick={() => {
            window.logStateString((err, result) => {
              if (err) {
                dispatch(displayWarning(t('stateLogError')));
              } else {
                exportAsFile(`${t('stateLogFileName')}.json`, result);
              }
            });
          }}
        >
          {t('downloadStateLogs')}
        </Button>
      </div>
      <div className="setting-item">
        <div className="setting-label">{t('resetAccount')}</div>
        <div className="setting-value">{t('resetAccountDescription')}</div>
        <Button
          type="warning"
          onClick={(event) => {
            event.preventDefault();
            dispatch(
              showModal({
                name: 'CONFIRM_RESET_ACCOUNT',
              }),
            );
          }}
        >
          {t('resetAccount')}
        </Button>
      </div>
      <div className="setting-item">
        <div className="setting-label">{t('showAdvancedGasInline')}</div>
        <div className="setting-value">
          {t('showAdvancedGasInlineDescription')}
        </div>
        <Switch
          value={advancedInlineGas}
          onChange={() =>
            dispatch(setFeatureFlag('advancedInlineGas', !advancedInlineGas))
          }
        />
      </div>
      <div className="setting-item">
        <div className="setting-label">{t('showHexData')}</div>
        <div className="setting-value">{t('showHexDataDescription')}</div>
        <Switch
          value={sendHexData}
          onChange={() => dispatch(setFeatureFlag('sendHexData', !sendHexData))}
        />
      </div>
      <div className="setting-item">
        <div className="setting-label">{t('showFiatConversionInTestnets')}</div>
        <div className="setting-value">
          {t('showFiatConversionInTestnetsDescription')}
        </div>
        <Switch
          value={showFiatInTestnets}
          onChange={() =>
            dispatch(
              setShowFiatConversionOnTestnetsPreference(!showFiatInTestnets),
            )
          }
        />
      </div>
      <div className="setting-item">
        <div className="setting-label">{t('nonceField')}</div>
        <div className="setting-value">{t('nonceFieldDescription')}</div>
        <Switch
          value={useNonceField}
          onChange={() => dispatch(setUseNonceField(!useNonceField))}
        />
      </div>
      <div className="setting-item">
        <div className="setting-label">{t('autoLockTimeLimit')}</div>
        <div className="setting-value">{t('autoLockTimeLimitDescription')}</div>
        <div className="setting-input-btn-wrap">
          <TextField
            type="number"
            id="autoTimeout"
            placeholder="5"
            value={autoLockTimeLimit}
            defaultValue={autoLockTimeLimit}
            onChange={(e) => handleLockChange(e.target.value)}
            error={lockTimeError}
            fullWidth
            margin="dense"
            min={0}
          />
          <Button
            type="primary"
            className="settings-tab__rpc-save-button"
            disabled={lockTimeError !== ''}
            onClick={() => dispatch(setAutoLockTimeLimit(autoLockTimeLimit))}
          >
            {t('save')}
          </Button>
        </div>
      </div>
      <div className="setting-item">
        <div className="setting-label">{t('syncWithThreeBox')}</div>
        <div className="setting-value">
          {threeBoxDisabled
            ? t('syncWithThreeBoxDisabled')
            : t('syncWithThreeBoxDescription')}
        </div>
        <Switch
          value={allowed}
          onChange={() => {
            if (!threeBoxDisabled) {
              if (!allowed) {
                dispatch(turnThreeBoxSyncingOnAndInitialize());
              } else {
                dispatch(setThreeBoxSyncingPermission(!allowed));
              }
            }
          }}
        />
      </div>
      <div className="setting-item">
        <div className="setting-label">{t('ipfsGateway')}</div>
        <div className="setting-value">{t('ipfsGatewayDescription')}</div>
        <div className="setting-input-btn-wrap">
          <TextField
            type="text"
            value={ipfsGateway}
            onChange={(e) => handleIpfsGatewayChange(e.target.value)}
            error={ipfsGatewayError}
            fullWidth
            margin="dense"
          />
          <Button
            type="primary"
            className="settings-tab__rpc-save-button"
            disabled={Boolean(ipfsGatewayError)}
            onClick={() => {
              const { host } = new URL(addUrlProtocolPrefix(ipfsGateway));
              dispatch(setIpfsGateway(host));
            }}
          >
            {t('save')}
          </Button>
        </div>
      </div>
      <div className="setting-item">
        <div className="setting-label">{t('ledgerLiveAdvancedSetting')}</div>
        <div className="setting-value">
          {t('ledgerLiveAdvancedSettingDescription')}
        </div>
        <Switch
          value={useLedgerLive}
          onChange={() => dispatch(setLedgerLivePreference(!useLedgerLive))}
          disabled={getPlatform() === PLATFORM_FIREFOX}
        />
      </div>
      <div className="setting-item">
        <div className="setting-label">{t('dismissReminderField')}</div>
        <div className="setting-value">
          {t('dismissReminderDescriptionField')}
        </div>
        <Switch
          value={dismissSeedBackUpReminder}
          onChange={() =>
            dispatch(setDismissSeedBackUpReminder(!dismissSeedBackUpReminder))
          }
        />
      </div>
    </div>
  );
}
