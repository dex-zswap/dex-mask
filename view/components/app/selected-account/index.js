import React, {
  useContext,
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useSelector } from 'react-redux';
import copyToClipboard from 'copy-to-clipboard';
import { ethers } from 'ethers';
import { I18nContext } from '@view/contexts/i18n';
import AccountOptionsMenu from '@c/app/account-options-menu';
import TokenImage from '@c/ui/token-image';
import Tooltip from '@c/ui/tooltip';
import { SECOND } from '@shared/constants/time';
import { toChecksumHexAddress } from '@shared/modules/hexstring-utils';
import { shortenAddress } from '@view/helpers/utils';
import { getNativeCurrency } from '@reducer/dexmask/dexmask';
import { PRIMARY, SECONDARY } from '@view/helpers/constants/common';
import { useUserPreferencedCurrency } from '@view/hooks/useUserPreferencedCurrency';
import { useCurrencyDisplay } from '@view/hooks/useCurrencyDisplay';
import { getSelectedAccount, getSelectedIdentity } from '@view/selectors';
export default function SelectedAccount() {
  const t = useContext(I18nContext);
  const selectedIdentity = useSelector(getSelectedIdentity);
  const selectedAccount = useSelector(getSelectedAccount);
  const nativeCurrency = useSelector(getNativeCurrency);
  const [state, setState] = useState({
    copied: false,
    accountOptionsMenuOpen: false,
  });
  const copyTimeout = useRef(null);
  const dropTrigger = useRef(null);
  const { balance } = selectedAccount;
  const {
    currency: primaryCurrency,
    numberOfDecimals: primaryNumberOfDecimals,
  } = useUserPreferencedCurrency(PRIMARY, {
    ethNumberOfDecimals: 4,
  });
  const {
    currency: secondaryCurrency,
    numberOfDecimals: secondaryNumberOfDecimals,
  } = useUserPreferencedCurrency(SECONDARY, {
    ethNumberOfDecimals: 4,
  });
  const [, primaryCurrencyProperties] = useCurrencyDisplay(balance, {
    numberOfDecimals: primaryNumberOfDecimals,
    currency: primaryCurrency,
  });
  const [
    secondaryCurrencyDisplay,
    secondaryCurrencyProperties,
  ] = useCurrencyDisplay(balance, {
    numberOfDecimals: secondaryNumberOfDecimals,
    currency: secondaryCurrency,
  });
  const checksummedAddress = useMemo(
    () => toChecksumHexAddress(selectedIdentity.address),
    [selectedIdentity.address],
  );
  const copyAddress = useCallback(() => {
    setState((state) =>
      Object.assign({}, state, {
        copied: true,
      }),
    );
    copyTimeout.current = setTimeout(
      () =>
        setState((state) =>
          Object.assign({}, state, {
            copied: false,
          }),
        ),
      SECOND * 3,
    );
    copyToClipboard(checksummedAddress);
  }, [checksummedAddress, copyToClipboard, copyTimeout.current, state.copied]);
  const toggleAccountDrop = useCallback(() => {
    setState((state) =>
      Object.assign({}, state, {
        accountOptionsMenuOpen: !state.accountOptionsMenuOpen,
      }),
    );
  }, []);
  useEffect(() => {
    if (copyTimeout.current) {
      window.clearTimeout(copyTimeout.current);
    }
  }, [copyTimeout.current]);
  return (
    <>
      {state.accountOptionsMenuOpen && (
        <AccountOptionsMenu
          anchorElement={dropTrigger.current}
          onClose={toggleAccountDrop}
        />
      )}
      <div className="selected-account base-width">
        <div className="account-address flex space-between items-center">
          <div className="account flex items-center">
            {selectedIdentity.name}
            <div
              className="drop-trigger"
              onClick={toggleAccountDrop}
              ref={(el) => (dropTrigger.current = el)}
            ></div>
          </div>
          <Tooltip
            wrapperClassName="selected-account__tooltip-wrapper"
            position="top"
            title={state.copied ? t('copiedExclamation') : t('copyToClipboard')}
          >
            <div className="address flex items-center" onClick={copyAddress}>
              {shortenAddress(checksummedAddress)}
              <div className="copy-icon"></div>
            </div>
          </Tooltip>
        </div>
        <div className="native-currency flex space-between items-center">
          <div className="native-currency-balance">
            <div className="token-balance">
              {primaryCurrencyProperties.value}{' '}
              {primaryCurrencyProperties.suffix}
            </div>
            <div className="token-usd">
              {secondaryCurrencyProperties.value}{' '}
              {secondaryCurrencyProperties.suffix}
            </div>
          </div>
          <TokenImage
            symbol={nativeCurrency}
            address={ethers.constants.AddressZero}
            size={48}
          />
        </div>
      </div>
    </>
  );
}
