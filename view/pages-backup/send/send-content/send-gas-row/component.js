import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AdvancedGasInputs from '@c/app/gas-customization/advanced-gas-inputs';
import SendRowWrapper from '@pages/send/send-content/send-row-wrapper';
import { GAS_INPUT_MODES } from '@reducer/send';
export default class SendGasRow extends Component {
  static propTypes = {
    updateGasPrice: PropTypes.func,
    updateGasLimit: PropTypes.func,
    gasInputMode: PropTypes.oneOf(Object.values(GAS_INPUT_MODES)),
    gasPrice: PropTypes.string,
    gasLimit: PropTypes.string,
    insufficientBalance: PropTypes.bool,
    minimumGasLimit: PropTypes.string
  };
  static contextTypes = {
    t: PropTypes.func
  };

  render() {
    const {
      updateGasPrice,
      updateGasLimit,
      gasPrice,
      gasLimit,
      insufficientBalance,
      minimumGasLimit,
      gasInputMode
    } = this.props;

    if (gasInputMode !== GAS_INPUT_MODES.INLINE) {
      return null;
    }

    return <SendRowWrapper>
        <AdvancedGasInputs updateCustomGasPrice={updateGasPrice} updateCustomGasLimit={updateGasLimit} customGasPrice={gasPrice} customGasLimit={gasLimit} insufficientBalance={insufficientBalance} minimumGasLimit={minimumGasLimit} customPriceIsSafe isSpeedUp={false} />
      </SendRowWrapper>;
  }

}