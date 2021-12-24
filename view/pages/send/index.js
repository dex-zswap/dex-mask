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
  initializeSendState,
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
import { getDexMaskAccounts, getSelectedAddress } from '@view/selectors';
import { showQrScanner } from '@view/store/actions';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import EnsInput from './send-content/add-recipient/ens-input';
import SendFooter from './send-footer';

export default function SendTransactionScreen() {
  const t = useI18nContext();
  const dispatch = useDispatch();
  const history = useHistory();
  const accounts = useSelector(getDexMaskAccounts);
  const isUsingMyAccountsForRecipientSearch = useSelector(
    getIsUsingMyAccountForRecipientSearch,
  );
  const recipient = useSelector(getRecipient);
  const userInput = useSelector(getRecipientUserInput);
  const location = useLocation();
  const selectedAddress = useSelector(getSelectedAddress);
  const [checked, setChecked] = useState(false);
  const [toAccountAddress, setToAccountAddress] = useState('');

  const changeToAccountAddressData = useCallback((address) => {
    dispatch(updateRecipientUserInput(address));
    dispatch(
      updateRecipient({
        address,
        nickname: '',
      }),
    );
  }, []);
  const changeToAccountAddress = useCallback(
    (address) => {
      setToAccountAddress(address);
      changeToAccountAddressData(address || selectedAddress);
    },
    [changeToAccountAddressData],
  );

  useEffect(() => {
    dispatch(initializeSendState());
  }, []);

  useEffect(() => {
    if (checked) {
      changeToAccountAddressData();
    }
  }, [checked, changeToAccountAddressData]);

  const onAmountChange = useCallback((val) => {
    // dispatch(
    //   updateSendHexData(
    //     ethers.BigNumber.from(expandDecimals(val)).toHexString(),
    //   ),
    // );
    dispatch(
      updateSendAmount(
        ethers.BigNumber.from(expandDecimals(val || 0)).toHexString(),
      ),
    );
  }, []);

  const cleanup = useCallback(() => {
    dispatch(resetSendState());
  }, []);

  useEffect(() => {
    if (location.search === '?scan=true') {
      dispatch(showQrScanner()); // Clear the queryString param after showing the modal

      const cleanUrl = window.location.href.split('?')[0];
      window.history.pushState({}, null, `${cleanUrl}`);
      window.location.hash = '#send';
    }
  }, [location, dispatch]);

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

  return (
    <div className="dex-page-container">
      <TopHeader />
      <BackBar
        title={t('sendToken')}
        backCb={() => dispatch(resetSendState())}
      />
      <SendTokenInput
        tokenAddress={sendAssetAddress}
        maxSendAmount={maxSendAmount}
        changeToken={changeToken}
        changeAmount={changeAmount}
      />
      <EnsInput
        userInput={userInput}
        className="send__to-row"
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
        scanQrCode={() => {
          dispatch(showQrScanner());
        }}
      />
      <SendFooter key="send-footer" history={history} />
    </div>
  );
}
