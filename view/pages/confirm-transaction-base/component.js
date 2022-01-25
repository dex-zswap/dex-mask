import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getEnvironmentType } from '@app/scripts/lib/util'
import ConfirmPageContainer from '@c/app/confirm-page-container'
import GasTiming from '@c/app/gas-timing'
import TransactionDetail from '@c/app/transaction/detail'
import TransactionDetailItem from '@c/app/transaction/detail-item'
import UserPreferencedCurrencyDisplay from '@c/app/user-preferenced/currency-display'
import InfoTooltip from '@c/ui/info-tooltip'
import LoadingHeartBeat from '@c/ui/loading-heartbeat'
import TextField from '@c/ui/text-field'
import { isBalanceSufficient } from '@pages/send/utils'
import { ENVIRONMENT_TYPE_NOTIFICATION } from '@shared/constants/app'
import { TRANSACTION_STATUSES } from '@shared/constants/transaction'
import { toBuffer } from '@shared/modules/buffer-utils'
import { PRIMARY, SECONDARY } from '@view/helpers/constants/common'
import {
  ETH_GAS_PRICE_FETCH_WARNING_KEY,
  GAS_LIMIT_TOO_LOW_ERROR_KEY,
  GAS_PRICE_FETCH_FAILURE_ERROR_KEY,
  INSUFFICIENT_FUNDS_ERROR_KEY,
  TRANSACTION_ERROR_KEY,
} from '@view/helpers/constants/error-keys'
import {
  CONFIRM_TRANSACTION_ROUTE,
  DEFAULT_ROUTE,
} from '@view/helpers/constants/routes'
import {
  addHexes,
  hexToDecimal,
  hexWEIToDecGWEI,
} from '@view/helpers/utils/conversions.util'
import { getTransactionTypeTitle } from '@view/helpers/utils/transactions.util'
import {
  addPollingTokenToAppState,
  disconnectGasFeeEstimatePoller,
  getGasFeeEstimatesAndStartPolling,
  removePollingTokenFromAppState,
} from '@view/store/actions'
import { SEND_BEIDGE_TOKEN } from '@pages/cross-chain/button'
import { SEND_ASSET_TOKEN_ADDRESS } from '@pages/send'
import cloneDeep from 'lodash/cloneDeep'

const renderHeartBeatIfNotInTest = () =>
  process.env.IN_TEST === 'true' ? null : <LoadingHeartBeat />

