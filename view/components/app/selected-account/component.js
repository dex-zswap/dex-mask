import React, { useContext, useRef } from 'react';
import { ethers } from 'ethers';
import copyToClipboard from 'copy-to-clipboard';

import AccountOptionsMenu from '@c/app/menu-bar/account-options-menu';
import UserPreferencedCurrencyDisplay from '@c/app/user-preferenced/currency-display';
import CopyIcon from '@c/ui/icon/copy-icon.component';
import TokenImage from '@c/ui/token-image';
import Tooltip from '@c/ui/tooltip';
import { SECOND } from '@shared/constants/time';
import { toChecksumHexAddress } from '@shared/modules/hexstring-utils';
import { shortenAddress } from '@view/helpers/utils';

class SelectedAccount extends Component {
  state = {
    copied: false,
    accountOptionsMenuOpen: false,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  static propTypes = {
    selectedIdentity: PropTypes.object.isRequired,
    selectedAccount: PropTypes.object.isRequired,
    nativeCurrencyImage: PropTypes.string.isRequired,
    nativeCurrency: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.dropTrigger = React.createRef();
  }

  componentDidMount() {
    this.copyTimeout = null;
  }

  componentWillUnmount() {
    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout);
      this.copyTimeout = null;
    }
  }

  toggleAccountMenu = () => {
    this.setState(({ accountOptionsMenuOpen }) => ({
      accountOptionsMenuOpen: !accountOptionsMenuOpen,
    }));
  };

  render() {
    const { t } = this.context;
    const {
      selectedIdentity,
      selectedAccount,
      nativeCurrencyImage,
      nativeCurrency,
    } = this.props;
    const { balance } = selectedAccount;
    const checksummedAddress = toChecksumHexAddress(selectedIdentity.address);

    return (
      <div className="selected-account">
        {this.state.accountOptionsMenuOpen && (
          <AccountOptionsMenu
            anchorElement={this.dropTrigger}
            onClose={this.toggleAccountMenu}
          />
        )}
        <div className="selected-account__wrapper">
          <div className="selected-account__top-part">
            <div className="selected-account__left">
              <div className="selected-account__name-address">
                <div className="selected-account__name">
                  {selectedIdentity.name}
                </div>
                <div
                  className="selected-account__dropdown-trigger"
                  onClick={this.toggleAccountMenu}
                  ref={(element) => (this.dropTrigger = element)}
                ></div>
              </div>
              <Tooltip
                wrapperClassName="selected-account__tooltip-wrapper"
                position="bottom"
                title={
                  this.state.copied
                    ? t('copiedExclamation')
                    : t('copyToClipboard')
                }
              >
                <div
                  className="selected-account__address"
                  onClick={() => {
                    this.setState({ copied: true });
                    this.copyTimeout = setTimeout(
                      () => this.setState({ copied: false }),
                      SECOND * 3,
                    );
                    copyToClipboard(checksummedAddress);
                  }}
                >
                  {shortenAddress(checksummedAddress)}
                  <div className="selected-account__copy">
                    <CopyIcon size={11} color="#989a9b" />
                  </div>
                </div>
              </Tooltip>
            </div>
            <div className="selected-account__right-eth">
              <div className="selected-account__eth-icon">
                <TokenImage
                  symbol={nativeCurrency}
                  address={ethers.constants.AddressZero}
                  size={39}
                />
              </div>
            </div>
          </div>
          <div className="selected-account__main-assets">
            <UserPreferencedCurrencyDisplay
              value={balance}
              suffix={nativeCurrency}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default SelectedAccount;
