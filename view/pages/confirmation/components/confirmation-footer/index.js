import Button from '@c/ui/button';
import PropTypes from 'prop-types';
import React from 'react';

export default function ConfirmationFooter({
  onApprove,
  onCancel,
  approveText,
  cancelText,
  alerts,
}) {
  return (
    <div className="confirmation-footer">
      {alerts}
      <div className="confirmation-footer__actions">
        <Button onClick={onCancel}>{cancelText}</Button>
        <Button type="primary" onClick={onApprove}>
          {approveText}
        </Button>
      </div>
    </div>
  );
}

ConfirmationFooter.propTypes = {
  alerts: PropTypes.node,
  onApprove: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  approveText: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
};
