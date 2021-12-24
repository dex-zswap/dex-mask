import SendTokenInput from '@c/app/send-token-input';
import EnsInput from '@pages/send/send-content/add-recipient/ens-input';
import { useI18nContext } from '@view/hooks/useI18nContext';
import { showQrScanner } from '@view/store/actions';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

export default function SendAddressInput({
  accountAddress,
  changeAccount,
  onChange,
  userInput,
  onValidAddressTyped,
  internalSearch,
  selectedAddress,
  selectedName,
  onPaste,
  onReset,
  toggleCheck,
}) {
  const t = useI18nContext();
  const dispatch = useDispatch();
  const [isInWalletTrans, setIsInWalletTrans] = useState(false);

  return (
    <div className="base-width">
      {isInWalletTrans ? (
        <SendTokenInput
          accountAddress={accountAddress}
          changeAccount={changeAccount}
          showAmountWrap={false}
        />
      ) : (
        <EnsInput
          userInput={userInput}
          onChange={onChange}
          onValidAddressTyped={onValidAddressTyped}
          internalSearch={internalSearch}
          selectedAddress={selectedAddress}
          selectedName={selectedName}
          onPaste={onPaste}
          onReset={onReset}
          scanQrCode={() => {
            dispatch(showQrScanner());
          }}
        />
      )}
      <div
        className="in-wallet-wrap"
        onClick={() => {
          toggleCheck && toggleCheck(!isInWalletTrans);
          setIsInWalletTrans((pre) => !pre);
        }}
      >
        <div className={isInWalletTrans ? 'checked' : ''}>
          {isInWalletTrans && <img width={8} src="images/icons/checked.png" />}
        </div>
        <div>{t('dex_trans')}</div>
      </div>
    </div>
  );
}
