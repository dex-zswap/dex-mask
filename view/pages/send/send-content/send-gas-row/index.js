import { connect } from 'react-redux';
import {
  resetCustomData,
  setCustomGasLimit,
  setCustomGasPrice,
} from '@reducer/gas/gas.duck';
import {
  gasFeeIsInError,
  getGasInputMode,
  getGasLimit,
  getGasPrice,
  getGasTotal,
  getIsBalanceInsufficient,
  getMinimumGasLimitForSend,
  isSendStateInitialized,
  updateGasLimit,
  updateGasPrice,
  useDefaultGas,
} from '@reducer/send';
import { hexToDecimal } from '@view/helpers/utils/conversions.util';
import {
  getAdvancedInlineGasShown,
  getBasicGasEstimateLoadingStatus,
  getDefaultActiveButtonIndex,
  getRenderableEstimateDataForSmallButtonsFromGWEI,
} from '@view/selectors';
import { showModal } from '@view/store/actions';
import SendGasRow from './component';
export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(SendGasRow);

function mapStateToProps(state) {
  const gasButtonInfo = getRenderableEstimateDataForSmallButtonsFromGWEI(state);
  const gasPrice = getGasPrice(state);
  const gasLimit = getGasLimit(state);
  const activeButtonIndex = getDefaultActiveButtonIndex(
    gasButtonInfo,
    gasPrice,
  );
  const gasTotal = getGasTotal(state);
  const minimumGasLimit = getMinimumGasLimitForSend(state);
  return {
    gasTotal,
    minimumGasLimit: hexToDecimal(minimumGasLimit),
    gasFeeError: gasFeeIsInError(state),
    gasLoadingError: isSendStateInitialized(state),
    gasPriceButtonGroupProps: {
      buttonDataLoading: getBasicGasEstimateLoadingStatus(state),
      defaultActiveButtonIndex: 1,
      newActiveButtonIndex: activeButtonIndex > -1 ? activeButtonIndex : null,
      gasButtonInfo,
    },
    advancedInlineGasShown: getAdvancedInlineGasShown(state),
    gasInputMode: getGasInputMode(state),
    gasPrice,
    gasLimit,
    insufficientBalance: getIsBalanceInsufficient(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showLegacyCustomizeGasModal: () =>
      dispatch(
        showModal({
          name: 'LEGACY_CUSTOMIZE_GAS',
          hideBasic: true,
        }),
      ),
    updateGasPrice: (gasPrice) => {
      dispatch(updateGasPrice(gasPrice));
      dispatch(setCustomGasPrice(gasPrice));
    },
    updateGasLimit: (newLimit) => {
      dispatch(updateGasLimit(newLimit));
      dispatch(setCustomGasLimit(newLimit));
    },
    resetCustomData: () => dispatch(resetCustomData()),
    useDefaultGas: () => dispatch(useDefaultGas()),
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { gasPriceButtonGroupProps } = stateProps;
  const { gasButtonInfo } = gasPriceButtonGroupProps;
  const {
    updateGasPrice: dispatchUpdateGasPrice,
    useDefaultGas: dispatchUseDefaultGas,
    resetCustomData: dispatchResetCustomData,
    ...otherDispatchProps
  } = dispatchProps;
  return {
    ...stateProps,
    ...otherDispatchProps,
    ...ownProps,
    gasPriceButtonGroupProps: {
      ...gasPriceButtonGroupProps,
      handleGasPriceSelection: ({ gasPrice }) =>
        dispatchUpdateGasPrice(gasPrice),
    },
    resetGasButtons: () => {
      dispatchResetCustomData();
      dispatchUpdateGasPrice(gasButtonInfo[1].priceInHexWei);
      dispatchUseDefaultGas();
    },
    updateGasPrice: dispatchUpdateGasPrice,
  };
}
