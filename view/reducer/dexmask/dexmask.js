import { addHexPrefix, isHexString } from 'ethereumjs-util';
import { ALERT_TYPES } from '@shared/constants/alerts';
import { GAS_ESTIMATE_TYPES } from '@shared/constants/gas';
import { NETWORK_TYPE_RPC } from '@shared/constants/network';
import { decGWEIToHexWEI } from '@view/helpers/utils/conversions.util';
import {
  accountsWithSendEtherInfoSelector,
  checkNetworkAndAccountSupports1559,
  getAddressBook,
} from '@view/selectors';
import * as actionConstants from '@view/store/actionConstants';
import { updateTransaction } from '@view/store/actions';
import { setCustomGasLimit, setCustomGasPrice } from '@reducer/gas/gas.duck';

export default function reduceDexmask(state = {}, action) {
  const dexmaskState = {
    isInitialized: false,
    isUnlocked: false,
    isAccountMenuOpen: false,
    identities: {},
    unapprovedTxs: {},
    frequentRpcList: [],
    addressBook: [],
    contractExchangeRates: {},
    tokens: [],
    pendingTokens: {},
    customNonceValue: '',
    useBlockie: false,
    featureFlags: {},
    welcomeScreenSeen: false,
    currentLocale: '',
    currentBlockGasLimit: '',
    preferences: {
      autoLockTimeLimit: undefined,
      showFiatInTestnets: true,
      useNativeCurrencyAsPrimaryCurrency: true,
    },
    firstTimeFlowType: null,
    completedOnboarding: false,
    knownMethodData: {},
    participateInMetaMetrics: null,
    nextNonce: null,
    conversionRate: null,
    nativeCurrency: 'ETH',
    confirmedAction: null,
    ...state,
  };

  switch (action.type) {
    case actionConstants.UPDATE_DEXMASK_STATE:
      return { ...dexmaskState, ...action.value };

    case actionConstants.UPDATE_CONFIRM_ACTION:
      return { ...dexmaskState, confirmedAction: action.value };

    case actionConstants.LOCK_DEXMASK:
      return {
        ...dexmaskState,
        isUnlocked: false,
      };

    case actionConstants.SET_RPC_TARGET:
      return {
        ...dexmaskState,
        provider: {
          type: NETWORK_TYPE_RPC,
          rpcUrl: action.value,
        },
      };

    case actionConstants.SET_PROVIDER_TYPE:
      return {
        ...dexmaskState,
        provider: {
          type: action.value,
        },
      };

    case actionConstants.SHOW_ACCOUNT_DETAIL:
      return {
        ...dexmaskState,
        isUnlocked: true,
        isInitialized: true,
        selectedAddress: action.value,
      };

    case actionConstants.SET_ACCOUNT_LABEL: {
      const { account } = action.value;
      const name = action.value.label;
      const id = {};
      id[account] = { ...dexmaskState.identities[account], name };
      const identities = { ...dexmaskState.identities, ...id };
      return Object.assign(dexmaskState, { identities });
    }

    case actionConstants.UPDATE_TOKENS:
      return {
        ...dexmaskState,
        tokens: action.newTokens,
      };

    case actionConstants.UPDATE_CUSTOM_NONCE:
      return {
        ...dexmaskState,
        customNonceValue: action.value,
      };

    case actionConstants.TOGGLE_ACCOUNT_MENU:
      return {
        ...dexmaskState,
        isAccountMenuOpen: !dexmaskState.isAccountMenuOpen,
      };

    case actionConstants.UPDATE_TRANSACTION_PARAMS: {
      const { id: txId, value } = action;
      let { currentNetworkTxList } = dexmaskState;
      currentNetworkTxList = currentNetworkTxList.map((tx) => {
        if (tx.id === txId) {
          const newTx = { ...tx };
          newTx.txParams = value;
          return newTx;
        }
        return tx;
      });

      return {
        ...dexmaskState,
        currentNetworkTxList,
      };
    }

    case actionConstants.SET_PARTICIPATE_IN_METAMETRICS:
      return {
        ...dexmaskState,
        participateInMetaMetrics: action.value,
      };

    case actionConstants.SET_USE_BLOCKIE:
      return {
        ...dexmaskState,
        useBlockie: action.value,
      };

    case actionConstants.UPDATE_FEATURE_FLAGS:
      return {
        ...dexmaskState,
        featureFlags: action.value,
      };

    case actionConstants.CLOSE_WELCOME_SCREEN:
      return {
        ...dexmaskState,
        welcomeScreenSeen: true,
      };

    case actionConstants.SET_CURRENT_LOCALE:
      return {
        ...dexmaskState,
        currentLocale: action.value.locale,
      };

    case actionConstants.SET_PENDING_TOKENS:
      return {
        ...dexmaskState,
        pendingTokens: { ...action.payload },
      };

    case actionConstants.CLEAR_PENDING_TOKENS: {
      return {
        ...dexmaskState,
        pendingTokens: {},
      };
    }

    case actionConstants.UPDATE_PREFERENCES: {
      return {
        ...dexmaskState,
        preferences: {
          ...dexmaskState.preferences,
          ...action.payload,
        },
      };
    }

    case actionConstants.COMPLETE_ONBOARDING: {
      return {
        ...dexmaskState,
        completedOnboarding: true,
      };
    }

    case actionConstants.SET_FIRST_TIME_FLOW_TYPE: {
      return {
        ...dexmaskState,
        firstTimeFlowType: action.value,
      };
    }

    case actionConstants.SET_NEXT_NONCE: {
      return {
        ...dexmaskState,
        nextNonce: action.value,
      };
    }

    default:
      return dexmaskState;
  }
}

