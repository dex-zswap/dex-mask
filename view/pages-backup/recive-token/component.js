import React from 'react';
import { generatePath } from 'react-router-dom';
import copyToClipboard from 'copy-to-clipboard';
import { zeroAddress } from 'ethereumjs-util';
import PropTypes from 'prop-types';
import AccountSwitcher from '@c/ui/cross-chain/account-switcher';
import ChainSwitcher from '@c/ui/cross-chain/chain-switcher';
import CurrentToken from '@c/ui/cross-chain/current-token';
import CopyIcon from '@c/ui/icon/copy-icon.component';
import QrView from '@c/ui/qr-code';
import Tooltip from '@c/ui/tooltip';
import { SECOND } from '@shared/constants/time';
import { RECIVE_TOKEN_ROUTE } from '@view/helpers/constants/routes';
import { toBnString } from '@view/helpers/utils/conversions.util';

class ReciveToken extends React.Component {
  static contextTypes = {
    t: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      from: {
        account: 'out-side-address'
      },
      to: {},
      coinAddress: '',
      copied: false
    };
  }

  componentDidMount() {
    this.copyTimeout = null;
    const {
      selectedAccount,
      allState: {
        metamask: {
          provider
        }
      },
      match: {
        params: {
          address: coinAddress
        }
      }
    } = this.props;
    this.setState({
      from: {
        chainId: provider.chainId,
        chainType: provider.type,
        account: 'out-side-address'
      },
      to: {
        chainId: provider.chainId,
        chainType: provider.type,
        account: selectedAccount.address
      },
      coinAddress
    });
  }

  async accountChange(type, account) {
    const {
      history,
      tokens,
      updateSendAsset,
      updateRecipient
    } = this.props;
    const {
      from,
      to,
      coinAddress
    } = this.state;
    const isNative = coinAddress === zeroAddress();
    const token = tokens.find(({
      address
    }) => address === coinAddress);
    this.setState({
      [type]: { ...this.state[type],
        account: account.address
      }
    });
  }

  async chainChange(type, chainType, chainId, isRpc, chainInfo) {
    const {
      from
    } = this.state;
    const {
      currentChainId
    } = this.props;
    const finalChainId = isRpc ? chainType : chainId;

    if (toBnString(finalChainId) !== toBnString(currentChainId)) {
      if (isRpc) {
        this.props.setRpcTarget(chainId.rpcUrl, chainId.chainId, chainId.ticker, chainId.nickname);
      } else {
        this.props.setProviderType(chainType);
      }

      this.props.history.replace(generatePath(RECIVE_TOKEN_ROUTE, {
        address: zeroAddress()
      }));
    }

    if (from.account === 'out-side-address') {
      this.setState({
        from: { ...this.state.from,
          chainType,
          chainId: finalChainId
        },
        to: { ...this.state.to,
          chainType,
          chainId: finalChainId
        }
      });
      return;
    }

    this.setState({
      [type]: { ...this.state[type],
        chainType,
        chainId: finalChainId
      }
    });
  }

  tokenChange(token) {
    this.setState({
      coinAddress: token.address
    });
  }

  render() {
    const {
      from,
      to,
      coinAddress
    } = this.state;
    const isDifferentChain = from.chainId !== to.chainId;
    return <div className="recive-token__wrapper">
        <div>
          <div className="recive-token__from">
            <CurrentToken coinAddress={coinAddress} diameter={40} currentChainId={from.chainId} onChange={token => this.tokenChange(token)} selectable>
              <AccountSwitcher needOutSide={true} address={from.account} onChange={account => this.accountChange('from', account)} />
            </CurrentToken>
            <ChainSwitcher currentChainId={from.chainId} onChange={(type, chainId, isRpc, chainInfo) => this.chainChange('from', type, chainId, isRpc, chainInfo)} />
          </div>
          <div className={['recive-token__bridge-info', isDifferentChain && 'diffrent-chain'].join(' ')}>
            <div>
              {isDifferentChain && <div className="recive-token__bridge">
                  {this.context.t('dexBridge')}
                </div>}
              <div className="recive-token__bridge-arrow"></div>
            </div>
          </div>
          <div className="recive-token__to">
            <div className="recive-token__to-top">
              <CurrentToken coinAddress={coinAddress} diameter={40} currentChainId={to.chainId}>
                <AccountSwitcher address={to.account} onChange={account => this.accountChange('to', account)} />
              </CurrentToken>
              <ChainSwitcher currentChainId={to.chainId} onChange={(type, chainId, isRpc, chainInfo) => this.chainChange('to', type, chainId, isRpc, chainInfo)} />
            </div>
            {to.account && <div className="recive-token__qr-code">
                <QrView hiddenAddress={true} cellWidth={5} darkColor="#fff" lightColor="transparent" Qr={{
              data: to.account
            }} />
                <Tooltip wrapperClassName="selected-account__tooltip-wrapper" position="bottom" title={this.state.copied ? this.context.t('copiedExclamation') : this.context.t('copyToClipboard')}>
                  <p className="recive-token__qr_address" onClick={() => {
                this.setState({
                  copied: true
                });
                this.copyTimeout = setTimeout(() => this.setState({
                  copied: false
                }), SECOND * 3);
                copyToClipboard(to.account);
              }}>
                    {to.account}
                    <span className="copy">
                      <CopyIcon size={11} color="#fff" />
                    </span>
                  </p>
                </Tooltip>
              </div>}
          </div>
        </div>
      </div>;
  }

}

export default ReciveToken;