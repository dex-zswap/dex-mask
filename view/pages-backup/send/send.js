import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { zeroAddress } from 'ethereumjs-util';
import { ethers } from 'ethers';
import ChainSwitcher from '@c/ui/cross-chain/chain-switcher';
import {
  getNativeCurrency,
  getSendHexDataFeatureFlagState,
} from '@reducer/dexmask/dexmask';
import {
  getIsUsingMyAccountForRecipientSearch,
  getRecipient,
  getRecipientUserInput,
  getSendAsset,
  getSendAssetAddress,
  getSendStage,
  initializeSendState,
  resetRecipientInput,
  resetSendState,
  updateRecipient,
  updateRecipientUserInput,
  updateSendAmount,
} from '@reducer/send';
import { CROSSCHAIN_ROUTE } from '@view/helpers/constants/routes';
import { checkTokenBridge } from '@view/helpers/cross-chain-api';
import {
  expandDecimals,
  toBnString,
} from '@view/helpers/utils/conversions.util';
import { useI18nContext } from '@view/hooks/useI18nContext';
import {
  getCurrentChainId,
  getSelectedAddress,
  isCustomPriceExcessive,
} from '@view/selectors';
import {
  setProviderType,
  setRpcTarget,
  showQrScanner,
  updateCrossChainState,
} from '@view/store/actions';
import EnsInput from './send-content/add-recipient/ens-input';
import SendTokenInfo from './send-content/send-token-info';
import SendFooter from './send-footer';

const sendSliceIsCustomPriceExcessive = (state) =>
  isCustomPriceExcessive(state, true);

