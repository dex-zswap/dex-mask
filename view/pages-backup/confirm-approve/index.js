import EditGasPopover from '@c/app/edit-gas/popover';
import Loading from '@c/ui/loading-screen';
import ConfirmTransactionBase from '@pages/confirm-transaction-base';
import { getNativeCurrency, getTokens } from '@reducer/dexmask/dexmask';
import { currentNetworkTxListSelector } from '@selectors/transactions';
import { EDIT_GAS_MODES } from '@shared/constants/gas';
import {
  calcTokenAmount,
  getTokenAddressParam,
  getTokenValueParam,
} from '@view/helpers/utils/token-util';
import { getTokenData } from '@view/helpers/utils/transactions.util';
import { useApproveTransaction } from '@view/hooks/useApproveTransaction';
import { useTokenTracker } from '@view/hooks/useTokenTracker';
import {
  getCurrentCurrency,
  getCustomNonceValue,
  getDomainMetadata,
  getNextSuggestedNonce,
  getUseNonceField,
  transactionFeeSelector,
  txDataSelector,
} from '@view/selectors';
import {
  getNextNonce,
  showModal,
  updateCustomNonce,
} from '@view/store/actions';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ConfirmApproveContent from './confirm-approve-content';
import { getCustomTxParamsData } from './util';

export default function ConfirmApprove() {
  const dispatch = useDispatch();
  const { id: paramsTransactionId } = useParams();
  const {
    id: transactionId,
    txParams: { to: tokenAddress, data } = {},
  } = useSelector(txDataSelector);

  const currentCurrency = useSelector(getCurrentCurrency);
  const nativeCurrency = useSelector(getNativeCurrency);
  const currentNetworkTxList = useSelector(currentNetworkTxListSelector);
  const domainMetadata = useSelector(getDomainMetadata);
  const tokens = useSelector(getTokens);
  const useNonceField = useSelector(getUseNonceField);
  const nextNonce = useSelector(getNextSuggestedNonce);
  const customNonceValue = useSelector(getCustomNonceValue);

  const transaction =
    currentNetworkTxList.find(
      ({ id }) => id === (Number(paramsTransactionId) || transactionId),
    ) || {};
  const { ethTransactionTotal, fiatTransactionTotal } = useSelector((state) =>
    transactionFeeSelector(state, transaction),
  );

  const currentToken = (tokens &&
    tokens.find(({ address }) => tokenAddress === address)) || {
    address: tokenAddress,
  };

  const { tokensWithBalances } = useTokenTracker([currentToken]);
  const tokenTrackerBalance = tokensWithBalances[0]?.balance || '';

  const tokenSymbol = currentToken?.symbol;
  const decimals = Number(currentToken?.decimals);
  const tokenData = getTokenData(data);
  const tokenValue = getTokenValueParam(tokenData);
  const toAddress = getTokenAddressParam(tokenData);
  const tokenAmount =
    tokenData && calcTokenAmount(tokenValue, decimals).toString(10);

  const [customPermissionAmount, setCustomPermissionAmount] = useState('');

  const previousTokenAmount = useRef(tokenAmount);

  const {
    approveTransaction,
    showCustomizeGasPopover,
    closeCustomizeGasPopover,
  } = useApproveTransaction();

  useEffect(() => {
    if (customPermissionAmount && previousTokenAmount.current !== tokenAmount) {
      setCustomPermissionAmount(tokenAmount);
    }
    previousTokenAmount.current = tokenAmount;
  }, [customPermissionAmount, tokenAmount]);

  const [submitWarning, setSubmitWarning] = useState('');
  const prevNonce = useRef(nextNonce);
  const prevCustomNonce = useRef(customNonceValue);
  useEffect(() => {
    if (
      prevNonce.current !== nextNonce ||
      prevCustomNonce.current !== customNonceValue
    ) {
      if (nextNonce !== null && customNonceValue > nextNonce) {
        setSubmitWarning(
          `Nonce is higher than suggested nonce of ${nextNonce}`,
        );
      } else {
        setSubmitWarning('');
      }
    }
    prevCustomNonce.current = customNonceValue;
    prevNonce.current = nextNonce;
  }, [customNonceValue, nextNonce]);
  const { origin } = transaction;
  const formattedOrigin = origin
    ? origin === 'metamask'
      ? 'DexMask'
      : origin[0].toUpperCase() + origin.slice(1)
    : '';

  const { icon: siteImage = '' } = domainMetadata[origin] || {};

  const tokensText = `${Number(tokenAmount)} ${tokenSymbol}`;
  const tokenBalance = tokenTrackerBalance
    ? calcTokenAmount(tokenTrackerBalance, decimals).toString(10)
    : '';
  const customData = customPermissionAmount
    ? getCustomTxParamsData(data, { customPermissionAmount, decimals })
    : null;

  return tokenSymbol === undefined ? (
    <Loading />
  ) : (
    <ConfirmTransactionBase
      toAddress={toAddress}
      identiconAddress={tokenAddress}
      showAccountInHeader
      title={tokensText}
      contentComponent={
        <>
          <ConfirmApproveContent
            decimals={decimals}
            siteImage={siteImage}
            setCustomAmount={setCustomPermissionAmount}
            customTokenAmount={String(customPermissionAmount)}
            tokenAmount={tokenAmount}
            origin={formattedOrigin}
            tokenSymbol={tokenSymbol}
            tokenBalance={tokenBalance}
            showCustomizeGasModal={approveTransaction}
            showEditApprovalPermissionModal={({
              /* eslint-disable no-shadow */
              customTokenAmount,
              decimals,
              origin,
              setCustomAmount,
              tokenAmount,
              tokenBalance,
              tokenSymbol,
              /* eslint-enable no-shadow */
            }) =>
              dispatch(
                showModal({
                  name: 'EDIT_APPROVAL_PERMISSION',
                  customTokenAmount,
                  decimals,
                  origin,
                  setCustomAmount,
                  tokenAmount,
                  tokenBalance,
                  tokenSymbol,
                }),
              )
            }
            data={customData || data}
            toAddress={toAddress}
            currentCurrency={currentCurrency}
            nativeCurrency={nativeCurrency}
            ethTransactionTotal={ethTransactionTotal}
            fiatTransactionTotal={fiatTransactionTotal}
            useNonceField={useNonceField}
            nextNonce={nextNonce}
            customNonceValue={customNonceValue}
            updateCustomNonce={(value) => {
              dispatch(updateCustomNonce(value));
            }}
            getNextNonce={() => dispatch(getNextNonce())}
            showCustomizeNonceModal={({
              /* eslint-disable no-shadow */
              useNonceField,
              nextNonce,
              customNonceValue,
              updateCustomNonce,
              getNextNonce,
              /* eslint-disable no-shadow */
            }) =>
              dispatch(
                showModal({
                  name: 'CUSTOMIZE_NONCE',
                  useNonceField,
                  nextNonce,
                  customNonceValue,
                  updateCustomNonce,
                  getNextNonce,
                }),
              )
            }
            warning={submitWarning}
          />
          {showCustomizeGasPopover && (
            <EditGasPopover
              onClose={closeCustomizeGasPopover}
              mode={EDIT_GAS_MODES.MODIFY_IN_PLACE}
              transaction={transaction}
            />
          )}
        </>
      }
      hideSenderToRecipient
      customTxParamsData={customData}
    />
  );
}