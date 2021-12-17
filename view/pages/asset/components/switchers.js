import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import UserPreferencedCurrencyDisplay from '@c/app/user-preferenced/currency-display';
import LongLetter from '@c/ui/long-letter';
import { Menu, MenuItem } from '@c/ui/menu';
import { NETWORK_TYPE_RPC } from '@shared/constants/network';
import { isPrefixedFormattedHexString } from '@shared/modules/network.utils';
import { PRIMARY } from '@view/helpers/constants/common';
import { getDexMaskAccountsOrdered, getSelectedAccount, getSelectedIdentity } from '@view/selectors';
import * as actions from '@view/store/actions';

class Switchers extends React.Component {
  static contextTypes = {
    t: PropTypes.func
  };
  static propTypes = {
    provider: PropTypes.object.isRequired,
    selectedIdentity: PropTypes.object.isRequired,
    selectedAccount: PropTypes.object.isRequired,
    setProviderType: PropTypes.func.isRequired,
    setRpcTarget: PropTypes.func.isRequired,
    showNetworkDropdown: PropTypes.func.isRequired,
    setSelectedAddress: PropTypes.func.isRequired,
    nativeCurrency: PropTypes.string,
    accounts: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.accountSwitchRef = null;
    this.networkSwitchRef = null;
    this.state = {
      showAccount: false,
      showChainSwitcher: false
    };
  }

  switchNetWork(providerType) {
    const {
      setProviderType
    } = this.props;
    this.toggleSwitchNetwork();
    setProviderType(providerType);
  }

  handleClick(newProviderType) {
    const {
      setProviderType
    } = this.props;
    this.toggleSwitchNetwork();
    setProviderType(newProviderType);
  }

