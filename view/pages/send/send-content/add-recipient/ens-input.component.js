import Identicon from '@c/ui/identicon';
import { ellipsify } from '@pages/send/utils';
import {
  MAINNET_DISPLAY_NAME,
  NETWORK_TO_NAME_MAP,
  NETWORK_TYPE_TO_ID_MAP,
} from '@shared/constants/network';
import {
  isBurnAddress,
  isValidHexAddress,
} from '@shared/modules/hexstring-utils';
import { isValidDomainName } from '@view/helpers/utils';
import { toBnString } from '@view/helpers/utils/conversions.util';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class EnsInput extends Component {
  static contextTypes = {
    t: PropTypes.func,
  };

  static propTypes = {
    chainId: PropTypes.string,
    className: PropTypes.string,
    selectedAddress: PropTypes.string,
    selectedName: PropTypes.string,
    scanQrCode: PropTypes.func,
    onPaste: PropTypes.func,
    onValidAddressTyped: PropTypes.func,
    internalSearch: PropTypes.bool,
    userInput: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    lookupEnsName: PropTypes.func.isRequired,
    initializeEnsSlice: PropTypes.func.isRequired,
    resetEnsResolution: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.initializeEnsSlice();
  }

  onPaste = (event) => {
    event.clipboardData.items[0].getAsString((text) => {
      const input = text.trim();
      if (
        !isBurnAddress(input) &&
        isValidHexAddress(input, { mixedCaseUseChecksum: true })
      ) {
        this.props.onPaste(input);
      }
    });
  };

  onChange = ({ target: { value } }) => {
    const {
      onValidAddressTyped,
      internalSearch,
      onChange,
      lookupEnsName,
      resetEnsResolution,
    } = this.props;
    const input = value.trim();

    onChange(input);
    if (internalSearch) {
      return null;
    }
    // Empty ENS state if input is empty
    // maybe scan ENS
    if (isValidDomainName(input)) {
      lookupEnsName(input);
    } else {
      resetEnsResolution();
      if (
        onValidAddressTyped &&
        !isBurnAddress(input) &&
        isValidHexAddress(input, { mixedCaseUseChecksum: true })
      ) {
        onValidAddressTyped(input);
      }
    }

    return null;
  };

  render() {
    const { t } = this.context;
    const {
      chainId,
      className,
      selectedAddress,
      selectedName,
      userInput,
    } = this.props;

    const bnStrChainId = toBnString(chainId);
    const hasSelectedAddress = Boolean(selectedAddress);

    return (
      <div className={classnames('ens-input', className)}>
        <div
          className={classnames('ens-input__wrapper', {
            'ens-input__wrapper__status-icon--error': false,
            'ens-input__wrapper__status-icon--valid': false,
            'ens-input__wrapper--valid': hasSelectedAddress,
          })}
        >
          <div
            className={classnames('ens-input__wrapper__status-icon', {
              'ens-input__wrapper__status-icon--valid': hasSelectedAddress,
            })}
          />
          {hasSelectedAddress ? (
            <>
              <div className="ens-input__wrapper__input ens-input__wrapper__input--selected">
                <Identicon address={selectedAddress} diameter={28} />
                <div>
                  <div className="ens-input__selected-input__title">
                    {selectedName || ellipsify(selectedAddress, 14, 6)}
                  </div>
                  {selectedName && (
                    <div className="ens-input__selected-input__subtitle">
                      {ellipsify(selectedAddress, 14, 6)}
                    </div>
                  )}
                </div>
              </div>
              <div
                className="ens-input__wrapper__action-icon ens-input__wrapper__action-icon--erase"
                onClick={this.props.onReset}
              />
            </>
          ) : (
            <>
              <input
                className="ens-input__wrapper__input"
                type="text"
                dir="auto"
                placeholder={t('recipientAddressPlaceholder2')}
                onChange={this.onChange}
                onPaste={this.onPaste}
                value={selectedAddress || userInput}
                autoFocus
                data-testid="ens-input"
              />
              <button
                className={classnames('ens-input__wrapper__action-icon', {
                  'ens-input__wrapper__action-icon--erase': userInput,
                  'ens-input__wrapper__action-icon--qrcode': !userInput,
                })}
                onClick={() => {
                  if (userInput) {
                    this.props.onReset();
                  } else {
                    this.props.scanQrCode();
                  }
                }}
              />
            </>
          )}
        </div>
      </div>
    );
  }
}
