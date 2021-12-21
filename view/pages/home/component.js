import React, { PureComponent } from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import AssetList from '@c/app/asset-list';
import ChainSwitcher from '@c/app/chain-switcher';
import HomeNotification from '@c/app/home-notification';
import MultipleNotifications from '@c/app/multiple-notifications';
import SelectedAccount from '@c/app/selected-account';
import { EthOverview } from '@c/app/wallet-overview';
import Button from '@c/ui/button';
import Popover from '@c/ui/popover';
import Tabs from '@c/ui/tabs';
import TransactionList from '@c/app/transaction/list';
import TopHeader from '@c/ui/top-header';
import ConnectedAccounts from '@pages/connected-accounts';
import ConnectedSites from '@pages/connected-sites';
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
const LEARN_MORE_URL =
  'https://metamask.zendesk.com/hc/en-us/articles/360045129011-Intro-to-MetaMask-v8-extension';
const LEGACY_WEB3_URL =
  'https://metamask.zendesk.com/hc/en-us/articles/360053147012';
const INFURA_BLOCKAGE_URL =
  'https://metamask.zendesk.com/hc/en-us/articles/360059386712';
export default class Home extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  };

  state = {
    mounted: false,
    canShowBlockageNotification: true,
  };

  componentDidMount() {
    const {
      firstPermissionsRequestId,
      history,
      isNotification,
      suggestedTokens = {},
      totalUnapprovedCount,
      unconfirmedTransactionsCount,
      haveSwapsQuotes,
      showAwaitingSwapScreen,
      swapsFetchParams,
      pendingConfirmations,
    } = this.props;
    this.setState({
      mounted: true,
    });

    if (isNotification && totalUnapprovedCount === 0) {
      global.platform.closeCurrentWindow();
    } else if (!isNotification && showAwaitingSwapScreen) {
      history.push(AWAITING_SWAP_ROUTE);
    } else if (!isNotification && haveSwapsQuotes) {
      history.push(VIEW_QUOTE_ROUTE);
    } else if (!isNotification && swapsFetchParams) {
      history.push(BUILD_QUOTE_ROUTE);
    } else if (firstPermissionsRequestId) {
      console.log('connect');
      history.push(`${CONNECT_ROUTE}/${firstPermissionsRequestId}`);
    } else if (unconfirmedTransactionsCount > 0) {
      history.push(CONFIRM_TRANSACTION_ROUTE);
    } else if (Object.keys(suggestedTokens).length > 0) {
      history.push(CONFIRM_ADD_SUGGESTED_TOKEN_ROUTE);
    } else if (pendingConfirmations.length > 0) {
      history.push(CONFIRMATION_V_NEXT_ROUTE);
    }
  }

  static getDerivedStateFromProps(
    {
      firstPermissionsRequestId,
      isNotification,
      suggestedTokens,
      totalUnapprovedCount,
      unconfirmedTransactionsCount,
      haveSwapsQuotes,
      showAwaitingSwapScreen,
      swapsFetchParams,
    },
    { mounted },
  ) {
    if (!mounted) {
      if (isNotification && totalUnapprovedCount === 0) {
        return {
          closing: true,
        };
      } else if (
        firstPermissionsRequestId ||
        unconfirmedTransactionsCount > 0 ||
        Object.keys(suggestedTokens).length > 0 ||
        (!isNotification &&
          (showAwaitingSwapScreen || haveSwapsQuotes || swapsFetchParams))
      ) {
        return {
          redirecting: true,
        };
      }
    }

    return null;
  }

  componentDidUpdate(_, prevState) {
    const {
      setupThreeBox,
      showRestorePrompt,
      threeBoxLastUpdated,
      threeBoxSynced,
    } = this.props;

    if (!prevState.closing && this.state.closing) {
      global.platform.closeCurrentWindow();
    }

    if (threeBoxSynced && showRestorePrompt && threeBoxLastUpdated === null) {
      setupThreeBox();
    }
  }

  renderNotifications() {
    const { t } = this.context;
    const {
      history,
      shouldShowSeedPhraseReminder,
      isPopup,
      selectedAddress,
      restoreFromThreeBox,
      turnThreeBoxSyncingOn,
      setShowRestorePromptToFalse,
      showRestorePrompt,
      threeBoxLastUpdated,
      shouldShowWeb3ShimUsageNotification,
      setWeb3ShimUsageAlertDismissed,
      originOfCurrentTab,
      disableWeb3ShimUsageAlert,
      infuraBlocked,
    } = this.props;
    return (
      <MultipleNotifications>
        {shouldShowWeb3ShimUsageNotification ? (
          <HomeNotification
            descriptionText={t('web3ShimUsageNotification', [
              <span
                key="web3ShimUsageNotificationLink"
                className="home-notification__text-link"
                onClick={() =>
                  global.platform.openTab({
                    url: LEGACY_WEB3_URL,
                  })
                }
              >
                {t('here')}
              </span>,
            ])}
            ignoreText={t('dismiss')}
            onIgnore={(disable) => {
              setWeb3ShimUsageAlertDismissed(originOfCurrentTab);

              if (disable) {
                disableWeb3ShimUsageAlert();
              }
            }}
            checkboxText={t('dontShowThisAgain')}
            checkboxTooltipText={t('canToggleInSettings')}
            key="home-web3ShimUsageNotification"
          />
        ) : null}
        {shouldShowSeedPhraseReminder ? (
          <HomeNotification
            descriptionText={t('backupApprovalNotice')}
            acceptText={t('backupNow')}
            onAccept={() => {
              if (isPopup) {
                global.platform.openExtensionInBrowser(
                  INITIALIZE_BACKUP_SEED_PHRASE_ROUTE,
                );
              } else {
                history.push(INITIALIZE_BACKUP_SEED_PHRASE_ROUTE);
              }
            }}
            infoText={t('backupApprovalInfo')}
            key="home-backupApprovalNotice"
          />
        ) : null}
        {threeBoxLastUpdated && showRestorePrompt ? (
          <HomeNotification
            descriptionText={t('restoreWalletPreferences', [
              formatDate(threeBoxLastUpdated, 'M/d/y'),
            ])}
            acceptText={t('restore')}
            ignoreText={t('noThanks')}
            infoText={t('dataBackupFoundInfo')}
            onAccept={() => {
              restoreFromThreeBox(selectedAddress).then(() => {
                turnThreeBoxSyncingOn();
              });
            }}
            onIgnore={() => {
              setShowRestorePromptToFalse();
            }}
            key="home-privacyModeDefault"
          />
        ) : null}
        {infuraBlocked && this.state.canShowBlockageNotification ? (
          <HomeNotification
            descriptionText={t('infuraBlockedNotification', [
              <span
                key="infuraBlockedNotificationLink"
                className="home-notification__text-link"
                onClick={() =>
                  global.platform.openTab({
                    url: INFURA_BLOCKAGE_URL,
                  })
                }
              >
                {t('here')}
              </span>,
            ])}
            ignoreText={t('dismiss')}
            onIgnore={() => {
              this.setState({
                canShowBlockageNotification: false,
              });
            }}
            key="home-infuraBlockedNotification"
          />
        ) : null}
      </MultipleNotifications>
    );
  }

  renderPopover = () => {
    const { setConnectedStatusPopoverHasBeenShown } = this.props;
    const { t } = this.context;
    return (
      <Popover
        title={t('whatsThis')}
        onClose={setConnectedStatusPopoverHasBeenShown}
        className="home__connected-status-popover"
        showArrow
        CustomBackground={({ onClose }) => {
          return (
            <div
              className="home__connected-status-popover-bg-container"
              onClick={onClose}
            >
              <div className="home__connected-status-popover-bg" />
            </div>
          );
        }}
        footer={
          <>
            <a href={LEARN_MORE_URL} target="_blank" rel="noopener noreferrer">
              {t('learnMore')}
            </a>
            <Button
              type="primary"
              onClick={setConnectedStatusPopoverHasBeenShown}
            >
              {t('dismiss')}
            </Button>
          </>
        }
      >
        <main className="home__connect-status-text">
          <div>{t('metaMaskConnectStatusParagraphOne')}</div>
          <div>{t('metaMaskConnectStatusParagraphTwo')}</div>
          <div>{t('metaMaskConnectStatusParagraphThree')}</div>
        </main>
      </Popover>
    );
  };

  render() {
    const { t } = this.context;
    const {
      defaultHomeActiveTabName,
      onTabClick,
      forgottenPassword,
      history,
      connectedStatusPopoverHasBeenShown,
      isPopup,
      notificationsToShow,
      showWhatsNewPopup,
      hideWhatsNewPopup,
      showRecoveryPhraseReminder,
    } = this.props;

    if (forgottenPassword) {
      return (
        <Redirect
          to={{
            pathname: RESTORE_VAULT_ROUTE,
          }}
        />
      );
    } else if (this.state.closing || this.state.redirecting) {
      return null;
    }

    const showWhatsNew = notificationsToShow && showWhatsNewPopup;
    return (
      <div className="main-container dex-page-container">
        {/* <Route path={CONNECTED_ROUTE} component={ConnectedSites} exact />
        <Route
          path={CONNECTED_ACCOUNTS_ROUTE}
          component={ConnectedAccounts}
          exact
        /> */}
        <div className="home__container base-width">
          {isPopup && !connectedStatusPopoverHasBeenShown
            ? this.renderPopover()
            : null}
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
          {this.renderNotifications()}
        </div>
      </div>
    );
  }
}