export default class ConfirmTransactionBase extends Component {
  static contextTypes = {
    t: PropTypes.func,
    recordTransaction: PropTypes.func,
  }
  static propTypes = {
    // react-router props
    history: PropTypes.object,
    // Redux props
    balance: PropTypes.string,
    cancelTransaction: PropTypes.func,
    cancelAllTransactions: PropTypes.func,
    clearConfirmTransaction: PropTypes.func,
    conversionRate: PropTypes.number,
    fromAddress: PropTypes.string,
    fromName: PropTypes.string,
    hexTransactionAmount: PropTypes.string,
    hexMinimumTransactionFee: PropTypes.string,
    hexMaximumTransactionFee: PropTypes.string,
    hexTransactionTotal: PropTypes.string,
    methodData: PropTypes.object,
    nonce: PropTypes.string,
    useNonceField: PropTypes.bool,
    customNonceValue: PropTypes.string,
    updateCustomNonce: PropTypes.func,
    assetImage: PropTypes.string,
    sendTransaction: PropTypes.func,
    showTransactionConfirmedModal: PropTypes.func,
    showRejectTransactionsConfirmationModal: PropTypes.func,
    toAddress: PropTypes.string,
    tokenData: PropTypes.object,
    tokenProps: PropTypes.object,
    toName: PropTypes.string,
    toEns: PropTypes.string,
    toNickname: PropTypes.string,
    transactionStatus: PropTypes.string,
    txData: PropTypes.object,
    unapprovedTxCount: PropTypes.number,
    currentNetworkUnapprovedTxs: PropTypes.object,
    customGas: PropTypes.object,
    // Component props
    actionKey: PropTypes.string,
    contentComponent: PropTypes.node,
    dataComponent: PropTypes.node,
    hideData: PropTypes.bool,
    hideSubtitle: PropTypes.bool,
    identiconAddress: PropTypes.string,
    onEdit: PropTypes.func,
    subtitleComponent: PropTypes.node,
    title: PropTypes.string,
    type: PropTypes.string,
    getNextNonce: PropTypes.func,
    nextNonce: PropTypes.number,
    tryReverseResolveAddress: PropTypes.func.isRequired,
    hideSenderToRecipient: PropTypes.bool,
    showAccountInHeader: PropTypes.bool,
    mostRecentOverviewPage: PropTypes.string.isRequired,
    isEthGasPrice: PropTypes.bool,
    noGasPrice: PropTypes.bool,
    setDefaultHomeActiveTabName: PropTypes.func,
    primaryTotalTextOverride: PropTypes.string,
    secondaryTotalTextOverride: PropTypes.string,
    gasIsLoading: PropTypes.bool,
    primaryTotalTextOverrideMaxAmount: PropTypes.string,
    useNativeCurrencyAsPrimaryCurrency: PropTypes.bool,
    maxFeePerGas: PropTypes.string,
    maxPriorityFeePerGas: PropTypes.string,
    baseFeePerGas: PropTypes.string,
    gasFeeIsCustom: PropTypes.bool,
  }
  state = {
    submitting: false,
    submitError: null,
    submitWarning: '',
    ethGasPriceWarning: '',
    editingGas: false,
  }

  componentDidUpdate(prevProps) {
    const {
      transactionStatus,
      showTransactionConfirmedModal,
      history,
      clearConfirmTransaction,
      nextNonce,
      customNonceValue,
      toAddress,
      tryReverseResolveAddress,
      isEthGasPrice,
      setDefaultHomeActiveTabName,
    } = this.props
    const {
      customNonceValue: prevCustomNonceValue,
      nextNonce: prevNextNonce,
      toAddress: prevToAddress,
      transactionStatus: prevTxStatus,
      isEthGasPrice: prevIsEthGasPrice,
    } = prevProps
    const statusUpdated = transactionStatus !== prevTxStatus
    const txDroppedOrConfirmed =
      transactionStatus === TRANSACTION_STATUSES.DROPPED ||
      transactionStatus === TRANSACTION_STATUSES.CONFIRMED

    if (
      nextNonce !== prevNextNonce ||
      customNonceValue !== prevCustomNonceValue
    ) {
      if (nextNonce !== null && customNonceValue > nextNonce) {
        this.setState({
          submitWarning: this.context.t('nextNonceWarning', [nextNonce]),
        })
      } else {
        this.setState({
          submitWarning: '',
        })
      }
    }

    if (statusUpdated && txDroppedOrConfirmed) {
      showTransactionConfirmedModal({
        onSubmit: () => {
          clearConfirmTransaction()
          setDefaultHomeActiveTabName('Activity').then(() => {
            history.push(DEFAULT_ROUTE)
          })
        },
      })
    }

    if (toAddress && toAddress !== prevToAddress) {
      tryReverseResolveAddress(toAddress)
    }

    if (isEthGasPrice !== prevIsEthGasPrice) {
      if (isEthGasPrice) {
        this.setState({
          ethGasPriceWarning: this.context.t(ETH_GAS_PRICE_FETCH_WARNING_KEY),
        })
      } else {
        this.setState({
          ethGasPriceWarning: '',
        })
      }
    }
  }

