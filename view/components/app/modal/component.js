import React, { PureComponent } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import Button from '@c/ui/button'
export default class Modal extends PureComponent {
  static defaultProps = {
    submitType: 'secondary',
    cancelType: 'default',
    rounded: false,
  }

  render() {
    const {
      children,
      headerText,
      onClose,
      onSubmit,
      submitType,
      submitText,
      submitDisabled,
      onCancel,
      cancelType,
      cancelText,
      contentClass,
      containerClass,
      hideFooter,
      rounded,
    } = this.props
    return (
      <div className={classnames('modal-container', containerClass)}>
        {headerText && (
          <div className='modal-container__header'>
            <div className='modal-container__header-text'>{headerText}</div>
            <div className='modal-container__header-close' onClick={onClose} />
          </div>
        )}
        <div className={classnames('modal-container__content', contentClass)}>
          {children}
        </div>
        {hideFooter ? null : (
          <div className='modal-container__footer'>
            {onCancel && (
              <Button
                type={cancelType}
                rounded={rounded}
                onClick={onCancel}
                className='modal-container__footer-button'
              >
                {cancelText}
              </Button>
            )}
            <Button
              type={submitType}
              rounded={rounded || false}
              onClick={onSubmit}
              disabled={submitDisabled}
              className='modal-container__footer-button'
            >
              {submitText}
            </Button>
          </div>
        )}
      </div>
    )
  }
}
