import Button from '@c/ui/button';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class PageContainerHeader extends Component {
  static propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    onClose: PropTypes.func,
    showBackButton: PropTypes.bool,
    onBackButtonClick: PropTypes.func,
    backButtonStyles: PropTypes.object,
    backButtonString: PropTypes.string,
    tabs: PropTypes.node,
    headerCloseText: PropTypes.string,
    className: PropTypes.string,
  };

  renderTabs() {
    const { tabs } = this.props;

    return tabs && <ul className="page-container__tabs">{tabs}</ul>;
  }

  renderHeaderRow() {
    const {
      showBackButton,
      onBackButtonClick,
      backButtonStyles,
      backButtonString,
    } = this.props;

    return (
      showBackButton && (
        <div className="page-container__header-row">
          <span
            className="page-container__back-button"
            onClick={onBackButtonClick}
            style={backButtonStyles}
          >
            {backButtonString || 'Back'}
          </span>
        </div>
      )
    );
  }

  render() {
    const {
      title,
      subtitle,
      onClose,
      tabs,
      headerCloseText,
      className,
    } = this.props;

    return (
      <div
        className={classnames('page-container__header', className, {
          'page-container__header--no-padding-bottom': Boolean(tabs),
        })}
        data-testid="page-container__header"
      >
        {this.renderHeaderRow()}

        {title && <div className="page-container__title">{title}</div>}

        {subtitle && <div className="page-container__subtitle">{subtitle}</div>}

        {onClose && headerCloseText ? (
          <Button
            type="link"
            className="page-container__header-close-text"
            onClick={() => onClose()}
          >
            {headerCloseText}
          </Button>
        ) : (
          onClose && (
            <div
              className="page-container__header-close"
              onClick={() => onClose()}
            />
          )
        )}

        {this.renderTabs()}
      </div>
    );
  }
}
