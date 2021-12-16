import React, { useMemo, useState, useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { getEnvironmentType } from '@app/scripts/lib/util';
import { hideWhatsNewPopup, setThreeBoxLastUpdated } from '@reducer/app';
import { getWeb3ShimUsageAlertEnabledness } from '@reducer/dexmask/dexmask';
import { getSwapsFeatureIsLive } from '@reducer/swaps/swaps';
import {
  ALERT_TYPES,
  WEB3_SHIM_USAGE_ALERT_STATES,
} from '@shared/constants/alerts';
import {
  ENVIRONMENT_TYPE_NOTIFICATION,
  ENVIRONMENT_TYPE_POPUP,
} from '@shared/constants/app';
import {
  activeTabHasPermissions,
  getCurrentEthBalance,
  getFirstPermissionRequest,
  getInfuraBlocked,
  getIsMainnet,
  getAppState,
  getOriginOfCurrentTab,
  getTotalUnapprovedCount,
  getUnapprovedTemplatedConfirmations,
  getWeb3ShimUsageStateForOrigin,
  unconfirmedTransactionsCountSelector,
} from '@view/selectors';
import {
  getThreeBoxLastUpdated,
  restoreFromThreeBox,
  setAlertEnabledness,
  setConnectedStatusPopoverHasBeenShown,
  setDefaultHomeActiveTabName,
  setRecoveryPhraseReminderHasBeenShown,
  setRecoveryPhraseReminderLastShown,
  setShowRestorePromptToFalse,
  setWeb3ShimUsageAlertDismissed,
  turnThreeBoxSyncingOn,
} from '@view/store/actions';
import { useI18nContext } from '@view/hooks/useI18nContext';

import { getDexMaskState } from '@reducer/dexmask/dexmask';

import AssetList from '@c/app/asset-list';
import ChainSwitcher from '@c/app/chain-switcher';
import HomeNotification from '@c/app/home-notification';
import MultipleNotifications from '@c/app/multiple-notifications';
import SelectedAccount from '@c/app/selected-account';
import { EthOverview } from '@c/app/wallet-overview';
import { Tab, Tabs } from '@c/ui/tabs';
import TransactionList from '@c/app/transaction/list';
import TopHeader from '@c/ui/top-header';

import {
  ASSET_ROUTE,
  AWAITING_SWAP_ROUTE,
  BUILD_QUOTE_ROUTE,
  CONFIRMATION_V_NEXT_ROUTE,
  CONFIRM_ADD_SUGGESTED_TOKEN_ROUTE,
  CONFIRM_TRANSACTION_ROUTE,
  CONNECTED_ACCOUNTS_ROUTE,
  CONNECTED_ROUTE,
  CONNECT_ROUTE,
  INITIALIZE_BACKUP_SEED_PHRASE_ROUTE,
  RESTORE_VAULT_ROUTE,
  VIEW_QUOTE_ROUTE,
} from '@view/helpers/constants/routes';
import { formatDate } from '@view/helpers/utils';

export default function HomePage() {
  const t = useI18nContext();
  const history = useHistory();

  const { forgottenPassword, threeBoxLastUpdated } = useSelector(getAppState);
  const {
    suggestedTokens,
    seedPhraseBackedUp,
    tokens,
    threeBoxSynced,
    showRestorePrompt,
    selectedAddress,
    connectedStatusPopoverHasBeenShown,
    defaultHomeActiveTabName,
    swapsState,
    dismissSeedBackUpReminder
  } = useSelector(getDexMaskState);

  const accountBalance = useSelector(getCurrentEthBalance);
  const totalUnapprovedCount = useSelector(getTotalUnapprovedCount);
  const swapsEnabled = useSelector(getSwapsFeatureIsLive);
  const pendingConfirmations = useSelector(getUnapprovedTemplatedConfirmations);

  const envType = getEnvironmentType();
  const isPopup = envType === ENVIRONMENT_TYPE_POPUP;
  const isNotification = envType === ENVIRONMENT_TYPE_NOTIFICATION;

  const firstPermissionsRequest = useSelector(getFirstPermissionRequest);
  const firstPermissionsRequestId =
    firstPermissionsRequest && firstPermissionsRequest.metadata
      ? firstPermissionsRequest.metadata.id
      : null;
  const originOfCurrentTab = useSelector(getOriginOfCurrentTab);
  const shouldShowWeb3ShimUsageNotification =
    isPopup &&
    useSelector(getWeb3ShimUsageAlertEnabledness) &&
    useSelector(activeTabHasPermissions) &&
    useSelector(state => getWeb3ShimUsageStateForOrigin(state, originOfCurrentTab)) === WEB3_SHIM_USAGE_ALERT_STATES.RECORDED;

  const unconfirmedTransactionsCount = useSelector(unconfirmedTransactionsCountSelector);
  const isMainnet = useSelector(getIsMainnet);
  const infuraBlocked = useSelector(getInfuraBlocked);

  const shouldShowSeedPhraseReminder = useMemo(() => seedPhraseBackedUp === false && (parseInt(accountBalance, 16) > 0 || tokens.length > 0) && dismissSeedBackUpReminder === false, [seedPhraseBackedUp, accountBalance, tokens, dismissSeedBackUpReminder]);

  return (
    <div className="main-container dex-page-container">
      <div className="home__container base-width">
        <div className="home__main-view">
          <TopHeader />
          <ChainSwitcher />
          <SelectedAccount />
          <EthOverview />
          <Tabs
            defaultActiveTabName={t('assets')}
            tabsClassName="home__tabs"
          >
            <Tab
              activeClassName="home__tab--active"
              className="home__tab"
              data-testid="home__asset-tab"
              name={t('assets')}
            >
              <AssetList
                onClickAsset={(asset) =>
                  history.push(`${ASSET_ROUTE}/${asset}`)
                }
              />
            </Tab>
            <Tab
              activeClassName="home__tab--active"
              className="home__tab"
              data-testid="home__activity-tab"
              name={t('activity')}
            >
              <TransactionList />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