  getNetworkName() {
    const {
      provider
    } = this.props;
    const providerName = provider.type;
    let name;

    if (providerName === 'mainnet') {
      name = this.context.t('mainnet');
    } else if (providerName === 'bscMainnet') {
      name = this.context.t('bscMainnet');
    } else if (providerName === 'dexMainnet') {
      name = this.context.t('dexMainnet');
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

    return {
      display: name.length > 8 ? `${name.substr(0, 8)}...` : name,
      name
    };
  }

  getAccountName() {
    const {
      selectedIdentity: {
        name
      } = {}
    } = this.props;
    return {
      display: name.length > 10 ? `${name.substr(0, 10)}...` : name,
      name
    };
  }

  renderCustomRpcListMenus(rpcListDetail, provider) {
    const reversedRpcListDetail = rpcListDetail.slice().reverse();
    return reversedRpcListDetail.map(entry => {
      const {
        rpcUrl,
        chainId,
        ticker = 'ETH',
        nickname = ''
      } = entry;
      const isCurrentRpcTarget = provider.type === NETWORK_TYPE_RPC && rpcUrl === provider.rpcUrl;
      return <MenuItem className={isCurrentRpcTarget ? 'active' : ''} key={`common${rpcUrl}`} onClick={() => {
        if (isPrefixedFormattedHexString(chainId)) {
          this.props.setRpcTarget(rpcUrl, chainId, ticker, nickname);
        } else {
          this.props.displayInvalidCustomNetworkAlert(nickname || rpcUrl);
        }

        this.toggleSwitchNetwork();
      }}>
          <div className="network__chain-icon"></div>
          <div className={isCurrentRpcTarget ? 'chain-name chain-checked-name' : 'chain-name'}>
            <LongLetter text={nickname || rpcUrl} length={13} />
          </div>
          {isCurrentRpcTarget && <div className="chain-checked">
              <img width="7px" src="images/dex/account-menu/checked.png" />
            </div>}
        </MenuItem>;
    });
  }

  renderNetworkMenuItem(network) {
    const {
      provider: {
        type: providerType
      }
    } = this.props;
    const iconBg = 'dexMainnet' === network ? '/images/dex-token.png' : 'mainnet' === network ? '/images/eth_logo.png' : 'bscMainnet' === network ? '/images/bnb.png' : '/images/dex/settings/chain-icon.png';
    return <MenuItem className={network === providerType ? 'active' : ''} key={network} onClick={() => this.handleClick(network)}>
        <div style={{
        background: `url(${iconBg}) no-repeat
            center / cover`
      }} className="network__chain-icon"></div>
        <div className={network === providerType ? 'chain-name chain-checked-name' : 'chain-name'}>
          <LongLetter text={this.context.t(network)} length={13} />
        </div>
        {network === providerType && <div className="chain-checked">
            <img width="7px" src="images/dex/account-menu/checked.png" />
          </div>}
      </MenuItem>;
  }

  renderNetworkMenu() {
    const {
      frequentRpcList
    } = this.props;
    return <Menu className="network-droppo__menu" anchorElement={this.networkSwitchRef} onHide={this.toggleSwitchNetwork}>
        {this.renderNetworkMenuItem('dexMainnet')}
        {this.renderNetworkMenuItem('mainnet')}
        {this.renderNetworkMenuItem('bscMainnet')}
        {this.renderNetworkMenuItem('ropsten')}
        {this.renderNetworkMenuItem('kovan')}
        {this.renderNetworkMenuItem('rinkeby')}
        {this.renderNetworkMenuItem('goerli')}
        {this.renderCustomRpcListMenus(frequentRpcList, this.props.provider)}
      </Menu>;
  }

  renderNetrowkSwitcher() {
    const {
      display,
      name
    } = this.getNetworkName();
    return <div className="switcher-bar" ref={element => this.networkSwitchRef = element} onClick={this.toggleSwitchNetwork}>
        <div className="switcher-text" title={name}>
          {display}
        </div>
        <div className="switcher-arrow"></div>
      </div>;
  }

  toggleSwitchAccount = () => {
    this.setState({
      showAccount: !this.state.showAccount
    });
  };
  toggleSwitchNetwork = () => {
    this.setState({
      showChainSwitcher: !this.state.showChainSwitcher
    });
  };
  selectAccount = address => {
    this.toggleSwitchAccount();
    this.props.setSelectedAddress(address);
  };

  renderAccountSwitcher() {
    const {
      display,
      name
    } = this.getAccountName();
    return <div className="switcher-bar" onClick={this.toggleSwitchAccount} ref={element => this.accountSwitchRef = element}>
        <div className="switcher-text" title={name}>
          {display}
        </div>
        <div className="switcher-arrow"></div>
      </div>;
  }

  renderAccountMenu() {
    const {
      accounts,
      nativeCurrency,
      selectedAccount: {
        address
      }
    } = this.props;
    return <Menu anchorElement={this.accountSwitchRef} className="switcher__account-menu" onHide={this.toggleSwitchAccount}>
        {accounts.map(account => <MenuItem key={account.address} onClick={() => this.selectAccount(account.address)}>
            <div className="switcher__account-menu__row">
              <div className="switcher__account-menu__row-avatar"></div>
              <div className="switcher__account-menu__row-item">
                <div className="avatar-name">{account.name}</div>
                <div className="account-info">
                  <UserPreferencedCurrencyDisplay className="account-menu__balance" value={account.balance} type={PRIMARY} />
                </div>
              </div>
              {address === account.address && <div className="account-checked"></div>}
            </div>
          </MenuItem>)}
      </Menu>;
  }

  render() {
    return <div className="asset__switchers">
        {this.state.showAccount && this.renderAccountMenu()}
        {this.state.showChainSwitcher && this.renderNetworkMenu()}
        {this.renderNetrowkSwitcher()}
        {this.renderAccountSwitcher()}
      </div>;
  }

}

function mapStateToProps(state) {
  return {
    selectedIdentity: getSelectedIdentity(state),
    selectedAccount: getSelectedAccount(state),
    accounts: getDexMaskAccountsOrdered(state),
    frequentRpcList: state.metamask.frequentRpcListDetail,
    nativeCurrency: state.metamask.nativeCurrency,
    provider: state.metamask.provider
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showNetworkDropdown: () => dispatch(actions.showNetworkDropdown()),
    setSelectedAddress: address => dispatch(actions.setSelectedAddress(address)),
    setProviderType: type => {
      dispatch(actions.setProviderType(type));
    },
    setRpcTarget: (target, chainId, ticker, nickname) => {
      dispatch(actions.setRpcTarget(target, chainId, ticker, nickname));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Switchers);