export default function SendTransactionScreen() {
  const t = useI18nContext();
  const dispatch = useDispatch();
  const history = useHistory();
  const chainId = useSelector(getCurrentChainId);
  const stage = useSelector(getSendStage);
  const tokenAddress = useSelector(getSendAssetAddress);
  const sendAsset = useSelector(getSendAsset);
  const nativeCurrency = useSelector(getNativeCurrency);
  const gasIsExcessive = useSelector(sendSliceIsCustomPriceExcessive);
  const isUsingMyAccountsForRecipientSearch = useSelector(
    getIsUsingMyAccountForRecipientSearch,
  );
  const recipient = useSelector(getRecipient);
  const showHexData = useSelector(getSendHexDataFeatureFlagState);
  const userInput = useSelector(getRecipientUserInput);
  const location = useLocation();
  const selectedAddress = useSelector(getSelectedAddress);
  const [checked, setChecked] = useState(false);
  const [fromAccountAddress, setFromAccountAddress] = useState('');
  const [toAccountAddress, setToAccountAddress] = useState('');
  const fromAddress = useMemo(() => fromAccountAddress || selectedAddress, [
    fromAccountAddress,
    selectedAddress,
  ]);
  const toAddress = useMemo(() => toAccountAddress || selectedAddress, [
    toAccountAddress,
    selectedAddress,
  ]);
  const changeFromAccountAddress = useCallback((address) => {
    setFromAccountAddress(address);
  }, []);
  const changeToAccountAddress = useCallback((address) => {
    setToAccountAddress(address);
    changeToAccountAddressData(checked ? '' : address || selectedAddress);
  }, []);
  const changeToAccountAddressData = useCallback((address) => {
    dispatch(updateRecipientUserInput(address));
    dispatch(
      updateRecipient({
        address,
        nickname: '',
      }),
    );
  }, []);
  const changeChain = useCallback(
    async (type, changedChainId, isRpc, chainInfo, changeFromChain = true) => {
      if (
        toBnString(isRpc ? changedChainId.chainId : changedChainId) ===
        toBnString(chainId)
      ) {
        return;
      }

      const fromChainId = changeFromChain ? changedChainId : chainId;
      const toChainId = changeFromChain ? chainId : changedChainId;

      const dispatchChainId = async () => {
        if (isRpc) {
          await dispatch(
            setRpcTarget(
              changedChainId.rpcUrl,
              changedChainId.chainId,
              changedChainId.ticker,
              changedChainId.nickname,
            ),
          );
        } else {
          await dispatch(setProviderType(type ?? changedChainId));
        }
      };

      const token_address = changeFromChain
        ? zeroAddress()
        : tokenAddress || zeroAddress();
      checkTokenBridge({
        meta_chain_id: toBnString(
          isRpc ? (changeFromChain ? type : chainId) : fromChainId,
        ),
        token_address,
      })
        .then((res) => res.json())
        .then(async (res) => {
          if (res?.c === 200 && res?.d?.length) {
            if (changeFromChain) {
              await dispatchChainId();
            }

            const targetChain = res.d.find(
              (d) =>
                toBnString(d.target_meta_chain_id) == toBnString(toChainId),
            );

            if (targetChain) {
              dispatch(
                updateCrossChainState({
                  isInternalTrans: checked,
                  coinAddress: token_address,
                  coinSymbol: sendAsset?.details?.symbol || nativeCurrency,
                  from: fromAddress,
                  dest: toAddress,
                  fromChain: fromChainId,
                  target: targetChain,
                  destChain: toChainId,
                  supportChains: [],
                  chainTokens: [],
                  targetCoinAddress: targetChain?.target_token_address,
                  targetCoinSymbol: targetChain?.target_token,
                }),
              );
              history.push(CROSSCHAIN_ROUTE);
            } else {
              await dispatchChainId();
            }
          } else {
            dispatchChainId(); // if (changeFromChain) {
            //   await dispatchChainId();
            // }
          }
        })
        .catch(() => {
          if (changeFromChain) {
            dispatchChainId();
          }
        });
    },
    [checked, tokenAddress, fromAddress, toAddress, chainId],
  );
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
  }, [dispatch]);
  useEffect(() => {
    if (chainId !== undefined) {
      dispatch(initializeSendState());
      window.addEventListener('beforeunload', cleanup);
    }
  }, [chainId, dispatch, cleanup]);
  useEffect(() => {
    if (location.search === '?scan=true') {
      dispatch(showQrScanner()); // Clear the queryString param after showing the modal

      const cleanUrl = window.location.href.split('?')[0];
      window.history.pushState({}, null, `${cleanUrl}`);
      window.location.hash = '#send';
    }
  }, [location, dispatch]);
  useEffect(() => {
    return () => {
      dispatch(resetSendState());
      window.removeEventListener('beforeunload', cleanup);
    };
  }, [dispatch, cleanup]); // let content;
  // if ([SEND_STAGES.EDIT, SEND_STAGES.DRAFT].includes(stage)) {
  //   content = (
  //     <>
  //       <SendContent
  //         showHexData={showHexData}
  //         gasIsExcessive={gasIsExcessive}
  //       />
  //       <SendFooter key="send-footer" history={history} />
  //     </>
  //   );
  // } else {
  //   content = <AddRecipient />;
  // }

  return (
    <div className="page-container">
      {/* <SendHeader history={history} /> */}
      <SendTokenInfo
        selectedAddress={fromAddress}
        chainId={chainId}
        changeChain={changeChain}
        changeFromAccountAddress={changeFromAccountAddress}
        onAmountChange={onAmountChange}
      />
      <div className="send-check-wrap">
        <div
          onClick={() => {
            setChecked((pre) => !pre);
            changeToAccountAddressData(checked ? '' : toAddress);
          }}
        >
          <img
            src={
              checked
                ? 'images/dex/send/checked.png'
                : 'images/dex/send/checkbox.png'
            }
            alt="checkbox"
          />
          <span>{t('dex_trans')}</span>
        </div>
        {!checked && (
          <ChainSwitcher
            currentChainId={chainId || '0'}
            onChange={(type, changedChainId, isRpc, chainInfo) => {
              changeChain(type, changedChainId, isRpc, chainInfo, false);
            }}
          />
        )}
      </div>
      {checked ? (
        <div className="send-token-info-wrap">
          <SendTokenInfo
            selectedAddress={toAddress}
            chainId={chainId}
            changeChain={changeChain}
            changeToAccountAddress={changeToAccountAddress}
            isInternalTrans={true}
          />
        </div>
      ) : (
        <EnsInput
          chainId={chainId}
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
      )}
      <SendFooter key="send-footer" history={history} />
      {/* {[SEND_STAGES.EDIT, SEND_STAGES.DRAFT].includes(stage) && (
      <SendFooter key="send-footer" history={history} />
      )} */}
    </div>
  );
}
