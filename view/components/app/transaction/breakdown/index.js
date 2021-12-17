import { connect } from 'react-redux';
import { getNativeCurrency } from '@reducer/dexmask/dexmask';
import { isEIP1559Transaction } from '@shared/modules/transaction.utils';
import { getHexGasTotal } from '@view/helpers/utils/confirm-tx.util';
import { subtractHexes } from '@view/helpers/utils/conversions.util';
import { sumHexes } from '@view/helpers/utils/transactions.util';
import { getShouldShowFiat } from '@view/selectors';
import TransactionBreakdown from './component';

const mapStateToProps = (state, ownProps) => {
  const {
    transaction,
    isTokenApprove
  } = ownProps;
  const {
    txParams: {
      gas,
      gasPrice,
      value
    } = {},
    txReceipt: {
      gasUsed,
      effectiveGasPrice
    } = {},
    baseFeePerGas
  } = transaction;
  const gasLimit = typeof gasUsed === 'string' ? gasUsed : gas;
  const priorityFee = effectiveGasPrice && baseFeePerGas && subtractHexes(effectiveGasPrice, baseFeePerGas); // To calculate the total cost of the transaction, we use gasPrice if it is in the txParam,
  // which will only be the case on non-EIP1559 networks. If it is not in the params, we can
  // use the effectiveGasPrice from the receipt, which will ultimately represent to true cost
  // of the transaction. Either of these are used the same way with gasLimit to calculate total
  // cost. effectiveGasPrice will be available on the txReciept for all EIP1559 networks

  const usedGasPrice = gasPrice || effectiveGasPrice;
  const hexGasTotal = gasLimit && usedGasPrice && getHexGasTotal({
    gasLimit,
    gasPrice: usedGasPrice
  }) || '0x0';
  const totalInHex = sumHexes(hexGasTotal, value);
  return {
    nativeCurrency: getNativeCurrency(state),
    showFiat: getShouldShowFiat(state),
    totalInHex,
    gas,
    gasPrice,
    gasUsed,
    isTokenApprove,
    hexGasTotal,
    priorityFee,
    baseFee: baseFeePerGas,
    isEIP1559Transaction: isEIP1559Transaction(transaction)
  };
};

export default connect(mapStateToProps)(TransactionBreakdown);