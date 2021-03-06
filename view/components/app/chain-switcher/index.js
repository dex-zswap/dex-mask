import LongLetter from '@c/ui/long-letter';
import { Menu, MenuItem } from '@c/ui/menu';
import {
  BSC_MAINNET,
  DEX_MAINNET,
  MAINNET,
  NETWORK_TYPE_RPC,
} from '@shared/constants/network';
import { isPrefixedFormattedHexString } from '@shared/modules/network.utils';
import { NETWORKS_FORM_ROUTE } from '@view/helpers/constants/routes';
import * as actions from '@view/store/actions';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

class ChainSwitcher extends Component {
  static contextTypes = {
    t: PropTypes.func,
  };

  static propTypes = {
    provider: PropTypes.object.isRequired,
    frequentRpcListDetail: PropTypes.array,
    showNetworkDropdown: PropTypes.func.isRequired,
    setProviderType: PropTypes.func.isRequired,
    setRpcTarget: PropTypes.func.isRequired,
    hideNetworkDropdown: PropTypes.func.isRequired,
    setNetworksTabAddMode: PropTypes.func.isRequired,
    setSelectedSettingsRpcUrl: PropTypes.func.isRequired,
    frequentRpcListDetail: PropTypes.array.isRequired,
    networkDropdownOpen: PropTypes.bool,
    networkType: PropTypes.string,
    history: PropTypes.object.isRequired,
    displayInvalidCustomNetworkAlert: PropTypes.func.isRequired,
    showConfirmDeleteNetworkModal: PropTypes.func.isRequired,
  };

  triggerEl = null;

  state = {
    showMenu: false,
  };

  switchNetWork(providerType) {
    const { provider, setProviderType } = this.props;
    setProviderType(providerType);
  }

  handleClick(newProviderType) {
    const { setProviderType } = this.props;
    this.toggleNetworkDrop();
    setProviderType(newProviderType);
  }

