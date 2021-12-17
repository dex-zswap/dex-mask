import { connect } from 'react-redux';
import { MIN_GAS_LIMIT_DEC } from '@pages/send/constants';
import {
  decGWEIToHexWEI,
  decimalToHex,
  hexWEIToDecGWEI,
} from '@view/helpers/utils/conversions.util';
import AdvancedGasInputs from './component';

function convertGasPriceForInputs(gasPriceInHexWEI) {
  return Number(hexWEIToDecGWEI(gasPriceInHexWEI));
}

function convertGasLimitForInputs(gasLimitInHexWEI) {
  return parseInt(gasLimitInHexWEI, 16) || 0;
}

function convertMinimumGasLimitForInputs(minimumGasLimit = MIN_GAS_LIMIT_DEC) {
  return parseInt(minimumGasLimit, 10);
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {
    customGasPrice,
    customGasLimit,
    updateCustomGasPrice,
    updateCustomGasLimit,
    minimumGasLimit,
  } = ownProps;
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    customGasPrice: convertGasPriceForInputs(customGasPrice),
    customGasLimit: convertGasLimitForInputs(customGasLimit),
    minimumGasLimit: convertMinimumGasLimitForInputs(minimumGasLimit),
    updateCustomGasPrice: (price) =>
      updateCustomGasPrice(decGWEIToHexWEI(price)),
    updateCustomGasLimit: (limit) => updateCustomGasLimit(decimalToHex(limit)),
  };
};

export default connect(null, null, mergeProps)(AdvancedGasInputs);
