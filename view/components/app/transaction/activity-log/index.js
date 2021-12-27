import { connect } from 'react-redux'
import { findLastIndex } from 'lodash'
import { getNativeCurrency } from '@reducer/dexmask/dexmask'
import {
  conversionRateSelector,
  getRpcPrefsForCurrentProvider,
} from '@view/selectors'
import TransactionActivityLog from './component'
import {
  TRANSACTION_CANCEL_ATTEMPTED_EVENT,
  TRANSACTION_RESUBMITTED_EVENT,
} from './constants'
import { combineTransactionHistories } from './util'

const matchesEventKey = (matchEventKey) => ({ eventKey }) =>
  eventKey === matchEventKey

const mapStateToProps = (state) => {
  return {
    conversionRate: conversionRateSelector(state),
    nativeCurrency: getNativeCurrency(state),
    rpcPrefs: getRpcPrefsForCurrentProvider(state),
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {
    transactionGroup: { transactions = [], primaryTransaction } = {},
    ...restOwnProps
  } = ownProps
  const activities = combineTransactionHistories(transactions)
  const inlineRetryIndex = findLastIndex(
    activities,
    matchesEventKey(TRANSACTION_RESUBMITTED_EVENT),
  )
  const inlineCancelIndex = findLastIndex(
    activities,
    matchesEventKey(TRANSACTION_CANCEL_ATTEMPTED_EVENT),
  )
  return {
    ...stateProps,
    ...dispatchProps,
    ...restOwnProps,
    activities,
    inlineRetryIndex,
    inlineCancelIndex,
    primaryTransaction,
  }
}

export default connect(
  mapStateToProps,
  null,
  mergeProps,
)(TransactionActivityLog)