const toHexWei = (value, expectHexWei) => {
  return addHexPrefix(expectHexWei ? value : decGWEIToHexWEI(value));
};

// Action Creators
export function updateTransactionGasFees({
  gasPrice,
  gasLimit,
  maxPriorityFeePerGas,
  maxFeePerGas,
  transaction,
  expectHexWei = false,
}) {
  return async (dispatch) => {
    const txParamsCopy = { ...transaction.txParams, gas: gasLimit };
    if (gasPrice) {
      dispatch(
        setCustomGasPrice(toHexWei(txParamsCopy.gasPrice, expectHexWei)),
      );
      txParamsCopy.gasPrice = toHexWei(gasPrice, expectHexWei);
    } else if (maxFeePerGas && maxPriorityFeePerGas) {
      txParamsCopy.maxFeePerGas = toHexWei(maxFeePerGas, expectHexWei);
      txParamsCopy.maxPriorityFeePerGas = addHexPrefix(
        decGWEIToHexWEI(maxPriorityFeePerGas),
      );
    }
    const updatedTx = {
      ...transaction,
      txParams: txParamsCopy,
    };

    const customGasLimit = isHexString(addHexPrefix(gasLimit))
      ? addHexPrefix(gasLimit)
      : addHexPrefix(gasLimit.toString(16));
    dispatch(setCustomGasLimit(customGasLimit));
    await dispatch(updateTransaction(updatedTx));
  };
}

// Selectors

export const getConfirmedAction = (state) => state.metamask.confirmedAction;

export const getCurrentLocale = (state) => state.metamask.currentLocale;

export const getAlertEnabledness = (state) => state.metamask.alertEnabledness;

export const getUnconnectedAccountAlertEnabledness = (state) =>
  getAlertEnabledness(state)[ALERT_TYPES.unconnectedAccount];

export const getWeb3ShimUsageAlertEnabledness = (state) =>
  getAlertEnabledness(state)[ALERT_TYPES.web3ShimUsage];

export const getUnconnectedAccountAlertShown = (state) =>
  state.metamask.unconnectedAccountAlertShownOrigins;

export const getTokens = (state) => state.metamask.tokens;

export function getBlockGasLimit(state) {
  return state.metamask.currentBlockGasLimit;
}

export function getConversionRate(state) {
  return state.metamask.conversionRate;
}

export function getNativeCurrency(state) {
  return state.metamask.nativeCurrency;
}

export function getSendHexDataFeatureFlagState(state) {
  return state.metamask.featureFlags.sendHexData;
}

export function getSendToAccounts(state) {
  const fromAccounts = accountsWithSendEtherInfoSelector(state);
  const addressBookAccounts = getAddressBook(state);
  return [...fromAccounts, ...addressBookAccounts];
}

export function getUnapprovedTxs(state) {
  return state.metamask.unapprovedTxs;
}

export function isEIP1559Network(state) {
  return state.metamask.networkDetails?.EIPS[1559] === true;
}

export function getGasEstimateType(state) {
  return state.metamask.gasEstimateType;
}

export function getGasFeeEstimates(state) {
  return state.metamask.gasFeeEstimates;
}

export function getEstimatedGasFeeTimeBounds(state) {
  return state.metamask.estimatedGasFeeTimeBounds;
}

export function getIsGasEstimatesLoading(state) {
  const networkAndAccountSupports1559 = checkNetworkAndAccountSupports1559(
    state,
  );
  const gasEstimateType = getGasEstimateType(state);

  // We consider the gas estimate to be loading if the gasEstimateType is
  // 'NONE' or if the current gasEstimateType cannot be supported by the current
  // network
  const isEIP1559TolerableEstimateType =
    gasEstimateType === GAS_ESTIMATE_TYPES.FEE_MARKET ||
    gasEstimateType === GAS_ESTIMATE_TYPES.ETH_GASPRICE;
  const isGasEstimatesLoading =
    gasEstimateType === GAS_ESTIMATE_TYPES.NONE ||
    (networkAndAccountSupports1559 && !isEIP1559TolerableEstimateType) ||
    (!networkAndAccountSupports1559 &&
      gasEstimateType === GAS_ESTIMATE_TYPES.FEE_MARKET);

  return isGasEstimatesLoading;
}
