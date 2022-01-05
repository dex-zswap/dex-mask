import BackBar from '@c/ui/back-bar'
import Loading from '@c/ui/loading-screen'
import TopHeader from '@c/ui/top-header'
import ConfirmApprove from '@pages/confirm-approve'
import ConfirmDecryptMessage from '@pages/confirm-decrypt-message'
import ConfirmDeployContract from '@pages/confirm-deploy-contract'
import ConfirmEncryptionPublicKey from '@pages/confirm-encryption-public-key'
import ConfirmSendEther from '@pages/confirm-send-ether'
import ConfirmSendToken from '@pages/confirm-send-token'
import ConfirmTokenTransactionBaseContainer from '@pages/confirm-token-transaction-base'
import ConfirmTransactionBase from '@pages/confirm-transaction-base'
import ConfirmTransactionSwitch from '@pages/confirm-transaction-switch'
import {
  CONFIRM_APPROVE_PATH,
  CONFIRM_DEPLOY_CONTRACT_PATH,
  CONFIRM_SEND_ETHER_PATH,
  CONFIRM_SEND_TOKEN_PATH,
  CONFIRM_TOKEN_METHOD_PATH,
  CONFIRM_TRANSACTION_ROUTE,
  CONFIRM_TRANSFER_FROM_PATH,
  DECRYPT_MESSAGE_REQUEST_PATH,
  DEFAULT_ROUTE,
  ENCRYPTION_PUBLIC_KEY_REQUEST_PATH,
  SIGNATURE_REQUEST_PATH,
} from '@view/helpers/constants/routes'
import {
  addPollingTokenToAppState,
  disconnectGasFeeEstimatePoller,
  getGasFeeEstimatesAndStartPolling,
  removePollingTokenFromAppState,
} from '@view/store/actions'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import ConfTx from './conf-tx'
export default class ConfirmTransaction extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    totalUnapprovedCount: PropTypes.number.isRequired,
    sendTo: PropTypes.string,
    setTransactionToConfirm: PropTypes.func,
    clearConfirmTransaction: PropTypes.func,
    mostRecentOverviewPage: PropTypes.string.isRequired,
    transaction: PropTypes.object,
    getContractMethodData: PropTypes.func,
    transactionId: PropTypes.string,
    paramsTransactionId: PropTypes.string,
    getTokenParams: PropTypes.func,
    isTokenMethodAction: PropTypes.bool,
    setDefaultHomeActiveTabName: PropTypes.func,
    confirmedAction: PropTypes.string,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  _beforeUnload = () => {
    this._isMounted = false

    if (this.state.pollingToken) {
      disconnectGasFeeEstimatePoller(this.state.pollingToken)
      removePollingTokenFromAppState(this.state.pollingToken)
    }
  }

  componentDidMount() {
    this._isMounted = true
    const {
      totalUnapprovedCount = 0,
      sendTo,
      history,
      mostRecentOverviewPage,
      transaction: { txParams: { data, to } = {} } = {},
      getContractMethodData,
      transactionId,
      paramsTransactionId,
      getTokenParams,
      isTokenMethodAction,
    } = this.props
    getGasFeeEstimatesAndStartPolling().then((pollingToken) => {
      if (this._isMounted) {
        this.setState({
          pollingToken,
        })
        addPollingTokenToAppState(pollingToken)
      } else {
        disconnectGasFeeEstimatePoller(pollingToken)
        removePollingTokenFromAppState(pollingToken)
      }
    })
    window.addEventListener('beforeunload', this._beforeUnload) //  TODO: Why totalUnapprovedCount equals 0
    // if (!totalUnapprovedCount && !sendTo) {
    //   history.replace(mostRecentOverviewPage);
    //   return;
    // }

    getContractMethodData(data)

    if (isTokenMethodAction) {
      getTokenParams(to)
    }

    const txId = transactionId || paramsTransactionId

    if (txId) {
      this.props.setTransactionToConfirm(txId)
    }
  }

  componentWillUnmount() {
    this._beforeUnload()

    window.removeEventListener('beforeunload', this._beforeUnload)
  }

  componentDidUpdate(prevProps) {
    const {
      setTransactionToConfirm,
      transaction: { txData: { txParams: { data } = {} } = {} },
      clearConfirmTransaction,
      getContractMethodData,
      paramsTransactionId,
      transactionId,
      history,
      mostRecentOverviewPage,
      totalUnapprovedCount,
      setDefaultHomeActiveTabName,
      confirmedAction,
    } = this.props

    if (
      paramsTransactionId &&
      transactionId &&
      prevProps.paramsTransactionId !== paramsTransactionId
    ) {
      clearConfirmTransaction()
      getContractMethodData(data)
      setTransactionToConfirm(paramsTransactionId)
    } else if (
      prevProps.transactionId &&
      !transactionId &&
      !totalUnapprovedCount
    ) {
      setDefaultHomeActiveTabName('Activity').then(() => {
        if (confirmedAction) {
          history.replace(confirmedAction)
        } else {
          history.replace(DEFAULT_ROUTE)
        }
      })
    } else if (
      prevProps.transactionId &&
      transactionId &&
      prevProps.transactionId !== transactionId
    ) {
      history.replace(mostRecentOverviewPage)
    }
  }

  render() {
    const { transactionId, paramsTransactionId } = this.props // Show routes when state.confirmTransaction has been set and when either the ID in the params
    // isn't specified or is specified and matches the ID in state.confirmTransaction in order to
    // support URLs of /confirm-transaction or /confirm-transaction/<transactionId>
    return transactionId &&
      (!paramsTransactionId || paramsTransactionId === transactionId) ? (
      <div className='dex-page-container space-between'>
        <div>
          <TopHeader />
          <BackBar title={this.context.t('confirmSend')} showBack={false} />
        </div>
        <div style={{ flex: 1 }}>
          <Switch>
            <Route
              exact
              path={`${CONFIRM_TRANSACTION_ROUTE}/:id?${CONFIRM_DEPLOY_CONTRACT_PATH}`}
              component={ConfirmDeployContract}
            />
            <Route
              exact
              path={`${CONFIRM_TRANSACTION_ROUTE}/:id?${CONFIRM_TOKEN_METHOD_PATH}`}
              component={ConfirmTransactionBase}
            />
            <Route
              exact
              path={`${CONFIRM_TRANSACTION_ROUTE}/:id?${CONFIRM_SEND_ETHER_PATH}`}
              component={ConfirmSendEther}
            />
            <Route
              exact
              path={`${CONFIRM_TRANSACTION_ROUTE}/:id?${CONFIRM_SEND_TOKEN_PATH}`}
              component={ConfirmSendToken}
            />
            <Route
              exact
              path={`${CONFIRM_TRANSACTION_ROUTE}/:id?${CONFIRM_APPROVE_PATH}`}
              component={ConfirmApprove}
            />
            <Route
              exact
              path={`${CONFIRM_TRANSACTION_ROUTE}/:id?${CONFIRM_TRANSFER_FROM_PATH}`}
              component={ConfirmTokenTransactionBaseContainer}
            />
            <Route
              exact
              path={`${CONFIRM_TRANSACTION_ROUTE}/:id?${SIGNATURE_REQUEST_PATH}`}
              component={ConfTx}
            />
            <Route
              exact
              path={`${CONFIRM_TRANSACTION_ROUTE}/:id?${DECRYPT_MESSAGE_REQUEST_PATH}`}
              component={ConfirmDecryptMessage}
            />
            <Route
              exact
              path={`${CONFIRM_TRANSACTION_ROUTE}/:id?${ENCRYPTION_PUBLIC_KEY_REQUEST_PATH}`}
              component={ConfirmEncryptionPublicKey}
            />
            <Route path='*' component={ConfirmTransactionSwitch} />
          </Switch>
        </div>
      </div>
    ) : (
      <Loading />
    )
  }
}
