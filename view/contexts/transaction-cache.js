import React, { createContext, useCallback, Component } from 'react'
import PropTypes from 'prop-types'
import dexMaskDataBase from '@shared/modules/database'
export const TransactionCacheContext = createContext((key) => `[${key}]`)
export const TransactionCacheProvider = (props) => {
  const recordTransaction = useCallback(async (txData) => {
    console.log(txData)
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
