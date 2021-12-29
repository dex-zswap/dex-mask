import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { useI18nContext } from '@view/hooks/useI18nContext'

const Popover = ({
  title,
  subtitle = '',
  children,
  footer,
  footerClassName,
  onBack,
  onClose,
  className,
  contentClassName,
  showArrow,
  CustomBackground,
  popoverRef,
  centerTitle,
}) => {
  const t = useI18nContext()
  return (
    <div className='dex-popover-container'>
      {CustomBackground ? (
        <CustomBackground onClose={onClose} />
      ) : (
        <div className='dex-popover-bg' onClick={onClose} />
      )}
      <section
        className={classnames('dex-popover-wrap', className)}
        ref={popoverRef}
      >
        {showArrow ? <div className='dex-popover-arrow' /> : null}
        <header className='dex-popover-header'>
          <div
            className={classnames(
              'dex-popover-header__title',
              centerTitle ? 'center' : '',
            )}
          >
            <h2 title={title}>
              {onBack ? (
                <button
                  className='fas fa-chevron-left dex-popover-header__button'
                  title={t('back')}
                  onClick={onBack}
                />
              ) : null}
              {title}
            </h2>
            {onClose ? (
              <button
                className='fas fa-times dex-popover-header__button'
                title={t('close')}
                data-testid='dex-popover-close'
                onClick={onClose}
              />
            ) : null}
          </div>
          {subtitle ? (
            <p className='dex-popover-header__subtitle'>{subtitle}</p>
          ) : null}
        </header>
        {children ? (
          <div className={classnames('dex-popover-content', contentClassName)}>
            {children}
          </div>
        ) : null}
        {footer ? (
          <footer className={classnames('dex-popover-footer', footerClassName)}>
            {footer}
          </footer>
        ) : null}
      </section>
    </div>
  )
}

export default class PopoverWrapper extends PureComponent {
  static propTypes = Popover.propTypes
  rootNode = document.getElementById('popover-content')
  body = document.querySelector('body')
  instanceNode = document.createElement('div')
  overHiddenClass = 'overflow-hidden'

  alreadyContainClass() {
    return this.body.classList.contains(this.overHiddenClass);
  }


  componentDidMount() {
    if (!this.rootNode) {
      return
    }

    this.rootNode.appendChild(this.instanceNode)

    this.body.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    if (!this.alreadyContainClass()) {
      this.body.classList.add('overflow-hidden')
    }
  }

  componentWillUnmount() {
    if (!this.rootNode) {
      return
    }

    this.rootNode.removeChild(this.instanceNode)
    if (this.alreadyContainClass()) {
      this.body.classList.remove('overflow-hidden')
    }
  }

  render() {
    const children = <Popover {...this.props} />
    return this.rootNode
      ? ReactDOM.createPortal(children, this.instanceNode)
      : children
  }
}
