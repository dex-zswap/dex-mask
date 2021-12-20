import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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
import Tabs from '@c/ui/tabs';
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
    dismissSeedBackUpReminder,
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
    useSelector((state) =>
      getWeb3ShimUsageStateForOrigin(state, originOfCurrentTab),
    ) === WEB3_SHIM_USAGE_ALERT_STATES.RECORDED;
  const unconfirmedTransactionsCount = useSelector(
    unconfirmedTransactionsCountSelector,
  );
  const isMainnet = useSelector(getIsMainnet);
  const infuraBlocked = useSelector(getInfuraBlocked);
  const shouldShowSeedPhraseReminder = useMemo(
    () =>
      seedPhraseBackedUp === false &&
      (parseInt(accountBalance, 16) > 0 || tokens.length > 0) &&
      dismissSeedBackUpReminder === false,
    [seedPhraseBackedUp, accountBalance, tokens, dismissSeedBackUpReminder],
  );
  const mounted = useRef(false);
  const [state, setState] = useState({
    closing: false,
    redirecting: false,
  });
  useEffect(() => {
    if (isNotification && totalUnapprovedCount === 0) {
      global.platform.closeCurrentWindow();
    } else if (firstPermissionsRequestId) {
      history.push(`${CONNECT_ROUTE}/${firstPermissionsRequestId}`);
    } else if (unconfirmedTransactionsCount > 0) {
      history.push(CONFIRM_TRANSACTION_ROUTE);
    } else if (Object.keys(suggestedTokens).length > 0) {
      history.push(CONFIRM_ADD_SUGGESTED_TOKEN_ROUTE);
    } else if (pendingConfirmations.length > 0) {
      history.push(CONFIRMATION_V_NEXT_ROUTE);
    }
  }, [
    history,
    suggestedTokens,
    isNotification,
    totalUnapprovedCount,
    firstPermissionsRequestId,
    unconfirmedTransactionsCount,
    pendingConfirmations,
  ]);
  useEffect(() => {
    if (!mounted.current) {
      setState((state) => {
        if (isNotification && totalUnapprovedCount === 0) {
          return { ...state, closing: true };
        } else if (
          firstPermissionsRequestId ||
          unconfirmedTransactionsCount > 0 ||
          Object.keys(suggestedTokens).length > 0
        ) {
          return { ...state, redirecting: true };
        }

        return state;
      });
    }
  }, [
    firstPermissionsRequestId,
    isNotification,
    suggestedTokens,
    totalUnapprovedCount,
    unconfirmedTransactionsCount,
    mounted.current,
  ]);
  return (
    <div className="main-container dex-page-container">
      <div className="home__container base-width">
        <div className="home__main-view">
          <TopHeader />
          <ChainSwitcher addRpc />
          <SelectedAccount />
          <EthOverview />
          <Tabs
            actived="assets"
            tabs={[
              {
                label: t('assets'),
                key: 'assets',
              },
              {
                label: t('activity'),
                key: 'activity',
              },
            ]}
          >
            <AssetList
              onClickAsset={(asset) => history.push(`${ASSET_ROUTE}/${asset}`)}
            />
            <TransactionList />
          </Tabs>
        </div>
      </div>
    </div>
  );
}
