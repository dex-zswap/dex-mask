import ConnectedAccountsList from '@c/app/connected/accounts-list';
import Button from '@c/ui/button';
import Checkbox from '@c/ui/check-box';
import Popover from '@c/ui/popover';
import Tooltip from '@c/ui/tooltip';
import { ALERT_STATE } from '@reducer/alerts';
import {
  connectAccount,
  dismissAlert,
  dismissAndDisableAlert,
  getAlertState,
  switchToAccount,
} from '@reducer/alerts/unconnected-account';
import { isExtensionUrl } from '@view/helpers/utils';
import { useI18nContext } from '@view/hooks/useI18nContext';
import {
  getOrderedConnectedAccountsForActiveTab,
  getOriginOfCurrentTab,
  getSelectedAddress,
  getSelectedIdentity,
} from '@view/selectors';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const { ERROR, LOADING } = ALERT_STATE;

const UnconnectedAccountAlert = () => {
  const t = useI18nContext();
  const dispatch = useDispatch();
  const alertState = useSelector(getAlertState);
  const connectedAccounts = useSelector(
    getOrderedConnectedAccountsForActiveTab,
  );
  const origin = useSelector(getOriginOfCurrentTab);
  const selectedIdentity = useSelector(getSelectedIdentity);
  const selectedAddress = useSelector(getSelectedAddress);
  const [dontShowThisAgain, setDontShowThisAgain] = useState(false);

  const onClose = async () => {
    return dontShowThisAgain
      ? await dispatch(dismissAndDisableAlert())
      : dispatch(dismissAlert());
  };

  const footer = (
    <>
      {alertState === ERROR ? (
        <div className="unconnected-account-alert__error">
          {t('failureMessage')}
        </div>
      ) : null}
      <div className="unconnected-account-alert__footer-row">
        <div className="unconnected-account-alert__checkbox-wrapper">
          <Checkbox
            id="unconnectedAccount_dontShowThisAgain"
            checked={dontShowThisAgain}
            className="unconnected-account-alert__checkbox"
            onClick={() => setDontShowThisAgain((checked) => !checked)}
          />
          <label
            className="unconnected-account-alert__checkbox-label"
            htmlFor="unconnectedAccount_dontShowThisAgain"
          >
            {t('dontShowThisAgain')}
            <Tooltip
              position="top"
              title={t('alertDisableTooltip')}
              wrapperClassName="unconnected-account-alert__checkbox-label-tooltip"
            >
              <i className="fa fa-info-circle" />
            </Tooltip>
          </label>
        </div>
        <Button
          disabled={alertState === LOADING}
          onClick={onClose}
          type="primary"
          rounded
          className="unconnected-account-alert__dismiss-button"
        >
          {t('dismiss')}
        </Button>
      </div>
    </>
  );

  return (
    <Popover
      title={
        isExtensionUrl(origin) ? t('currentExtension') : new URL(origin).host
      }
      subtitle={t('currentAccountNotConnected')}
      onClose={onClose}
      className="unconnected-account-alert"
      contentClassName="unconnected-account-alert__content"
      footerClassName="unconnected-account-alert__footer"
      footer={footer}
    >
      <ConnectedAccountsList
        accountToConnect={selectedIdentity}
        connectAccount={() => dispatch(connectAccount(selectedAddress))}
        connectedAccounts={connectedAccounts}
        selectedAddress={selectedAddress}
        setSelectedAddress={(address) => dispatch(switchToAccount(address))}
        shouldRenderListOptions={false}
      />
    </Popover>
  );
};

export default UnconnectedAccountAlert;
