import SendAddressInput from '@c/app/send-address-input';
import SendTokenInput from '@c/app/send-token-input';
import BackBar from '@c/ui/back-bar';
import TopHeader from '@c/ui/top-header';
import {
  ASSET_TYPES,
  getIsUsingMyAccountForRecipientSearch,
  getMaxSendAmount,
  getRecipient,
  getRecipientUserInput,
  getSendAssetAddress,
  resetRecipientInput,
  resetSendState,
  updateRecipient,
  updateRecipientUserInput,
  updateSendAmount,
  updateSendAsset,
} from '@reducer/send';
import {
  expandDecimals,
  hexToString,
} from '@view/helpers/utils/conversions.util';
import { useI18nContext } from '@view/hooks/useI18nContext';
import { getSelectedAddress } from '@view/selectors';
import { showQrScanner } from '@view/store/actions';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import SendFooter from './send-footer';

export default function SendTransactionScreen() {
  const t = useI18nContext();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const selectedAddress = useSelector(getSelectedAddress);
  const isUsingMyAccountsForRecipientSearch = useSelector(
    getIsUsingMyAccountForRecipientSearch,
  );
  const recipient = useSelector(getRecipient);
  const userInput = useSelector(getRecipientUserInput);
  const [sendToAccountAddress, setSendToAccountAddress] = useState(
    selectedAddress,
  );

  const sendAssetAddress = useSelector(getSendAssetAddress);

  const maxSendAmountHex = useSelector(getMaxSendAmount);

  const maxSendAmount = useMemo(
    () => new BigNumber(hexToString(`0x${maxSendAmountHex}`)).toString(),
    [maxSendAmountHex],
  );

  const changeToken = useCallback(
    ({ address, symbol, isNativeCurrency, decimals = 18 }) => {
      dispatch(
        updateSendAsset({
          type: isNativeCurrency ? ASSET_TYPES.NATIVE : ASSET_TYPES.TOKEN,
          details: isNativeCurrency ? null : { address, symbol, decimals },
        }),
      );
    },
    [],
  );

  const changeAmount = useCallback((val) => {
    dispatch(
      updateSendAmount(
        ethers.BigNumber.from(expandDecimals(val || 0)).toHexString(),
      ),
    );
  }, []);

  const changeSendToAccountAddress = useCallback((address) => {
    setSendToAccountAddress(address);
    dispatch(updateRecipientUserInput(address));
    dispatch(updateRecipient({ address, nickname: '' }));
  }, []);

  const toggleCheck = useCallback(
    (checked) => {
      if (checked) {
        changeSendToAccountAddress(selectedAddress);
      } else {
        changeSendToAccountAddress('');
      }
    },
    [changeSendToAccountAddress, selectedAddress],
  );

  const cleanup = useCallback(() => {
    dispatch(resetSendState());
  }, []);

  useEffect(() => {
    if (location.search === '?scan=true') {
      dispatch(showQrScanner());
      const cleanUrl = window.location.href.split('?')[0];
      window.history.pushState({}, null, `${cleanUrl}`);
      window.location.hash = '#send';
    }
    return () => {
      cleanup();
    };
  }, [location]);

  return (
    <div className="dex-page-container flex space-between">
      <div>
        <TopHeader />
        <BackBar title={t('sendToken')} backCb={cleanup} />
        <SendTokenInput
          tokenAddress={sendAssetAddress}
          maxSendAmount={maxSendAmount}
          changeToken={changeToken}
          changeAmount={changeAmount}
        />
        <SendAddressInput
          accountAddress={sendToAccountAddress}
          changeAccount={({ address }) => {
            changeSendToAccountAddress(address);
          }}
          userInput={userInput}
          onChange={(address) => dispatch(updateRecipientUserInput(address))}
          onValidAddressTyped={(address) =>
            dispatch(
              updateRecipient({
                address,
                nickname: '',
              }),
            )
          }
          internalSearch={isUsingMyAccountsForRecipientSearch}
          selectedAddress={recipient.address}
          selectedName={recipient.nickname}
          onPaste={(text) =>
            updateRecipient({
              address: text,
              nickname: '',
            })
          }
          onReset={() => dispatch(resetRecipientInput())}
          toggleCheck={toggleCheck}
        />
      </div>
      <SendFooter history={history} />
    </div>
  );
}