  getErrorKey() {
    const {
      balance,
      conversionRate,
      hexMaximumTransactionFee,
      txData: { simulationFails, txParams: { value: amount } = {} } = {},
      customGas,
      noGasPrice,
      gasFeeIsCustom,
    } = this.props
    const insufficientBalance =
      balance &&
      !isBalanceSufficient({
        amount,
        gasTotal: hexMaximumTransactionFee || '0x0',
        balance,
        conversionRate,
      })

    if (insufficientBalance) {
      return {
        valid: false,
        errorKey: INSUFFICIENT_FUNDS_ERROR_KEY,
      }
    }

    if (hexToDecimal(customGas.gasLimit) < 21000) {
      return {
        valid: false,
        errorKey: GAS_LIMIT_TOO_LOW_ERROR_KEY,
      }
    }

    if (simulationFails) {
      return {
        valid: true,
        errorKey: simulationFails.errorKey
          ? simulationFails.errorKey
          : TRANSACTION_ERROR_KEY,
      }
    }

    if (noGasPrice && !gasFeeIsCustom) {
      return {
        valid: false,
        errorKey: GAS_PRICE_FETCH_FAILURE_ERROR_KEY,
      }
    }

    return {
      valid: true,
    }
  }

  handleEditGas() {
    const {
      actionKey,
      txData: { origin },
      methodData = {},
    } = this.props
    this.setState({
      editingGas: true,
    })
  }

  handleCloseEditGas() {
    this.setState({
      editingGas: false,
    })
  }

