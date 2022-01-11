import React, { PureComponent } from 'react'
import BigNumber from 'bignumber.js'
import classnames from 'classnames'
import log from 'loglevel'
import PropTypes from 'prop-types'
import Modal from '@c/app/modal'
import Button from '@c/ui/button'
import Identicon from '@c/ui/identicon'
import TextField from '@c/ui/text-field'
import { calcTokenAmount } from '@view/helpers/utils/token-util'
const MAX_UNSIGNED_256_INT = new BigNumber(2).pow(256).minus(1).toString(10)
export default class EditApprovalPermission extends PureComponent {
  static propTypes = {
    decimals: PropTypes.number,
    hideModal: PropTypes.func.isRequired,
    selectedIdentity: PropTypes.object,
    tokenAmount: PropTypes.string,
    customTokenAmount: PropTypes.string,
    tokenSymbol: PropTypes.string,
    tokenBalance: PropTypes.string,
    setCustomAmount: PropTypes.func,
    origin: PropTypes.string.isRequired,
    requiredMinimum: PropTypes.instanceOf(BigNumber),
  }
  static contextTypes = {
    t: PropTypes.func,
  }
  state = {
    // This is used as a TextField value, which should be a string.
    customSpendLimit: this.props.customTokenAmount || '',
    selectedOptionIsUnlimited: !this.props.customTokenAmount,
  }

  renderModalContent(error) {
    const { t } = this.context
    const {
      hideModal,
      selectedIdentity,
      tokenAmount,
      tokenSymbol,
      tokenBalance,
      customTokenAmount,
      origin,
    } = this.props
    const { name, address } = selectedIdentity || {}
    const { selectedOptionIsUnlimited } = this.state
    return (
      <div className='edit-approval-permission'>
        <div className='edit-approval-permission__header'>
          <div className='edit-approval-permission__title'>
            {t('editPermission')}
          </div>
          <img
            width={10}
            src='images/icons/close.png'
            onClick={() => hideModal()}
          />
        </div>
        <div className='edit-approval-account-wrap'>
          <div className='edit-approval-account'>
            <Identicon address={address} diameter={28} />
            <div>{name}</div>
          </div>
          <div>
            <span>{t('balance')}</span>
            <span>{`${Number(tokenBalance).toPrecision(
              9,
            )} ${tokenSymbol}`}</span>
          </div>
        </div>
        <div className='edit-approval-permission__edit-section'>
          <div className='edit-approval-permission__edit-section__title'>
            {t('spendLimitPermission')}
          </div>
          <div className='edit-approval-permission__edit-section__description'>
            {t('allowWithdrawAndSpend', [origin])}
          </div>
          <div className='edit-approval-permission__edit-section__option'>
            <div
              className='edit-approval-permission-radio-wrap'
              onClick={() =>
                this.setState({
                  selectedOptionIsUnlimited: true,
                })
              }
            >
              {selectedOptionIsUnlimited && (
                <div className='edit-approval-permission-radio'></div>
              )}
            </div>
            <div className='edit-approval-permission__edit-section__option-text'>
              <div
                className={classnames({
                  'edit-approval-permission__edit-section__option-label': !selectedOptionIsUnlimited,
                  'edit-approval-permission__edit-section__option-label--selected': selectedOptionIsUnlimited,
                })}
              >
                {new BigNumber(tokenAmount).lessThan(
                  new BigNumber(tokenBalance),
                )
                  ? t('proposedApprovalLimit')
                  : t('unlimited')}
              </div>
              <div className='edit-approval-permission__edit-section__option-description'>
                {t('spendLimitRequestedBy', [origin])}
              </div>
              <div className='edit-approval-permission__edit-section__option-value'>
                {`${Number(tokenAmount)} ${tokenSymbol}`}
              </div>
            </div>
          </div>
          <div className='edit-approval-permission__edit-section__option'>
            <div
              className='edit-approval-permission-radio-wrap'
              onClick={() =>
                this.setState({
                  selectedOptionIsUnlimited: false,
                })
              }
            >
              {!selectedOptionIsUnlimited && (
                <div className='edit-approval-permission-radio'></div>
              )}
            </div>
            <div className='edit-approval-permission__edit-section__option-text'>
              <div
                className={classnames({
                  'edit-approval-permission__edit-section__option-label': selectedOptionIsUnlimited,
                  'edit-approval-permission__edit-section__option-label--selected': !selectedOptionIsUnlimited,
                })}
              >
                {t('customSpendLimit')}
              </div>
              <div className='edit-approval-permission__edit-section__option-description'>
                {t('enterMaxSpendLimit')}
              </div>
              <div className='edit-approval-permission__edit-section__option-input'>
                <TextField
                  type='number'
                  placeholder={`${Number(
                    customTokenAmount || tokenAmount,
                  )} ${tokenSymbol}`}
                  onChange={(event) => {
                    this.setState({
                      customSpendLimit: event.target.value,
                    })

                    if (selectedOptionIsUnlimited) {
                      this.setState({
                        selectedOptionIsUnlimited: false,
                      })
                    }
                  }}
                  fullWidth
                  margin='dense'
                  value={this.state.customSpendLimit}
                  error={error}
                />
              </div>
            </div>
          </div>
        </div>
        <Button
          className='edit-approval-save-btn'
          type='primary'
          onClick={() => {
            setCustomAmount(selectedOptionIsUnlimited ? '' : customSpendLimit)
            hideModal()
          }}
        >
          {t('save')}
        </Button>
      </div>
    )
  }

  validateSpendLimit() {
    const { t } = this.context
    const { decimals, requiredMinimum } = this.props
    const { selectedOptionIsUnlimited, customSpendLimit } = this.state

    if (selectedOptionIsUnlimited || !customSpendLimit) {
      return undefined
    }

    let customSpendLimitNumber

    try {
      customSpendLimitNumber = new BigNumber(customSpendLimit)
    } catch (error) {
      log.debug(`Error converting '${customSpendLimit}' to BigNumber:`, error)
      return t('spendLimitInvalid')
    }

    if (customSpendLimitNumber.isNegative()) {
      return t('spendLimitInvalid')
    }

    const maxTokenAmount = calcTokenAmount(MAX_UNSIGNED_256_INT, decimals)

    if (customSpendLimitNumber.greaterThan(maxTokenAmount)) {
      return t('spendLimitTooLarge')
    }

    if (
      requiredMinimum !== undefined &&
      customSpendLimitNumber.lessThan(requiredMinimum)
    ) {
      return t('spendLimitInsufficient')
    }

    return undefined
  }

  render() {
    const { t } = this.context
    const { setCustomAmount, hideModal, customTokenAmount } = this.props
    const { selectedOptionIsUnlimited, customSpendLimit } = this.state
    const error = this.validateSpendLimit()
    const disabled = Boolean(
      (customSpendLimit === customTokenAmount && !selectedOptionIsUnlimited) ||
        error,
    )
    return (
      <Modal
        contentClass='edit-approval-permission-modal-content'
        submitDisabled={disabled}
        hideFooter
      >
        {this.renderModalContent(error)}
      </Modal>
    )
  }
}
