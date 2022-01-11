import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ErrorMessage from '@c/ui/error-message'
import { PageContainerFooter } from '@c/ui/page-container'
import Tabs from '@c/ui/tabs'
import { ConfirmPageContainerWarning } from '.'
export default class ConfirmPageContainerContent extends Component {
  static contextTypes = {
    t: PropTypes.func.isRequired,
  }
  static propTypes = {
    action: PropTypes.string,
    dataComponent: PropTypes.node,
    detailsComponent: PropTypes.node,
    errorKey: PropTypes.string,
    errorMessage: PropTypes.string,
    hideSubtitle: PropTypes.bool,
    identiconAddress: PropTypes.string,
    nonce: PropTypes.string,
    assetImage: PropTypes.string,
    subtitleComponent: PropTypes.node,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    titleComponent: PropTypes.node,
    warning: PropTypes.string,
    origin: PropTypes.string.isRequired,
    ethGasPriceWarning: PropTypes.string,
    // Footer
    onCancelAll: PropTypes.func,
    onCancel: PropTypes.func,
    cancelText: PropTypes.string,
    onSubmit: PropTypes.func,
    submitText: PropTypes.string,
    disabled: PropTypes.bool,
    unapprovedTxCount: PropTypes.number,
    rejectNText: PropTypes.string,
  }

  renderContent() {
    const { detailsComponent, dataComponent } = this.props

    if (detailsComponent && dataComponent) {
      return detailsComponent // return this.renderTabs()
    }

    return detailsComponent || dataComponent
  }

  renderTabs() {
    const { t } = this.context
    const { detailsComponent, dataComponent } = this.props
    return (
      <Tabs
        actived='details'
        tabs={[
          {
            label: t('details'),
            key: 'details',
          },
          {
            label: t('data'),
            key: 'data',
          },
        ]}
      >
        <div className='confirm-page-container-content__tab'>
          {detailsComponent}
        </div>
        <div className='confirm-page-container-content__tab'>
          {dataComponent}
        </div>
      </Tabs>
    )
  }

  render() {
    const {
      action,
      errorKey,
      errorMessage,
      title,
      titleComponent,
      subtitleComponent,
      hideSubtitle,
      identiconAddress,
      nonce,
      assetImage,
      detailsComponent,
      dataComponent,
      warning,
      onCancelAll,
      onCancel,
      cancelText,
      onSubmit,
      submitText,
      disabled,
      unapprovedTxCount,
      rejectNText,
      origin,
      ethGasPriceWarning,
    } = this.props
    return (
      <div className='confirm-page-container-content'>
        {warning && <ConfirmPageContainerWarning warning={warning} />}
        {ethGasPriceWarning && (
          <ConfirmPageContainerWarning warning={ethGasPriceWarning} />
        )}
        {/* <ConfirmPageContainerSummary
        className={classnames({
        'confirm-page-container-summary--border':
        !detailsComponent || !dataComponent,
        })}
        action={action}
        title={title}
        titleComponent={titleComponent}
        subtitleComponent={subtitleComponent}
        hideSubtitle={hideSubtitle}
        identiconAddress={identiconAddress}
        nonce={nonce}
        assetImage={assetImage}
        origin={origin}
        /> */}
        {this.renderContent()}
        {/* {(errorKey || errorMessage) && (
        <div className='confirm-page-container-content__error-container'>
         <ErrorMessage errorMessage={errorMessage} errorKey={errorKey} />
        </div>
        )} */}
        <div className='confirm-page-container-content__error-container'>
          <ErrorMessage errorMessage={errorMessage} errorKey={errorKey} />
        </div>
        <PageContainerFooter
          footerClassName='confirm-transaction-footer'
          onCancel={onCancel}
          cancelText={cancelText}
          onSubmit={onSubmit}
          submitText={submitText}
          submitButtonType='primary'
          disabled={disabled}
        >
          {unapprovedTxCount > 1 && <a onClick={onCancelAll}>{rejectNText}</a>}
        </PageContainerFooter>
      </div>
    )
  }
}