  renderDetails() {
    const {
      primaryTotalTextOverride,
      secondaryTotalTextOverride,
      hexMinimumTransactionFee,
      hexMaximumTransactionFee,
      hexTransactionTotal,
      useNonceField,
      customNonceValue,
      updateCustomNonce,
      nextNonce,
      getNextNonce,
      txData,
      useNativeCurrencyAsPrimaryCurrency,
      primaryTotalTextOverrideMaxAmount,
      maxFeePerGas,
      maxPriorityFeePerGas,
    } = this.props
    const { t } = this.context

    const getRequestingOrigin = () => {
      try {
        return new URL(txData.origin)?.hostname
      } catch (err) {
        return ''
      }
    }

    const renderTotalMaxAmount = () => {
      if (
        primaryTotalTextOverrideMaxAmount === undefined &&
        secondaryTotalTextOverride === undefined
      ) {
        // Native Send
        return (
          <div className='confirm-transaction-total-amount-wrap'>
            <UserPreferencedCurrencyDisplay
              type={PRIMARY}
              value={addHexes(txData.txParams.value, hexMaximumTransactionFee)}
              hideLabel={!useNativeCurrencyAsPrimaryCurrency}
            />
          </div>
        )
      } // Token send

      return useNativeCurrencyAsPrimaryCurrency
        ? primaryTotalTextOverrideMaxAmount
        : secondaryTotalTextOverride
    }

    const renderTotalDetailTotal = () => {
      if (
        primaryTotalTextOverride === undefined &&
        secondaryTotalTextOverride === undefined
      ) {
        return (
          <UserPreferencedCurrencyDisplay
            type={PRIMARY}
            value={hexTransactionTotal}
            hideLabel={!useNativeCurrencyAsPrimaryCurrency}
          />
        )
      }

      return useNativeCurrencyAsPrimaryCurrency
        ? primaryTotalTextOverride
        : secondaryTotalTextOverride
    }

    const renderTotalDetailText = () => {
      if (
        primaryTotalTextOverride === undefined &&
        secondaryTotalTextOverride === undefined
      ) {
        return (
          <UserPreferencedCurrencyDisplay
            prefix='≈ '
            type={SECONDARY}
            value={hexTransactionTotal}
          />
        )
      }

      return useNativeCurrencyAsPrimaryCurrency
        ? secondaryTotalTextOverride
        : primaryTotalTextOverride
    }

    const nonceField = useNonceField ? (
      <div>
        <div className='confirm-detail-row'>
          <div className='confirm-detail-row__label'>
            {t('nonceFieldHeading')}
          </div>
          <div className='custom-nonce-input'>
            <TextField
              type='number'
              min='0'
              placeholder={
                typeof nextNonce === 'number' ? nextNonce.toString() : null
              }
              onChange={({ target: { value } }) => {
                if (!value.length || Number(value) < 0) {
                  updateCustomNonce('')
                } else {
                  updateCustomNonce(String(Math.floor(value)))
                }

                getNextNonce()
              }}
              fullWidth
              margin='dense'
              value={customNonceValue || ''}
            />
          </div>
        </div>
      </div>
    ) : null
    return (
      <div className='confirm-page-container-content__details'>
        <TransactionDetail
          rows={[
            <TransactionDetailItem
              key='gas-item'
              detailTitle={
                txData.dappSuggestedGasFees ? (
                  <>
                    {t('transactionDetailDappGasHeading', [
                      getRequestingOrigin(),
                    ])}
                    <InfoTooltip
                      contentText={t('transactionDetailDappGasTooltip')}
                      position='top'
                    ></InfoTooltip>
                  </>
                ) : (
                  <>
                    {t('transactionDetailGasHeading')}
                    <InfoTooltip
                      contentText={
                        <>
                          <p>{t('transactionDetailGasTooltipIntro')}</p>
                          <p>{t('transactionDetailGasTooltipExplanation')}</p>
                          {/* <p>
            <a
            href="https://community.metamask.io/t/what-is-gas-why-do-transactions-take-so-long/3172"
            target="_blank"
            rel="noopener noreferrer"
            >
            {t('transactionDetailGasTooltipConversion')}
            </a>
            </p> */}
                        </>
                      }
                      position='top'
                    ></InfoTooltip>
                  </>
                )
              }
              detailTotal={
                <div className='confirm-page-container-content__currency-container'>
                  {renderHeartBeatIfNotInTest()}
                  <img
                    width={10}
                    style={{
                      marginRight: '6px',
                    }}
                    src='images/icons/edit.png'
                    onClick={() => {
                      this.handleEditGas()
                    }}
                  />
                  <UserPreferencedCurrencyDisplay
                    type={PRIMARY}
                    value={hexMinimumTransactionFee}
                    hideLabel={!useNativeCurrencyAsPrimaryCurrency}
                  />
                </div>
              }
              detailText={null} // detailText={
              //   <div className='confirm-page-container-content__currency-container'>
              //     {renderHeartBeatIfNotInTest()}
              //     <UserPreferencedCurrencyDisplay
              //       prefix='≈ '
              //       type={SECONDARY}
              //       value={hexMinimumTransactionFee}
              //       hideLabel
              //     />
              //   </div>
              // }
              subText={t('editGasSubTextFee', [
                <div
                  key='editGasSubTextFeeValue'
                  className='confirm-page-container-content__currency-container confirm-page-container-content__currency-container2'
                >
                  {renderHeartBeatIfNotInTest()}
                  <div
                    style={{
                      marginRight: '4px',
                    }}
                  >
                    {t('maxFee')}:
                  </div>
                  <UserPreferencedCurrencyDisplay
                    className='max-fee-amount-wrap'
                    key='editGasSubTextFeeAmount'
                    type={PRIMARY}
                    value={hexMaximumTransactionFee}
                    hideLabel={!useNativeCurrencyAsPrimaryCurrency}
                  />
                </div>,
                <></>,
              ])}
              subTitle={
                <GasTiming
                  maxPriorityFeePerGas={hexWEIToDecGWEI(
                    maxPriorityFeePerGas ||
                      txData.txParams.maxPriorityFeePerGas,
                  )}
                  maxFeePerGas={hexWEIToDecGWEI(
                    maxFeePerGas || txData.txParams.maxFeePerGas,
                  )}
                />
              }
            />,
            <TransactionDetailItem
              key='total-item'
              detailTitle={t('total')} // detailText={<></>}
              detailTotal={renderTotalMaxAmount()}
              detailText={
                <div className='confirm-transaction-total-detail-text'>
                  {renderTotalDetailText()}
                </div>
              } // detailTotal={renderTotalDetailTotal()}
              subTitle={<></>}
              subText={<></>} // subTitle={t('transactionDetailGasTotalSubtitle')}
              // subText={t('editGasSubTextAmount', [
              //   <b key="editGasSubTextAmountLabel">
              //     {t('editGasSubTextAmountLabel')}
              //   </b>,
              //   renderTotalMaxAmount(),
              // ])}
            />,
          ]}
        />
        {nonceField}
      </div>
    )
  }

