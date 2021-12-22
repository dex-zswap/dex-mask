import React, { Component } from 'react';
import SiteIcon from '@c/ui/site-icon';
export default class PermissionsConnectHeader extends Component {
  renderHeaderIcon() {
    const { icon, iconName, siteOrigin } = this.props;
    return (
      <div className="permissions-connect-header__icon">
        <SiteIcon icon={icon} name={iconName} size={64} />
        <div className="permissions-connect-header__text">{siteOrigin}</div>
      </div>
    );
  }

  render() {
    const { headerTitle, headerText } = this.props;
    return (
      <div className="permissions-connect-header">
        {this.renderHeaderIcon()}
        {headerTitle && (
          <div className="permissions-connect-header__title">{headerTitle}</div>
        )}
        <div className="permissions-connect-header__subtitle">{headerText}</div>
      </div>
    );
  }
}
