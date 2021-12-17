import React, { Component } from 'react';
import { zeroAddress } from 'ethereumjs-util';
import PropTypes from 'prop-types';
import UserPreferencedCurrencyDisplay from '@c/app/user-preferenced/currency-display';
import AccountSwitcher from '@c/ui/cross-chain/account-switcher';
import ChainSwitcher from '@c/ui/cross-chain/chain-switcher';
import SendCardAmountInput from '@c/ui/send-card';
import TokenBalance from '@c/ui/token-balance';
import TokenImage from '@c/ui/token-image';
import { ASSET_TYPES } from '@reducer/send';
import { PRIMARY } from '@view/helpers/constants/common';
export default class SendAssetRow extends Component {
  static propTypes = {
    tokens: PropTypes.arrayOf(PropTypes.shape({
      address: PropTypes.string,
      decimals: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      symbol: PropTypes.string
    })).isRequired,
    accounts: PropTypes.object.isRequired,
    assetImages: PropTypes.object,
    selectedAddress: PropTypes.string.isRequired,
    sendAssetAddress: PropTypes.string,
    updateSendAsset: PropTypes.func.isRequired,
    nativeCurrency: PropTypes.string,
    nativeCurrencyImage: PropTypes.string,
    sendStage: PropTypes.string,
    chainId: PropTypes.string,
    changeChain: PropTypes.func,
    isInternalTrans: PropTypes.bool,
    changeFromAccountAddress: PropTypes.func,
    changeToAccountAddress: PropTypes.func,
    onAmountChange: PropTypes.func
  };
  static contextTypes = {
    t: PropTypes.func
  };
  state = {
    accountAddress: '',
    isShowingDropdown: false,
    sendableTokens: []
  };

  async componentDidMount() {
    const sendableTokens = this.props.tokens.filter(token => !token.isERC721);
    this.setState({
      sendableTokens
    });
  }

  openDropdown = () => this.setState({
    isShowingDropdown: true
  });
  closeDropdown = () => this.setState({
    isShowingDropdown: false
  });
  selectToken = (type, token) => {
    this.setState({
      isShowingDropdown: false
    }, () => {
      this.props.updateSendAsset({
        type,
        details: type === ASSET_TYPES.NATIVE ? null : token
      });
    });
  };
  accountChange = account => {
    if (this.props.isInternalTrans) {
      this.props.changeToAccountAddress(account.address);
    } else {
      this.props.changeFromAccountAddress(account.address);
      this.props.showAccountDetail(account.address);
    }
  };

  render() {
    const {
      t
    } = this.context;
    const {
      sendStage,
      isInternalTrans
    } = this.props; // if (![SEND_STAGES.DRAFT, SEND_STAGES.EDIT].includes(sendStage)) {
    //   return null;
    // }

    return <div className={isInternalTrans ? 'send-token-info__wrapper send-token-info__wrapper_noarrow' : 'send-token-info__wrapper'}>
        <div className="send-v2__asset-dropdown">
          {this.renderSendToken()}
          {
          /* {this.state.sendableTokens.length > 0
           ? this.renderAssetDropdown()
           : null} */
        }
        </div>
      </div>;
  }

  renderSendToken() {
    const {
      sendAssetAddress
    } = this.props;
    const token = this.props.tokens.find(({
      address
    }) => address === sendAssetAddress);
    return <div className="send-v2__asset-dropdown__input-wrapper" onClick={this.openDropdown}>
        {token ? this.renderAsset(token) : this.renderNativeCurrency()}
      </div>;
  }

  renderAssetDropdown() {
    return this.state.isShowingDropdown && <div>
          <div className="send-v2__asset-dropdown__close-area" onClick={this.closeDropdown} />
          <div className="send-v2__asset-dropdown__list">
            {this.renderNativeCurrency(true)}
            {this.state.sendableTokens.map(token => this.renderAsset(token, true))}
          </div>
        </div>;
  }