  renderData(functionType) {
    const { t } = this.context
    const {
      txData: { txParams: { data } = {} } = {},
      methodData: { params } = {},
      hideData,
      dataComponent,
    } = this.props

    if (hideData) {
      return null
    }

    return (
      dataComponent || (
        <div className='confirm-page-container-content__data'>
          <div className='confirm-page-container-content__data-box-label'>
            {`${t('functionType')}:`}
            <span className='confirm-page-container-content__function-type'>
              {functionType}
            </span>
          </div>
          {params && (
            <div className='confirm-page-container-content__data-box'>
              <div className='confirm-page-container-content__data-field-label'>
                {`${t('parameters')}:`}
              </div>
              <div>
                <pre>{JSON.stringify(params, null, 2)}</pre>
              </div>
            </div>
          )}
          <div className='confirm-page-container-content__data-box-label'>
            {`${t('hexData')}: ${toBuffer(data).length} bytes`}
          </div>
          <div className='confirm-page-container-content__data-box'>{data}</div>
        </div>
      )
    )
  }

  handleEdit() {
    const {
      txData,
      tokenData,
      tokenProps,
      onEdit,
      actionKey,
      txData: { origin },
      methodData = {},
    } = this.props
    onEdit({
      txData,
      tokenData,
      tokenProps,
    })
  }

  handleCancelAll() {
    const {
      cancelAllTransactions,
      clearConfirmTransaction,
      history,
      mostRecentOverviewPage,
      showRejectTransactionsConfirmationModal,
      unapprovedTxCount,
    } = this.props
    showRejectTransactionsConfirmationModal({
      unapprovedTxCount,
      onSubmit: async () => {
        this._removeBeforeUnload()

        await cancelAllTransactions()
        clearConfirmTransaction()
        history.push(mostRecentOverviewPage)
      },
    })
  }

  handleCancel() {
    const {
      txData,
      cancelTransaction,
      history,
      mostRecentOverviewPage,
      clearConfirmTransaction,
      updateCustomNonce,
    } = this.props

    this._removeBeforeUnload()

    updateCustomNonce('')
    cancelTransaction(txData).then(() => {
      clearConfirmTransaction()
      history.push(mostRecentOverviewPage)
    })
  }

  handleSubmit() {
    const {
      sendTransaction,
      clearConfirmTransaction,
      txData,
      history,
      mostRecentOverviewPage,
      updateCustomNonce,
      maxFeePerGas,
      maxPriorityFeePerGas,
      baseFeePerGas,
    } = this.props
    const { submitting } = this.state

    if (submitting) {
      return
    }

    if (baseFeePerGas) {
      txData.estimatedBaseFee = baseFeePerGas
    }

    if (maxFeePerGas) {
      txData.txParams = { ...txData.txParams, maxFeePerGas }
    }

    if (maxPriorityFeePerGas) {
      txData.txParams = { ...txData.txParams, maxPriorityFeePerGas }
    }

    this.setState(
      {
        submitting: true,
        submitError: null,
      },
      () => {
        this._removeBeforeUnload()

        const reportTxData = cloneDeep(txData)

        if (localStorage[SEND_BEIDGE_TOKEN]) {
          reportTxData.tokenAddress = localStorage[SEND_BEIDGE_TOKEN]
          reportTxData.type = 'crossChain'
          localStorage.removeItem(SEND_BEIDGE_TOKEN)
        }

        if (localStorage[SEND_ASSET_TOKEN_ADDRESS]) {
          reportTxData.tokenAddress = localStorage[SEND_ASSET_TOKEN_ADDRESS]
          localStorage.removeItem(SEND_ASSET_TOKEN_ADDRESS)
        }

        this.context.recordTransaction(reportTxData)
        sendTransaction(txData)
          .then(() => {
            clearConfirmTransaction()
            this.setState(
              {
                submitting: false,
              },
              () => {
                history.push(mostRecentOverviewPage)
                updateCustomNonce('')
              },
            )
          })
          .catch((error) => {
            this.setState({
              submitting: false,
              submitError: error.message,
            })
            updateCustomNonce('')
          })
      },
    )
  }

