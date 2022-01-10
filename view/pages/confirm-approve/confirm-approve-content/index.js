import React, { Component } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import Box from '@c/ui/box'
import Button from '@c/ui/button'
import Typography from '@c/ui/typography'
import {
  FONT_WEIGHT,
  JUSTIFY_CONTENT,
  TYPOGRAPHY,
} from '@view/helpers/constants/design-system'
import { addressSummary } from '@view/helpers/utils'
import { formatCurrency } from '@view/helpers/utils/confirm-tx.util'
export default class ConfirmApproveContent extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }
  static propTypes = {
    decimals: PropTypes.number,
    tokenAmount: PropTypes.string,
    customTokenAmount: PropTypes.string,
    tokenSymbol: PropTypes.string,
    siteImage: PropTypes.string,
    showCustomizeGasModal: PropTypes.func,
    showEditApprovalPermissionModal: PropTypes.func,
    origin: PropTypes.string,
    setCustomAmount: PropTypes.func,
    tokenBalance: PropTypes.string,
    data: PropTypes.string,
    toAddress: PropTypes.string,
    currentCurrency: PropTypes.string,
    nativeCurrency: PropTypes.string,
    fiatTransactionTotal: PropTypes.string,
    ethTransactionTotal: PropTypes.string,
    useNonceField: PropTypes.bool,
    customNonceValue: PropTypes.string,
    updateCustomNonce: PropTypes.func,
    getNextNonce: PropTypes.func,
    nextNonce: PropTypes.number,
    showCustomizeNonceModal: PropTypes.func,
    warning: PropTypes.string,
  }
  state = {
    showFullTxDetails: false,
  }

  renderApproveContentCard({
    showHeader = true,
    symbol,
    title,
    showEdit,
    onEditClick,
    content,
    footer,
  }) {
    const { t } = this.context
    return (
      <div className='confirm-approve-card base-width'>
        {showHeader && (
          <div className='confirm-approve-card-header'>
            <div>
              <div>{symbol}</div>
              <div>{title}</div>
            </div>
            {showEdit && (
              <div
                className='confirm-approve-card-header-edit'
                onClick={() => onEditClick()}
              >
                {t('edit')}
              </div>
            )}
          </div>
        )}
        {content}
        {footer}
      </div>
    )
  } // TODO: Add "Learn Why" with link to the feeAssociatedRequest text

  renderTransactionDetailsContent() {
    const { t } = this.context
    const {
      currentCurrency,
      nativeCurrency,
      ethTransactionTotal,
      fiatTransactionTotal,
    } = this.props
    return (
      <div className='confirm-approve-trans-fee-wrap'>
        <div>{t('feeAssociatedRequest')}</div>
        <div>
          <div>{formatCurrency(fiatTransactionTotal, currentCurrency)}</div>
          <div>
            <div>{ethTransactionTotal}</div>
            <div>{nativeCurrency}</div>
          </div>
        </div>
      </div>
    )
  }

  renderPermissionContent() {
    const { t } = this.context
    const {
      customTokenAmount,
      tokenAmount,
      tokenSymbol,
      origin,
      toAddress,
    } = this.props
    return (
      <div className='flex-column'>
        <div className='confirm-approve-card-content-row mb-15'>
          {t('accessAndSpendNotice', [origin])}
        </div>
        <div className='confirm-approve-card-label-value-row mb-15'>
          <span>{t('amountWithColon')}</span>
          <span>{`${Number(
            customTokenAmount || tokenAmount,
          )} ${tokenSymbol}`}</span>
        </div>
        <div className='confirm-approve-card-label-value-row'>
          <span>{t('toWithColon')}</span>
          <span>{addressSummary(toAddress)}</span>
        </div>
      </div>
    )
  }

  renderDataContent() {
    const { t } = this.context
    const { data } = this.props
    return (
      <div className='flex-column'>
        <div className='confirm-approve-card-content-row mb-15'>
          {t('functionApprove')}
        </div>
        <div className='confirm-approve-card-content-row'>{data}</div>
      </div>
    )
  }

  renderCustomNonceContent() {
    const { t } = this.context
    const {
      useNonceField,
      customNonceValue,
      updateCustomNonce,
      getNextNonce,
      nextNonce,
      showCustomizeNonceModal,
    } = this.props
    return (
      <>
        {useNonceField && (
          <div className='confirm-approve-content__custom-nonce-content'>
            <Box
              className='confirm-approve-content__custom-nonce-header'
              justifyContent={JUSTIFY_CONTENT.FLEX_START}
            >
              <Typography
                variant={TYPOGRAPHY.H6}
                fontWeight={FONT_WEIGHT.NORMAL}
              >
                {t('nonce')}
              </Typography>
              <Button
                type='link'
                className='confirm-approve-content__custom-nonce-edit'
                onClick={() =>
                  showCustomizeNonceModal({
                    nextNonce,
                    customNonceValue,
                    updateCustomNonce,
                    getNextNonce,
                  })
                }
              >
                {t('edit')}
              </Button>
            </Box>
            <Typography
              className='confirm-approve-content__custom-nonce-value'
              variant={TYPOGRAPHY.H6}
              fontWeight={FONT_WEIGHT.BOLD}
            >
              {customNonceValue || nextNonce}
            </Typography>
          </div>
        )}
      </>
    )
  }

  render() {
    const { t } = this.context
    const {
      decimals,
      siteImage,
      tokenAmount,
      customTokenAmount,
      origin,
      tokenSymbol,
      showCustomizeGasModal,
      showEditApprovalPermissionModal,
      setCustomAmount,
      tokenBalance,
      useNonceField,
      warning,
    } = this.props
    const { showFullTxDetails } = this.state
    return (
      <div className='confirm-approve-content'>
        {warning && (
          <div className='confirm-approve-warning-wrap'>{warning}</div>
        )}
        {/* <div className="confirm-approve-content__identicon-wrapper">
        <UrlIcon
        className="confirm-approve-content__identicon"
        fallbackClassName="confirm-approve-content__identicon"
        name={origin ? new URL(origin).hostname : ''}
        url={siteImage}
        />
        </div> */}
        <img height={36} src={siteImage || 'images/logo/logo-text.png'} />
        <div className='confirm-approve-title'>
          {t('allowOriginSpendToken', [origin, tokenSymbol])}
        </div>
        <div className='confirm-approve-desc base-width'>
          {t('trustSiteApprovePermission', [origin, tokenSymbol])}
        </div>
        <div
          className='confirm-approve-edit-wrap'
          onClick={() =>
            showEditApprovalPermissionModal({
              customTokenAmount,
              decimals,
              origin,
              setCustomAmount,
              tokenAmount,
              tokenSymbol,
              tokenBalance,
            })
          }
        >
          <div>{t('editPermission')}</div>
          <img width={12} src='images/icons/edit.png' />
        </div>
        <div className='confirm-approve-line base-width'></div>
        <div className='base-width'>
          {this.renderApproveContentCard({
            symbol: (
              <img
                style={{
                  marginBottom: '-2px',
                }}
                width={13}
                src='images/icons/tag.png'
              />
            ),
            title: 'Transaction Fee',
            showEdit: true,
            onEditClick: showCustomizeGasModal,
            content: this.renderTransactionDetailsContent(),
            footer: !useNonceField && (
              <div
                className={`confirm-approve-show-full-btn ${
                  showFullTxDetails ? 'arrow-up' : ''
                }`}
                onClick={() =>
                  this.setState({
                    showFullTxDetails: !this.state.showFullTxDetails,
                  })
                }
              >
                {t('viewFullTransactionDetails')}
                <img width={8} src='images/icons/arrow-down.png' />
              </div>
            ),
          })}
          {useNonceField &&
            this.renderApproveContentCard({
              showHeader: false,
              content: this.renderCustomNonceContent(),
              useNonceField,
              footer: (
                <div
                  className='confirm-approve-content__view-full-tx-button-wrapper'
                  onClick={() =>
                    this.setState({
                      showFullTxDetails: !this.state.showFullTxDetails,
                    })
                  }
                >
                  <div className='confirm-approve-content__view-full-tx-button cursor-pointer'>
                    <div className='confirm-approve-content__small-blue-text'>
                      {t('viewFullTransactionDetails')}
                    </div>
                    <i
                      className={classnames({
                        'fa fa-caret-up': showFullTxDetails,
                        'fa fa-caret-down': !showFullTxDetails,
                      })}
                    />
                  </div>
                </div>
              ),
            })}
        </div>
        <div className='confirm-approve-line base-width'></div>
        {showFullTxDetails ? (
          <>
            {this.renderApproveContentCard({
              symbol: <img width={13} src='images/icons/person.png' />,
              title: 'Permission',
              content: this.renderPermissionContent(),
              showEdit: true,
              onEditClick: () =>
                showEditApprovalPermissionModal({
                  customTokenAmount,
                  decimals,
                  origin,
                  setCustomAmount,
                  tokenAmount,
                  tokenSymbol,
                  tokenBalance,
                }),
            })}
            <div className='confirm-approve-line base-width'></div>
            {this.renderApproveContentCard({
              symbol: <img width={13} src='images/icons/file.png' />,
              title: 'Data',
              content: this.renderDataContent(),
            })}
          </>
        ) : null}
      </div>
    )
  }
}
