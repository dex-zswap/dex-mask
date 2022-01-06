import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Modal from '@c/app/modal'
export default class RejectTransactionsModal extends PureComponent {
  static contextTypes = {
    t: PropTypes.func.isRequired,
  }
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    unapprovedTxCount: PropTypes.number.isRequired,
  }
  onSubmit = async () => {
    const { onSubmit, hideModal } = this.props
    await onSubmit()
    hideModal()
  }

  render() {
    const { t } = this.context
    const { hideModal, unapprovedTxCount } = this.props
    return (
      <Modal
        headerText={t('rejectTxsN', [unapprovedTxCount])}
        onClose={hideModal}
        onSubmit={this.onSubmit}
        onCancel={hideModal}
        submitText={t('rejectAll')}
        cancelText={t('cancel')}
        submitType='warning'
      >
        <div>
          <div className='reject-transactions__description'>
            {t('rejectTxsDescription', [unapprovedTxCount])}
          </div>
        </div>
      </Modal>
    )
  }
}