  renderTitleComponent() {
    const { title, hexTransactionAmount } = this.props // Title string passed in by props takes priority

    if (title) {
      return null
    }

    return (
      <UserPreferencedCurrencyDisplay
        value={hexTransactionAmount}
        type={PRIMARY}
        ethLogoHeight='26'
        hideLabel
      />
    )
  }

  renderSubtitleComponent() {
    const { subtitleComponent, hexTransactionAmount } = this.props
    return (
      subtitleComponent || (
        <UserPreferencedCurrencyDisplay
          value={hexTransactionAmount}
          type={SECONDARY}
          hideLabel
        />
      )
    )
  }

  handleNextTx(txId) {
    const { history, clearConfirmTransaction } = this.props

    if (txId) {
      clearConfirmTransaction()
      history.push(`${CONFIRM_TRANSACTION_ROUTE}/${txId}`)
    }
  }

  getNavigateTxData() {
    const { currentNetworkUnapprovedTxs, txData: { id } = {} } = this.props
    const enumUnapprovedTxs = Object.keys(currentNetworkUnapprovedTxs)
    const currentPosition = enumUnapprovedTxs.indexOf(id ? id.toString() : '')
    return {
      totalTx: enumUnapprovedTxs.length,
      positionOfCurrentTx: currentPosition + 1,
      nextTxId: enumUnapprovedTxs[currentPosition + 1],
      prevTxId: enumUnapprovedTxs[currentPosition - 1],
      showNavigation: enumUnapprovedTxs.length > 1,
      firstTx: enumUnapprovedTxs[0],
      lastTx: enumUnapprovedTxs[enumUnapprovedTxs.length - 1],
      ofText: this.context.t('ofTextNofM'),
      requestsWaitingText: this.context.t('requestsAwaitingAcknowledgement'),
    }
  }

  _beforeUnload = () => {
    const { txData: { id } = {}, cancelTransaction } = this.props
    cancelTransaction({
      id,
    })
  }
  _beforeUnloadForGasPolling = () => {
    this._isMounted = false

    if (this.state.pollingToken) {
      disconnectGasFeeEstimatePoller(this.state.pollingToken)
      removePollingTokenFromAppState(this.state.pollingToken)
    }
  }
  _removeBeforeUnload = () => {
    if (getEnvironmentType() === ENVIRONMENT_TYPE_NOTIFICATION) {
      window.removeEventListener('beforeunload', this._beforeUnload)
    }

    window.removeEventListener('beforeunload', this._beforeUnloadForGasPolling)
  }

  componentDidMount() {
    this._isMounted = true
    const {
      toAddress,
      txData: { origin } = {},
      getNextNonce,
      tryReverseResolveAddress,
    } = this.props

    if (getEnvironmentType() === ENVIRONMENT_TYPE_NOTIFICATION) {
      window.addEventListener('beforeunload', this._beforeUnload)
    }

    getNextNonce()

    if (toAddress) {
      tryReverseResolveAddress(toAddress)
    }
    /**
     * This makes a request to get estimates and begin polling, keeping track of the poll
     * token in component state.
     * It then disconnects polling upon componentWillUnmount. If the hook is unmounted
     * while waiting for `getGasFeeEstimatesAndStartPolling` to resolve, the `_isMounted`
     * flag ensures that a call to disconnect happens after promise resolution.
     */

    getGasFeeEstimatesAndStartPolling().then((pollingToken) => {
      if (this._isMounted) {
        addPollingTokenToAppState(pollingToken)
        this.setState({
          pollingToken,
        })
      } else {
        disconnectGasFeeEstimatePoller(pollingToken)
        removePollingTokenFromAppState(this.state.pollingToken)
      }
    })
    window.addEventListener('beforeunload', this._beforeUnloadForGasPolling)
  }