  toggleNetworkDrop() {
    this.setState((prev) => {
      return {
        ...prev,
        showMenu: !prev.showMenu,
      };
    });
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

  renderCurrentChain() {
    return (
      <div className="chain-switcher__current-chain">
        {this.getNetworkName()}
      </div>
    );
  }

  renderDefaultChains() {
    const { provider, setProviderType } = this.props;
    const providerName = provider.type;

    return (
      <div className="chain-switcher__default-chains">
        <div
          className={classnames([
            'chain-switcher__default-chain-item',
            providerName === DEX_MAINNET && 'chain-switcher__current-chain',
          ])}
          onClick={() => this.switchNetWork(DEX_MAINNET)}
        >
          DEX
        </div>
        <div
          className={classnames([
            'chain-switcher__default-chain-item',
            providerName === MAINNET && 'chain-switcher__current-chain',
          ])}
          onClick={() => this.switchNetWork(MAINNET)}
        >
          ETH
        </div>
        <div
          className={classnames([
            'chain-switcher__default-chain-item',
            providerName === BSC_MAINNET && 'chain-switcher__current-chain',
          ])}
          onClick={() => this.switchNetWork(BSC_MAINNET)}
        >
          BSC
        </div>
      </div>
    );
  }

  renderCustomRpcListMenus(rpcListDetail, provider) {
    const reversedRpcListDetail = rpcListDetail.slice().reverse();

    return reversedRpcListDetail.map((entry) => {
      const { rpcUrl, chainId, ticker = 'ETH', nickname = '' } = entry;
      const isCurrentRpcTarget =
        provider.type === NETWORK_TYPE_RPC && rpcUrl === provider.rpcUrl;

      return (
        <MenuItem
          className={isCurrentRpcTarget ? 'active' : ''}
          key={`common${rpcUrl}`}
          onClick={() => {
            this.props.hideNetworkDropdown();
            if (isPrefixedFormattedHexString(chainId)) {
              this.props.setRpcTarget(rpcUrl, chainId, ticker, nickname);
            } else {
              this.props.displayInvalidCustomNetworkAlert(nickname || rpcUrl);
            }
            this.toggleNetworkDrop();
          }}
        >
          <div className="network__chain-icon"></div>
          <div
            className={
              isCurrentRpcTarget
                ? 'chain-name chain-checked-name'
                : 'chain-name'
            }
          >
            <LongLetter text={nickname || rpcUrl} length={13} />
          </div>
          {isCurrentRpcTarget && (
            <div className="chain-checked">
              <img width="7px" src="images/dex/account-menu/checked.png" />
            </div>
          )}
        </MenuItem>
      );
    });
  }

  renderNetworkMenuItem(network) {
    const {
      provider: { type: providerType },
    } = this.props;

    const iconBg =
      'dexMainnet' === network
        ? '/images/dex-token.png'
        : 'mainnet' === network
        ? '/images/eth_logo.png'
        : 'bscMainnet' === network
        ? '/images/bnb.png'
        : '/images/dex/settings/chain-icon.png';

    return (
      <MenuItem
        className={network === providerType ? 'active' : ''}
        key={network}
        onClick={() => this.handleClick(network)}
      >
        <div
          style={{
            background: `url(${iconBg}) no-repeat
            center / cover`,
          }}
          className="network__chain-icon"
        ></div>
        <div
          className={
            network === providerType
              ? 'chain-name chain-checked-name'
              : 'chain-name'
          }
        >
          <LongLetter text={this.context.t(network)} length={13} />
        </div>
        {network === providerType && (
          <div className="chain-checked">
            <img width="7px" src="images/dex/account-menu/checked.png" />
          </div>
        )}
      </MenuItem>
    );
  }

  renderNetWorkMenu() {
    const {
      provider: { rpcUrl: activeNetwork },
      setNetworksTabAddMode,
      setSelectedSettingsRpcUrl,
      triggerEl,
      hideNetworkDropdown,
    } = this.props;
    const rpcListDetail = this.props.frequentRpcListDetail;

    return (
      <Menu
        className="network-droppo__menu"
        anchorElement={this.triggerEl}
        onHide={() => this.toggleNetworkDrop()}
      >
        {this.renderNetworkMenuItem('dexMainnet')}
        {this.renderNetworkMenuItem('mainnet')}
        {this.renderNetworkMenuItem('bscMainnet')}
        {this.renderNetworkMenuItem('ropsten')}
        {this.renderNetworkMenuItem('kovan')}
        {this.renderNetworkMenuItem('rinkeby')}
        {this.renderNetworkMenuItem('goerli')}
        {this.renderCustomRpcListMenus(rpcListDetail, this.props.provider)}
        <div className="network-divder"></div>
        <MenuItem
          onClick={() => {
            this.props.history.push(NETWORKS_FORM_ROUTE);
            setSelectedSettingsRpcUrl('');
            setNetworksTabAddMode(true);
          }}
        >
          <div className="network__chain-icon custom"></div>
          <div className="chain-name">{this.context.t('customRPC')}</div>
        </MenuItem>
      </Menu>
    );
  }

  render() {
    const { showNetworkDropdown, provider, frequentRpcListDetail } = this.props;
    const { showMenu } = this.state;

    return (
      <>
        <div className="chain-switcher">
          <div className="chain-switcher__wrapper">
            {this.renderDefaultChains()}
            <div
              className="chain-switcher__modal-trigger"
              ref={(el) => (this.triggerEl = el)}
              onClick={() => this.toggleNetworkDrop()}
            >
              ...
            </div>
          </div>
        </div>
        {showMenu && this.renderNetWorkMenu()}
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    provider: state.metamask.provider,
    frequentRpcListDetail: state.metamask.frequentRpcListDetail || [],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showNetworkDropdown: () => dispatch(actions.showNetworkDropdown('menu')),
    setProviderType: (type) => {
      dispatch(actions.setProviderType(type));
    },
    setRpcTarget: (target, chainId, ticker, nickname) => {
      dispatch(actions.setRpcTarget(target, chainId, ticker, nickname));
    },
    hideNetworkDropdown: () => dispatch(actions.hideNetworkDropdown()),
    setNetworksTabAddMode: (isInAddMode) => {
      dispatch(actions.setNetworksTabAddMode(isInAddMode));
    },
    setSelectedSettingsRpcUrl: (url) => {
      dispatch(actions.setSelectedSettingsRpcUrl(url));
    },
    displayInvalidCustomNetworkAlert: (networkName) => {
      dispatch(displayInvalidCustomNetworkAlert(networkName));
    },
    showConfirmDeleteNetworkModal: ({ target, onConfirm }) => {
      return dispatch(
        actions.showModal({
          name: 'CONFIRM_DELETE_NETWORK',
          target,
          onConfirm,
        }),
      );
    },
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ChainSwitcher);
