import { getEnvironmentType } from '@app/scripts/lib/util';
import Alerts from '@c/app/alerts';
import NetworkDropdown from '@c/app/dropdowns/network-dropdown';
import LoadingNetwork from '@c/app/loading-network-screen';
import Modal from '@c/app/modals';
import Sidebar from '@c/app/sidebars';
import Alert from '@c/ui/alert';
import Loading from '@c/ui/loading-screen';
import AddTokenPage from '@pages/add-token';
import Asset from '@pages/asset';
import ConfirmAddSuggestedTokenPage from '@pages/confirm-add-suggested-token';
import ConfirmAddTokenPage from '@pages/confirm-add-token';
import ConfirmTransaction from '@pages/confirm-transaction';
import ConfirmationPage from '@pages/confirmation';
import CreateAccountPage from '@pages/create-account';
import CrossChain from '@pages/cross-chain';
import FirstTimeFlow from '@pages/first-time-flow';
import Home from '@pages/home';
import RestoreVaultPage from '@pages/keychains/restore-vault';
import RevealSeedConfirmation from '@pages/keychains/reveal-seed';
import Lock from '@pages/lock';
import PermissionsConnect from '@pages/permissions-connect';
import ReciveToken from '@pages/recive-token';
import SendTransactionScreen from '@pages/send';
import Settings from '@pages/settings';
import Trade from '@pages/trade';
import UnlockPage from '@pages/unlock-page';
import { ENVIRONMENT_TYPE_NOTIFICATION } from '@shared/constants/app';
import { TRANSACTION_STATUSES } from '@shared/constants/transaction';
import {
  ADD_TOKEN_ROUTE,
  ASSET_ROUTE,
  BUILD_QUOTE_ROUTE,
  CONFIRMATION_V_NEXT_ROUTE,
  CONFIRM_ADD_SUGGESTED_TOKEN_ROUTE,
  CONFIRM_ADD_TOKEN_ROUTE,
  CONFIRM_TRANSACTION_ROUTE,
  CONNECT_ROUTE,
  CROSSCHAIN_ROUTE,
  DEFAULT_ROUTE,
  INITIALIZE_ROUTE,
  INITIALIZE_UNLOCK_ROUTE,
  LOCK_ROUTE,
  NEW_ACCOUNT_ROUTE,
  RECIVE_TOKEN_ROUTE,
  RESTORE_VAULT_ROUTE,
  REVEAL_SEED_ROUTE,
  SEND_ROUTE,
  SETTINGS_ROUTE,
  SWAPS_ROUTE,
  TRADE_ROUTE,
  UNLOCK_ROUTE,
} from '@view/helpers/constants/routes';
import Authenticated from '@view/helpers/higher-order-components/authenticated';
import Initialized from '@view/helpers/higher-order-components/initialized';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import IdleTimer from 'react-idle-timer';
import { matchPath, Route, Switch } from 'react-router-dom';