  componentWillUnmount() {
    this._beforeUnloadForGasPolling()

    this._removeBeforeUnload()
  }

  render() {
    const { t } = this.context
    const {
      tokenData,
      tokenProps,
      fromName,
      fromAddress,
      toName,
      toAddress,
      toEns,
      toNickname,
      methodData,
      title,
      hideSubtitle,
      identiconAddress,
      contentComponent,
      onEdit,
      nonce,
      customNonceValue,
      assetImage,
      unapprovedTxCount,
      type,
      hideSenderToRecipient,
      showAccountInHeader,
      txData,
      gasIsLoading,
      gasFeeIsCustom,
    } = this.props
    const {
      submitting,
      submitError,
      submitWarning,
      ethGasPriceWarning,
      editingGas,
    } = this.state
    const { name } = methodData
    const { valid, errorKey } = this.getErrorKey()
    const {
      totalTx,
      positionOfCurrentTx,
      nextTxId,
      prevTxId,
      showNavigation,
      firstTx,
      lastTx,
      ofText,
      requestsWaitingText,
    } = this.getNavigateTxData()
    let functionType = getMethodName(name)

    if (!functionType) {
      if (type) {
        functionType = getTransactionTypeTitle(t, type)
      } else {
        functionType = t('contractInteraction')
      }
    }

    return (
      <ConfirmPageContainer
        tokenData={{
          address: tokenData?.args?.[0],
          symbol: tokenProps?.symbol,
        }}
        fromName={fromName}
        fromAddress={fromAddress}
        showAccountInHeader={showAccountInHeader}
        toName={toName}
        toAddress={toAddress}
        toEns={toEns}
        toNickname={toNickname}
        showEdit={Boolean(onEdit)}
        action={functionType}
        title={title}
        titleComponent={this.renderTitleComponent()}
        subtitleComponent={this.renderSubtitleComponent()}
        hideSubtitle={hideSubtitle}
        detailsComponent={this.renderDetails()}
        dataComponent={this.renderData(functionType)}
        contentComponent={contentComponent}
        nonce={customNonceValue || nonce}
        unapprovedTxCount={unapprovedTxCount}
        assetImage={assetImage}
        identiconAddress={identiconAddress}
        errorMessage={submitError}
        errorKey={errorKey}
        warning={submitWarning}
        totalTx={totalTx}
        positionOfCurrentTx={positionOfCurrentTx}
        nextTxId={nextTxId}
        prevTxId={prevTxId}
        showNavigation={showNavigation}
        onNextTx={(txId) => this.handleNextTx(txId)}
        firstTx={firstTx}
        lastTx={lastTx}
        ofText={ofText}
        requestsWaitingText={requestsWaitingText}
        disabled={!valid || submitting || (gasIsLoading && !gasFeeIsCustom)}
        onEdit={() => this.handleEdit()}
        onCancelAll={() => this.handleCancelAll()}
        onCancel={() => this.handleCancel()}
        onSubmit={() => this.handleSubmit()}
        hideSenderToRecipient={hideSenderToRecipient}
        origin={txData.origin}
        ethGasPriceWarning={ethGasPriceWarning}
        editingGas={editingGas}
        handleCloseEditGas={() => this.handleCloseEditGas()}
        currentTransaction={txData}
      />
    )
  }
}
export function getMethodName(camelCase) {
  if (!camelCase || typeof camelCase !== 'string') {
    return ''
  }

  return camelCase
    .replace(/([a-z])([A-Z])/gu, '$1 $2')
    .replace(/([A-Z])([a-z])/gu, ' $1$2')
    .replace(/ +/gu, ' ')
}
