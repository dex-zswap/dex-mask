import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';
import { calcGasTotal, isBalanceSufficient } from '@pages/send/utils';
import { getNativeCurrency } from '@reducer/dexmask/dexmask';
import { getSwapGasPriceEstimateData, getSwapsCustomizationModalLimit, getSwapsCustomizationModalPrice, shouldShowCustomPriceTooLowWarning, swapCustomGasModalClosed, swapCustomGasModalLimitEdited, swapCustomGasModalPriceEdited, swapGasEstimateLoadingHasFailed, swapGasPriceEstimateIsLoading } from '@reducer/swaps/swaps';
import { addHexes, getValueFromWeiHex, sumHexWEIsToRenderableFiat } from '@view/helpers/utils/conversions.util';
import { formatETHFee } from '@view/helpers/utils/formatters';
import { conversionRateSelector as getConversionRate, getCurrentCurrency, getCurrentEthBalance, getDefaultActiveButtonIndex, getRenderableGasButtonData, getSwapsDefaultToken, getUSDConversionRate } from '@view/selectors';
import { customSwapsGasParamsUpdated, hideModal } from '@view/store/actions';
import SwapsGasCustomizationModalComponent from './swaps-gas-customization-modal.component';

const mapStateToProps = state => {
  const currentCurrency = getCurrentCurrency(state);
  const conversionRate = getConversionRate(state);
  const nativeCurrencySymbol = getNativeCurrency(state);
  const {
    symbol: swapsDefaultCurrencySymbol
  } = getSwapsDefaultToken(state);
  const usedCurrencySymbol = nativeCurrencySymbol || swapsDefaultCurrencySymbol;
  const {
    modalState: {
      props: modalProps
    } = {}
  } = state.appState.modal || {};
  const {
    value,
    customGasLimitMessage = '',
    customTotalSupplement = '',
    extraInfoRow = null,
    initialGasPrice,
    initialGasLimit,
    minimumGasLimit
  } = modalProps;
  const buttonDataLoading = swapGasPriceEstimateIsLoading(state);
  const swapsCustomizationModalPrice = getSwapsCustomizationModalPrice(state);
  const swapsCustomizationModalLimit = getSwapsCustomizationModalLimit(state);
  const customGasPrice = swapsCustomizationModalPrice || initialGasPrice;
  const customGasLimit = swapsCustomizationModalLimit || initialGasLimit;
  const customGasTotal = calcGasTotal(customGasLimit, customGasPrice);
  const gasEstimates = getSwapGasPriceEstimateData(state);
  const gasEstimatesInNewFormat = {
    low: gasEstimates.safeLow,
    medium: gasEstimates.average,
    high: gasEstimates.fast
  };
  const {
    averageEstimateData,
    fastEstimateData
  } = getRenderableGasButtonData(gasEstimatesInNewFormat, customGasLimit, true, conversionRate, currentCurrency, usedCurrencySymbol);
  const gasButtonInfo = [averageEstimateData, fastEstimateData];
  const newTotalFiat = sumHexWEIsToRenderableFiat([value, customGasTotal, customTotalSupplement], currentCurrency, conversionRate);
  const balance = getCurrentEthBalance(state);
  const newTotalEth = sumHexWEIsToRenderableEth([value, customGasTotal, customTotalSupplement], usedCurrencySymbol);
  const sendAmount = sumHexWEIsToRenderableEth([value, '0x0'], usedCurrencySymbol);
  const insufficientBalance = !isBalanceSufficient({
    amount: value,
    gasTotal: customGasTotal,
    balance,
    conversionRate
  });
  const customGasLimitTooLow = new BigNumber(customGasLimit, 16).lt(minimumGasLimit, 10);
  return {
    customGasPrice,
    customGasLimit,
    showCustomPriceTooLowWarning: shouldShowCustomPriceTooLowWarning(state),
    gasPriceButtonGroupProps: {
      buttonDataLoading,
      defaultActiveButtonIndex: getDefaultActiveButtonIndex(gasButtonInfo, customGasPrice),
      gasButtonInfo
    },
    infoRowProps: {
      originalTotalFiat: sumHexWEIsToRenderableFiat([value, customGasTotal, customTotalSupplement], currentCurrency, conversionRate),
      originalTotalEth: sumHexWEIsToRenderableEth([value, customGasTotal, customTotalSupplement], usedCurrencySymbol),
      newTotalFiat,
      newTotalEth,
      transactionFee: sumHexWEIsToRenderableEth(['0x0', customGasTotal], usedCurrencySymbol),
      sendAmount,
      extraInfoRow
    },
    gasEstimateLoadingHasFailed: swapGasEstimateLoadingHasFailed(state),
    insufficientBalance,
    customGasLimitMessage,
    customTotalSupplement,
    usdConversionRate: getUSDConversionRate(state),
    disableSave: insufficientBalance || customGasLimitTooLow,
    minimumGasLimit
  };
};

const mapDispatchToProps = dispatch => {
  return {
    cancelAndClose: () => {
      dispatch(swapCustomGasModalClosed());
      dispatch(hideModal());
    },
    onSubmit: async (gasLimit, gasPrice) => {
      await dispatch(customSwapsGasParamsUpdated(gasLimit, gasPrice));
      dispatch(swapCustomGasModalClosed());
      dispatch(hideModal());
    },
    setSwapsCustomizationModalPrice: newPrice => {
      dispatch(swapCustomGasModalPriceEdited(newPrice));
    },
    setSwapsCustomizationModalLimit: newLimit => {
      dispatch(swapCustomGasModalLimitEdited(newLimit));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SwapsGasCustomizationModalComponent);

function sumHexWEIsToRenderableEth(hexWEIs, currencySymbol = 'ETH') {
  const hexWEIsSum = hexWEIs.filter(Boolean).reduce(addHexes);
  return formatETHFee(getValueFromWeiHex({
    value: hexWEIsSum,
    fromCurrency: currencySymbol,
    toCurrency: currencySymbol,
    numberOfDecimals: 6
  }), currencySymbol);
}