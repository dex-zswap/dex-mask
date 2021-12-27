import React, { PureComponent } from 'react'
import {
  createCustomExplorerLink,
  getBlockExplorerLink,
} from '@metamask/etherscan-link'
import copyToClipboard from 'copy-to-clipboard'
import PropTypes from 'prop-types'
import TransactionActivityLog from '@c/app/transaction/activity-log'
import TransactionBreakdown from '@c/app/transaction/breakdown'
import Button from '@c/ui/button'
import Copy from '@c/ui/icon/copy-icon.component'
import Popover from '@c/ui/popover'
import SenderToRecipient from '@c/ui/sender-to-recipient'
import { FLAT_VARIANT } from '@c/ui/sender-to-recipient/constants'
import Tooltip from '@c/ui/tooltip'
import { shortenAddress } from '@view/helpers/utils'
import {
  CHAINID_EXPLORE_MAP,
  MAINNET_CHAIN_ID,
  NETWORK_TO_NAME_MAP,
} from '@shared/constants/network'
import { SECOND } from '@shared/constants/time'
import { TRANSACTION_TYPES } from '@shared/constants/transaction'
export default class TransactionListItemDetails extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  }
  static defaultProps = {
    recipientEns: null,
  }
  state = {
    justCopied: false,
  }
  handleBlockExplorerClick = () => {
    const {
      transactionGroup: { primaryTransaction },
      rpcPrefs,
    } = this.props
    const { chainId, hash } = primaryTransaction
    let blockExplorerLink = getBlockExplorerLink(primaryTransaction, rpcPrefs)

    if (!blockExplorerLink && CHAINID_EXPLORE_MAP[chainId]) {
      blockExplorerLink = createCustomExplorerLink(
        hash,
        CHAINID_EXPLORE_MAP[chainId],
      )
    }

    global.platform.openTab({
      url: blockExplorerLink,
    })
  }
  handleCancel = (event) => {
    const { onCancel, onClose } = this.props
    onCancel(event)
    onClose()
  }
  handleRetry = (event) => {
    const { onClose, onRetry } = this.props
    onRetry(event)
    onClose()
  }
  handleCopyTxId = () => {
    const { transactionGroup } = this.props
    const { primaryTransaction: transaction } = transactionGroup
    const { hash } = transaction
    copyToClipboard(hash)
    this.setState(
      {
        justCopied: true,
      },
      () => {
        setTimeout(
          () =>
            this.setState({
              justCopied: false,
            }),
          SECOND,
        )
      },
    )
  }

  componentDidMount() {
    const { recipientAddress, tryReverseResolveAddress } = this.props

    if (recipientAddress) {
      tryReverseResolveAddress(recipientAddress)
    }
  }

  renderCancel() {
    const { t } = this.context
    const { showCancel, cancelDisabled } = this.props

    if (!showCancel) {
      return null
    }

    return cancelDisabled ? (
      <Tooltip title={t('notEnoughGas')} position='bottom'>
        <div>
          <Button
            className='transaction-list-item-details__header-button function'
            disabled
          >
            {t('cancel')}
          </Button>
        </div>
      </Tooltip>
    ) : (
      <Button
        onClick={this.handleCancel}
        className='transaction-list-item-details__header-button function'
      >
        {t('cancel')}
      </Button>
    )
  }

  getFunctionButtonsCount() {
    const { showCancel, showSpeedUp, showRetry } = this.props
    let count = 3

    if (!showCancel) {
      count--
    }

    if (!showSpeedUp) {
      count--
    }

    if (!showRetry) {
      count--
    }

    return count
  }

  render() {
    const { t } = this.context
    const { justCopied } = this.state
    const {
      transactionGroup,
      primaryCurrency,
      showSpeedUp,
      showRetry,
      recipientEns,
      recipientAddress,
      rpcPrefs: { blockExplorerUrl } = {},
      senderAddress,
      isEarliestNonce,
      senderNickname,
      title,
      onClose,
      recipientNickname,
      provider,
    } = this.props
    const {
      primaryTransaction: transaction,
      initialTransaction: { type },
    } = transactionGroup
    const { hash, chainId } = transaction
    const isMainnet = chainId === MAINNET_CHAIN_ID
    const providerType =
      NETWORK_TO_NAME_MAP[provider.type] ?? provider.type.toUpperCase()
    const buttonsCount = this.getFunctionButtonsCount()
    return (
      <Popover title={title} onClose={onClose}>
        <div className='transaction-list-item-details'>
          {buttonsCount ? (
            <div className='transaction-list-item-details__header-buttons functionial'>
              {showSpeedUp && (
                <Button
                  type='primary'
                  onClick={this.handleRetry}
                  className='transaction-list-item-details__header-button function'
                >
                  {t('speedUp')}
                </Button>
              )}
              {this.renderCancel()}
              {showRetry && (
                <Tooltip title={t('retryTransaction')}>
                  <Button
                    type='transparent'
                    onClick={this.handleRetry}
                    className='transaction-list-item-details__header-button function'
                  >
                    <i className='fa fa-sync'></i>
                  </Button>
                </Tooltip>
              )}
            </div>
          ) : null}
          <div className='transaction-list-item-details__header'>
            <div>{t('details')}</div>
            <div className='transaction-list-item-details__header-buttons'>
              <Tooltip
                wrapperClassName='transaction-list-item-details__header-button'
                containerClassName='transaction-list-item-details__header-button-tooltip-container'
                position='top'
                title={
                  justCopied ? t('copiedTransactionId') : t('copyTransactionId')
                }
              >
                <Button
                  type='transparent'
                  onClick={this.handleCopyTxId}
                  disabled={!hash}
                  as='div'
                >
                  <div className='copy'></div>
                </Button>
              </Tooltip>
              <Tooltip
                position='top'
                wrapperClassName='transaction-list-item-details__header-button'
                containerClassName='transaction-list-item-details__header-button-tooltip-container'
                title={
                  blockExplorerUrl
                    ? t('viewOnCustomBlockExplorer', [blockExplorerUrl])
                    : isMainnet
                    ? t('viewOnEtherscan')
                    : t('viewinExplorer', [providerType])
                }
              >
                <Button
                  type='transparent'
                  onClick={this.handleBlockExplorerClick}
                  disabled={!hash}
                >
                  <div className='view'></div>
                </Button>
              </Tooltip>
            </div>
          </div>
          <div className='transaction-list-item-details__body'>
            <div className='transaction-list-item-details__sender-to-recipient-container'>
              <SenderToRecipient
                warnUserOnAccountMismatch={false}
                variant={FLAT_VARIANT}
                addressOnly
                recipientEns={recipientEns}
                recipientAddress={shortenAddress(recipientAddress, 11, -6)}
                recipientNickname={recipientNickname}
                senderName={senderNickname}
                senderAddress={shortenAddress(senderAddress, 11, -6)}
                onRecipientClick={() => {}}
                addressOnly
              />
            </div>
            <div className='transaction-list-item-details__cards-container'>
              <TransactionBreakdown
                nonce={transactionGroup.initialTransaction.txParams.nonce}
                isTokenApprove={type === TRANSACTION_TYPES.TOKEN_METHOD_APPROVE}
                transaction={transaction}
                primaryCurrency={primaryCurrency}
                className='transaction-list-item-details__transaction-breakdown'
              />
              <TransactionActivityLog
                transactionGroup={transactionGroup}
                className='transaction-list-item-details__transaction-activity-log'
                onCancel={this.handleCancel}
                onRetry={this.handleRetry}
                isEarliestNonce={isEarliestNonce}
              />
            </div>
          </div>
        </div>
      </Popover>
    )
  }
}
