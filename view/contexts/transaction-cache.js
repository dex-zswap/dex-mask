import React, { createContext, useCallback, Component } from 'react'
import PropTypes from 'prop-types'
import dexMaskDataBase from '@shared/modules/database'
import { NATIVE_TOKEN_ADDRESS } from '@shared/constants/tokens'
export const TransactionCacheContext = createContext((key) => `[${key}]`)
export const TransactionCacheProvider = (props) => {
  const recordTransaction = useCallback(async (txData) => {
    if (
      txData.type === 'sentEther' ||
      txData.tokenAddress === NATIVE_TOKEN_ADDRESS ||
      !txData.tokenAddress
    ) {
      return
    }

    const dbInstance = await dexMaskDataBase.getDBInstance()
    await dbInstance.add('transactions', {
      tokenAddress: txData.tokenAddress,
      chainId: txData.chainId,
      fromAddress: txData.txParams.from,
      toAddress: txData.txParams.to,
      timestamp: txData.time,
    })
  }, [])
  return (
    <TransactionCacheContext.Provider value={recordTransaction}>
      {props.children}
    </TransactionCacheContext.Provider>
  )
}
export class LegacyTransactionCacheProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
  }
  static defaultProps = {
    children: undefined,
  }
  static contextType = TransactionCacheContext
  static childContextTypes = {
    recordTransaction: PropTypes.func,
  }

  getChildContext() {
    return {
      recordTransaction: this.context,
    }
  }

  render() {
    return this.props.children
  }
}
