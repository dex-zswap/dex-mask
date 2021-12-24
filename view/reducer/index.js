import { combineReducers } from 'redux'
import { ALERT_TYPES } from '@shared/constants/alerts'
import { invalidCustomNetwork, unconnectedAccount } from './alerts'
import appStateReducer from './app'
import confirmTransactionReducer from './confirm-transaction/confirm-transaction.duck'
import crossChainReducer from './cross-chain/cross-chain'
import dexmaskReducer from './dexmask/dexmask'
import ensReducer from './ens'
import gasReducer from './gas/gas.duck'
import historyReducer from './history/history'
import localeMessagesReducer from './locale/locale'
import sendReducer from './send'
import swapsReducer from './swaps/swaps'
export default combineReducers({
  [ALERT_TYPES.invalidCustomNetwork]: invalidCustomNetwork,
  [ALERT_TYPES.unconnectedAccount]: unconnectedAccount,
  activeTab: (s) => (s === undefined ? null : s),
  metamask: dexmaskReducer,
  appState: appStateReducer,
  ENS: ensReducer,
  history: historyReducer,
  send: sendReducer,
  confirmTransaction: confirmTransactionReducer,
  swaps: swapsReducer,
  gas: gasReducer,
  localeMessages: localeMessagesReducer,
  crossChain: crossChainReducer,
})