export default class Routes extends Component {
  static propTypes = {
    currentCurrency: PropTypes.string,
    setCurrentCurrencyToUSD: PropTypes.func,
    isLoading: PropTypes.bool,
    loadingMessage: PropTypes.string,
    alertMessage: PropTypes.string,
    textDirection: PropTypes.string,
    isNetworkLoading: PropTypes.bool,
    provider: PropTypes.object,
    frequentRpcListDetail: PropTypes.array,
    sidebar: PropTypes.object,
    alertOpen: PropTypes.bool,
    hideSidebar: PropTypes.func,
    isUnlocked: PropTypes.bool,
    setLastActiveTime: PropTypes.func,
    history: PropTypes.object,
    location: PropTypes.object,
    lockMetaMask: PropTypes.func,
    submittedPendingTransactions: PropTypes.array,
    isMouseUser: PropTypes.bool,
    setMouseUserState: PropTypes.func,
    providerId: PropTypes.string,
    autoLockTimeLimit: PropTypes.number,
    pageChanged: PropTypes.func.isRequired,
    prepareToLeaveSwaps: PropTypes.func,
    browserEnvironment: PropTypes.object,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  UNSAFE_componentWillMount() {
    const {
      currentCurrency,
      pageChanged,
      setCurrentCurrencyToUSD,
      history,
    } = this.props;
    if (!currentCurrency) {
      setCurrentCurrencyToUSD();
    }

    history.listen((locationObj, action) => {
      if (action === 'PUSH') {
        pageChanged(locationObj.pathname);
      }
    });
  }

  renderRoutes() {
    const { autoLockTimeLimit, setLastActiveTime } = this.props;

    const routes = (
      <Switch>
        <Route path={LOCK_ROUTE} component={Lock} exact />
        <Route path={INITIALIZE_ROUTE} component={FirstTimeFlow} />
        <Initialized path={UNLOCK_ROUTE} component={UnlockPage} exact />
        <Initialized
          path={RESTORE_VAULT_ROUTE}
          component={RestoreVaultPage}
          exact
        />
        <Authenticated
          path={REVEAL_SEED_ROUTE}
          component={RevealSeedConfirmation}
          exact
        />
        <Authenticated path={SETTINGS_ROUTE} component={Settings} />
        <Authenticated
          path={`${CONFIRM_TRANSACTION_ROUTE}/:id?`}
          component={ConfirmTransaction}
        />
        <Authenticated
          path={SEND_ROUTE}
          component={SendTransactionScreen}
          exact
        />
        <Authenticated path={ADD_TOKEN_ROUTE} component={AddTokenPage} exact />
        <Authenticated
          path={CONFIRM_ADD_TOKEN_ROUTE}
          component={ConfirmAddTokenPage}
          exact
        />
        <Authenticated
          path={CONFIRM_ADD_SUGGESTED_TOKEN_ROUTE}
          component={ConfirmAddSuggestedTokenPage}
          exact
        />
        <Authenticated
          path={CONFIRMATION_V_NEXT_ROUTE}
          component={ConfirmationPage}
        />
        <Authenticated path={NEW_ACCOUNT_ROUTE} component={CreateAccountPage} />
        <Authenticated
          path={`${CONNECT_ROUTE}/:id`}
          component={PermissionsConnect}
        />
        <Authenticated path={`${ASSET_ROUTE}/:asset`} component={Asset} />
        <Authenticated path={RECIVE_TOKEN_ROUTE} component={ReciveToken} />
        <Authenticated path={TRADE_ROUTE} component={Trade} />
        <Authenticated path={CROSSCHAIN_ROUTE} component={CrossChain} />
        <Authenticated path={DEFAULT_ROUTE} component={Home} />
      </Switch>
    );

    if (autoLockTimeLimit > 0) {
      return (
        <IdleTimer onAction={setLastActiveTime} throttle={1000}>
          {routes}
        </IdleTimer>
      );
    }

    return routes;
  }

  onInitializationUnlockPage() {
    const { location } = this.props;
    return Boolean(
      matchPath(location.pathname, {
        path: INITIALIZE_UNLOCK_ROUTE,
        exact: true,
      }),
    );
  }

  onConfirmPage() {
    const { location } = this.props;
    return Boolean(
      matchPath(location.pathname, {
        path: CONFIRM_TRANSACTION_ROUTE,
        exact: false,
      }),
    );
  }

  onSwapsPage() {
    const { location } = this.props;
    return Boolean(
      matchPath(location.pathname, { path: SWAPS_ROUTE, exact: false }),
    );
  }

  onSwapsBuildQuotePage() {
    const { location } = this.props;
    return Boolean(
      matchPath(location.pathname, { path: BUILD_QUOTE_ROUTE, exact: false }),
    );
  }

  hideAppHeader() {
    const { location } = this.props;

    const isInitializing = Boolean(
      matchPath(location.pathname, {
        path: INITIALIZE_ROUTE,
        exact: false,
      }),
    );

    const isUnlockingPage =
      Boolean(
        matchPath(location.pathname, {
          path: INITIALIZE_UNLOCK_ROUTE,
          exact: false,
        }),
      ) ||
      Boolean(
        matchPath(location.pathname, {
          path: UNLOCK_ROUTE,
          exact: false,
        }),
      );

    if (
      (isInitializing && !this.onInitializationUnlockPage()) ||
      isUnlockingPage
    ) {
      return true;
    }

    const windowType = getEnvironmentType();

    if (windowType === ENVIRONMENT_TYPE_NOTIFICATION) {
      return true;
    }

    // if (windowType === ENVIRONMENT_TYPE_POPUP && this.onConfirmPage()) {
    //   return true;
    // }

    const isHandlingPermissionsRequest = Boolean(
      matchPath(location.pathname, {
        path: CONNECT_ROUTE,
        exact: false,
      }),
    );

    const isHandlingAddEthereumChainRequest = Boolean(
      matchPath(location.pathname, {
        path: CONFIRMATION_V_NEXT_ROUTE,
        exact: false,
      }),
    );

    return isHandlingPermissionsRequest || isHandlingAddEthereumChainRequest;
  }

  render() {
    const {
      isLoading,
      isUnlocked,
      alertMessage,
      textDirection,
      loadingMessage,
      isNetworkLoading,
      provider,
      frequentRpcListDetail,
      setMouseUserState,
      sidebar,
      submittedPendingTransactions,
      isMouseUser,
      prepareToLeaveSwaps,
      browserEnvironment,
    } = this.props;
    const loadMessage =
      loadingMessage || isNetworkLoading
        ? this.getConnectingLabel(loadingMessage)
        : null;

    const {
      isOpen: sidebarIsOpen,
      transitionName: sidebarTransitionName,
      type: sidebarType,
      props,
    } = sidebar;
    const { transaction: sidebarTransaction } = props || {};

    const sidebarShouldClose =
      sidebarTransaction &&
      !sidebarTransaction.status === TRANSACTION_STATUSES.FAILED &&
      !submittedPendingTransactions.find(
        ({ id }) => id === sidebarTransaction.id,
      );

    const { os, browser } = browserEnvironment;
    return (
      <div
        className={classnames('app', {
          [`os-${os}`]: os,
          [`browser-${browser}`]: browser,
          'mouse-user-styles': isMouseUser,
        })}
        dir={textDirection}
        onClick={() => setMouseUserState(true)}
        onKeyDown={(e) => {
          if (e.keyCode === 9) {
            setMouseUserState(false);
          }
        }}
      >
        <Modal />
        <Alert visible={this.props.alertOpen} msg={alertMessage} />
        <Sidebar
          sidebarOpen={sidebarIsOpen}
          sidebarShouldClose={sidebarShouldClose}
          hideSidebar={this.props.hideSidebar}
          transitionName={sidebarTransitionName}
          type={sidebarType}
          sidebarProps={sidebar.props}
        />
        <NetworkDropdown
          provider={provider}
          frequentRpcListDetail={frequentRpcListDetail}
        />
        {/* <AccountMenu /> */}
        <>
          {isLoading && <Loading loadingMessage={loadMessage} />}
          {!isLoading && isNetworkLoading && <LoadingNetwork />}
          {this.renderRoutes()}
        </>
        {isUnlocked ? <Alerts history={this.props.history} /> : null}
      </div>
    );
  }

  getConnectingLabel(loadingMessage) {
    if (loadingMessage) {
      return loadingMessage;
    }
    const { provider, providerId } = this.props;

    switch (provider.type) {
      case 'mainnet':
        return this.context.t('connectingToMainnet');
      case 'ropsten':
        return this.context.t('connectingToRopsten');
      case 'kovan':
        return this.context.t('connectingToKovan');
      case 'rinkeby':
        return this.context.t('connectingToRinkeby');
      case 'goerli':
        return this.context.t('connectingToGoerli');
      default:
        return this.context.t('connectingTo', [providerId]);
    }
  }

  getNetworkName() {
    switch (this.props.provider.type) {
      case 'mainnet':
        return this.context.t('mainnet');
      case 'ropsten':
        return this.context.t('ropsten');
      case 'kovan':
        return this.context.t('kovan');
      case 'rinkeby':
        return this.context.t('rinkeby');
      case 'goerli':
        return this.context.t('goerli');
      default:
        return this.context.t('unknownNetwork');
    }
  }
}