  renderNativeCurrency(insideDropdown = false) {
    const {
      t
    } = this.context;
    const {
      chainId,
      accounts,
      selectedAddress,
      nativeCurrency,
      nativeCurrencyImage,
      changeChain,
      isInternalTrans,
      onAmountChange
    } = this.props;
    const balanceValue = accounts[selectedAddress] ? accounts[selectedAddress].balance : '';
    return <div className={this.state.sendableTokens.length > 0 ? 'send-v2__asset-dropdown__asset' : 'send-v2__asset-dropdown__single-asset'} // onClick={() => this.selectToken(ASSET_TYPES.NATIVE)}
    >
        <div className="send-v2__asset-dropdown__asset-icon">
          <div className="send-v2__asset-dropdown__icon-name">
            <div>
              <TokenImage address={zeroAddress()} symbol={nativeCurrency} size={40} showLetter />
              {
              /* <Identicon
               diameter={insideDropdown ? 30 : 40}
               image={nativeCurrencyImage}
               address={nativeCurrency}
              /> */
            }
              <div className="send-v2__asset-dropdown__symbol">
                <div title={nativeCurrency}>{nativeCurrency}</div>
                <AccountSwitcher address={selectedAddress} onChange={this.accountChange} needOutSide={false} />
                {
                /* {!insideDropdown && (
                <span className="send-v2__asset-dropdown__switch-token"></span>
                )} */
              }
              </div>
            </div>
            <ChainSwitcher currentChainId={chainId || '0'} onChange={(type, changedChainId, isRpc, chainInfo) => {
            changeChain(type, changedChainId, isRpc, chainInfo, isInternalTrans ? false : true);
          }} />
          </div>
        </div>
        {!isInternalTrans && <div className="send-v2__asset-dropdown__asset-data">
            <div className="send-v2__asset-dropdown__name">
              <SendCardAmountInput accountVal={balanceValue} isNativeCurrency={true} onAmountChange={onAmountChange} />
              {
            /* <UserPreferencedCurrencyDisplay
             numberOfDecimals={3}
             value={balanceValue}
             type={PRIMARY}
            /> */
          }
            </div>
          </div>}
        {!insideDropdown && <div className="send-v2__asset-dropdown__asset-data-max">
            <div className="send-v2__asset-dropdown__name">
              {isInternalTrans ? t('balance') : t('max')}:{' '}
              <UserPreferencedCurrencyDisplay value={balanceValue} type={PRIMARY} />
            </div>
          </div>}
      </div>;
  }

  renderAsset(token, insideDropdown = false) {
    const {
      address,
      symbol
    } = token;
    const {
      t
    } = this.context;
    const {
      selectedAddress,
      chainId,
      assetImages,
      changeChain,
      isInternalTrans,
      onAmountChange
    } = this.props;
    return <div key={address} className="send-v2__asset-dropdown__asset" // onClick={() => this.selectToken(ASSET_TYPES.TOKEN, token)}
    >
        <div className="send-v2__asset-dropdown__asset-icon">
          <div className="send-v2__asset-dropdown__icon-name">
            <div>
              <TokenImage address={address} symbol={symbol} size={40} showLetter />
              {
              /* <Identicon
               address={address}
               diameter={insideDropdown ? 30 : 40}
               image={assetImages[address]}
              /> */
            }
              <div className="send-v2__asset-dropdown__symbol">
                <div title={symbol}>{symbol}</div>
                <AccountSwitcher address={selectedAddress} onChange={this.accountChange} needOutSide={false} />
                {
                /* {!insideDropdown && (
                <span className="send-v2__asset-dropdown__switch-token"></span>
                )} */
              }
              </div>
            </div>
            <ChainSwitcher currentChainId={chainId || '0'} onChange={(type, changedChainId, isRpc, chainInfo) => {
            changeChain(type, changedChainId, isRpc, chainInfo, isInternalTrans ? false : true);
          }} />
          </div>
        </div>
        {!isInternalTrans && <div className="send-v2__asset-dropdown__asset-data">
            <div className="send-v2__asset-dropdown__name">
              <SendCardAmountInput token={token} onAmountChange={onAmountChange} accountAddress={selectedAddress} />
              {
            /* <TokenBalance numberOfDecimals={3} token={token} /> */
          }
            </div>
          </div>}
        {!insideDropdown && <div className="send-v2__asset-dropdown__asset-data-max">
            <div className="send-v2__asset-dropdown__name">
              {isInternalTrans ? t('balance') : t('max')}:{' '}
              <TokenBalance token={token} accountAddress={selectedAddress} />
            </div>
          </div>}
      </div>;
  }

}