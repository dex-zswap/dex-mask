import React from 'react'
import PropTypes from 'prop-types'
import Button from '@c/ui/button'
export default function ConfirmationFooter({
  onApprove,
  onCancel,
  approveText,
  cancelText,
  alerts,
}) {
  return (
    <div className='confirmation-footer'>
      {alerts}
      <div className='confirmation-footer__actions flex space-between'>
        <Button className='half-button' onClick={onCancel}>
          {cancelText}
        </Button>
        <Button className='half-button' type='primary' onClick={onApprove}>
          {approveText}
        </Button>
      </div>
    </div>
  )
}
