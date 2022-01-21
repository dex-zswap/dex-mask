import React, { createContext, useCallback, Component } from 'react'
import PropTypes from 'prop-types'
import dexMaskDataBase from '@shared/modules/database'
export const TransactionCacheContext = createContext((key) => `[${key}]`)
const { Dexie } = global
export const TransactionCacheProvider = (props) => {
  const recordTransaction = useCallback(async (txData) => {
    // return Promise.resolve().then(() => {
    //   const isOpen = dexMaskDataBase.isOpen()
    //   return isOpen ? Promise.resolve() : dexMaskDataBase.open();
    // }).then(() => {
    //   return dexMaskDataBase.transactions.add({
    //     tokenAddress: txData.tokenAddress,
    //     chainId: txData.chainId,
    //     fromAddress: txData.txParams.from,
    //     toAddress: txData.txParams.to,
    //     timestamp: txData.time
    //   })
    // })
    // .then(() => dexMaskDataBase.close())
    // .catch((e) => {
    //   console.log(e)
    //   dexMaskDataBase.close()
    // })
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
