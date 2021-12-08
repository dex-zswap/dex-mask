import { getEnvironmentType } from '@app/scripts/lib/util';
import ConnectedStatusIndicator from '@c/app/connected/status-indicator';
import Logo from '@c/ui/logo';
import { ENVIRONMENT_TYPE_POPUP } from '@shared/constants/app';
import {
  ASSET_ROUTE,
  CONFIRM_TRANSACTION_ROUTE,
  CONNECTED_ACCOUNTS_ROUTE,
  CONNECTED_ROUTE,
  DEFAULT_ROUTE,
  LIQUIDITY_ROUTE,
  RECIVE_TOKEN_ROUTE,
  RESTORE_VAULT_ROUTE,
  SEND_ROUTE,
  UNLOCK_ROUTE,
  ZSWAP_ROUTE,
} from '@view/helpers/constants/routes';
import * as actions from '@view/store/actions';
import extension from 'extensionizer';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { matchPath, withRouter } from 'react-router-dom';
import { compose } from 'redux';

class TopHeader extends Component {
  static contextTypes = {
    t: PropTypes.func,
  };

  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object,
    provider: PropTypes.object,
    toggleAccountMenu: PropTypes.func,
    origin: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  getNetworkName() {
    const { provider } = this.props;
    const providerName = provider.type;

    let name;

    if (providerName === 'mainnet') {
      name = this.context.t('mainnet');
    } else if (providerName === 'ropsten') {
      name = this.context.t('ropsten');
    } else if (providerName === 'kovan') {
      name = this.context.t('kovan');
    } else if (providerName === 'rinkeby') {
      name = this.context.t('rinkeby');
    } else if (providerName === 'goerli') {
      name = this.context.t('goerli');
    } else {
      name = provider.nickname || this.context.t('unknownNetwork');
    }

    return name;
  }

  renderAccountMenu() {
    return (
      <div
        className="top-header__right-account-menu"
        onClick={() => {
          this.props.toggleAccountMenu();
        }}
      ></div>
    );
  }

  renderConnectStatus() {
    const { origin, history } = this.props;
    const showStatus =
      getEnvironmentType() === ENVIRONMENT_TYPE_POPUP &&
      origin &&
      origin !== extension.runtime.id;
    if (!showStatus) {
      return null;
    }

    return (
      <ConnectedStatusIndicator
        onClick={() => history.push(CONNECTED_ACCOUNTS_ROUTE)}
      />
    );
  }

  renderLeft(left) {
    if (!left) {
      return null;
    }

    const { type, extra } = left;

    if (!type) {
      return null;
    }

    if (type === 'connectStatus') {
      return this.renderConnectStatus();
    }

    return (
      <div
        onClick={this.backLastPage}
        className={`top-header__left-${type}-icon`}
      ></div>
    );
  }

  renderRight(right, rightText) {
    if (rightText) {
      return (
        <div className="top-header__right-content">
          {this.context.t(rightText)}
        </div>
      );
    }

    if (!right) {
      return null;
    }

    const { type, extra } = right;

    if (!type) {
      return null;
    }

    if (type === 'account') {
      return this.renderAccountMenu();
    }
  }

  onConfirmPage() {
    const {
      location: { pathname },
    } = this.props;

    return !!matchPath(pathname, {
      path: CONFIRM_TRANSACTION_ROUTE,
      exact: false,
    });
  }

  getTopHeader() {
    const {
      location: { pathname },
    } = this.props;

    let rightText = '';

    if (
      matchPath(pathname, {
        path: SEND_ROUTE,
        exact: true,
      })
    ) {
      rightText = 'pay';
    }

    if (
      matchPath(pathname, {
        path: RECIVE_TOKEN_ROUTE,
        exact: true,
      })
    ) {
      rightText = 'receive2';
    }

    if (this.onConfirmPage()) {
      return {};
    }
    const isDefault =
      !!matchPath(pathname, {
        path: DEFAULT_ROUTE,
        exact: true,
      }) ||
      !!matchPath(pathname, {
        path: CONNECTED_ACCOUNTS_ROUTE,
        exact: true,
      }) ||
      !!matchPath(pathname, {
        path: CONNECTED_ROUTE,
        exact: true,
      });

    if (isDefault) {
      return {
        left: {
          type: 'connectStatus',
          extra: {},
        },
        right: {
          type: 'account',
          extra: {},
        },
        rightText,
      };
    }

    return {
      left: {
        type: 'arrow',
      },
      type: {},
      rightText,
    };
  }

  backLastPage = () => {
    const {
      location: { pathname },
      history,
    } = this.props;
    const isSpecial =
      !!matchPath(pathname, {
        path: LIQUIDITY_ROUTE,
        exact: true,
      }) ||
      !!matchPath(pathname, {
        path: ZSWAP_ROUTE,
        exact: true,
      }) ||
      !!matchPath(pathname, {
        path: SEND_ROUTE,
        exact: true,
      }) ||
      !!matchPath(pathname, {
        path: `${ASSET_ROUTE}/:id`,
        exact: true,
      });

    const isRestore = !!matchPath(pathname, {
      path: RESTORE_VAULT_ROUTE,
      exact: true,
    });

    if (isRestore) {
      history.replace(UNLOCK_ROUTE);
      return;
    }

    if (isSpecial) {
      history.replace(DEFAULT_ROUTE);
    } else {
      history.goBack();
    }
  };

  render() {
    const { t } = this.context;
    const { left, right, rightText = '' } = this.getTopHeader();

    return (
      <div className="top-header">
        <div className="top-header__position"></div>
        <div className="top-header__wrapper-container">
          <div className="top-header__wrapper">
            <div className="top-header__left">{this.renderLeft(left)}</div>
            <div className="top-header__logo">
              <Logo width="60px" height="83px" />
            </div>
            <div className="top-header__right">
              {this.renderRight(right, rightText)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    provider: state.metamask.provider,
    origin: state.activeTab.origin || '',
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleAccountMenu: () => {
      return dispatch(actions.toggleAccountMenu());
    },
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(TopHeader);
