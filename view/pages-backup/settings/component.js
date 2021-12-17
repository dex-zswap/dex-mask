import React, { PureComponent } from 'react';
import { matchPath, Route, Switch } from 'react-router-dom';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import PageTitle from '@c/app/page-title';
import TabBar from '@c/app/tab-bar';
import {
  ABOUT_US_ROUTE,
  ADVANCED_ROUTE,
  ALERTS_ROUTE,
  CONTACT_ADD_ROUTE,
  CONTACT_EDIT_ROUTE,
  CONTACT_LIST_ROUTE,
  CONTACT_VIEW_ROUTE,
  GENERAL_ROUTE,
  NETWORKS_FORM_ROUTE,
  NETWORKS_ROUTE,
  SECURITY_ROUTE,
  SETTINGS_ROUTE,
} from '@view/helpers/constants/routes';
import AdvancedTab from './advanced-tab';
import AlertsTab from './alerts-tab';
import ContactListTab from './contact-list-tab';
import InfoTab from './info-tab';
import NetworksTab from './networks-tab';
import SecurityTab from './security-tab';
import SettingsTab from './settings-tab';

class SettingsPage extends PureComponent {
  static propTypes = {
    addressName: PropTypes.string,
    backRoute: PropTypes.string,
    currentPath: PropTypes.string,
    history: PropTypes.object,
    isAddressEntryPage: PropTypes.bool,
    isPopup: PropTypes.bool,
    pathnameI18nKey: PropTypes.string,
    initialBreadCrumbRoute: PropTypes.string,
    breadCrumbTextKey: PropTypes.string,
    initialBreadCrumbKey: PropTypes.string,
    mostRecentOverviewPage: PropTypes.string.isRequired,
  };
  static contextTypes = {
    t: PropTypes.func,
  };

  render() {
    const {
      history,
      backRoute,
      currentPath,
      mostRecentOverviewPage,
      location: { pathname },
    } = this.props;
    return (
      <div
        className={classnames('main-container settings-page', {
          'settings-page--selected': currentPath !== SETTINGS_ROUTE,
        })}
      >
        <PageTitle
          title={
            NETWORKS_FORM_ROUTE == pathname
              ? this.context.t('custom')
              : this.context.t('manage')
          }
          subTitle={this.getTitleText()}
        />
        <div className="settings-page__content">
          <div className="settings-page__content__tabs">
            {this.renderTabs()}
          </div>
          <div className="settings-page__content__modules">
            {this.renderSubHeader()}
            {this.renderContent()}
          </div>
        </div>
      </div>
    );
  }

  getTitleText() {
    const { t } = this.context;
    const {
      isPopup,
      pathnameI18nKey,
      addressName,
      location: { pathname },
    } = this.props;
    const subTitle = {
      [GENERAL_ROUTE]: t('general'),
      [ADVANCED_ROUTE]: t('advanced'),
      [CONTACT_LIST_ROUTE]: t('contacts'),
      [SECURITY_ROUTE]: t('securityAndPrivacy'),
      [ALERTS_ROUTE]: t('alerts'),
      [NETWORKS_ROUTE]: t('networks'),
      [ABOUT_US_ROUTE]: t('about'),
      [NETWORKS_FORM_ROUTE]: t('addRPCNetwork'),
    };

    if (subTitle[pathname]) {
      return subTitle[pathname];
    }

    let titleText;

    if (isPopup && addressName) {
      titleText = addressName;
    } else if (pathnameI18nKey && isPopup) {
      titleText = t(pathnameI18nKey);
    } else {
      titleText = t('settings');
    }

    return titleText;
  }

  renderTitle() {
    return (
      <div className="settings-page__header__title">{this.getTitleText()}</div>
    );
  }

  renderSubHeader() {
    const { t } = this.context;
    const {
      currentPath,
      isPopup,
      isAddressEntryPage,
      pathnameI18nKey,
      addressName,
      initialBreadCrumbRoute,
      breadCrumbTextKey,
      history,
      initialBreadCrumbKey,
    } = this.props;
    let subheaderText;

    if (isPopup && isAddressEntryPage) {
      subheaderText = t('settings');
    } else if (initialBreadCrumbKey) {
      subheaderText = t(initialBreadCrumbKey);
    } else {
      subheaderText = t(pathnameI18nKey || 'contacts');
    }

    return (
      !currentPath.startsWith(NETWORKS_ROUTE) && (
        <div className="settings-page__subheader">
          <div
            className={classnames({
              'settings-page__subheader--link': initialBreadCrumbRoute,
            })}
            onClick={() =>
              initialBreadCrumbRoute && history.push(initialBreadCrumbRoute)
            }
          >
            {subheaderText}
          </div>
          {breadCrumbTextKey && (
            <div className="settings-page__subheader--break">
              <span>{' > '}</span>
              {t(breadCrumbTextKey)}
            </div>
          )}
          {isAddressEntryPage && (
            <div className="settings-page__subheader--break">
              <span>{' > '}</span>
              {addressName}
            </div>
          )}
        </div>
      )
    );
  }

  renderTabs() {
    const { history, currentPath } = this.props;
    const { t } = this.context;
    return (
      <TabBar
        tabs={[
          {
            content: t('general'),
            classNames: 'general',
            description: t('generalSettingsDescription'),
            key: GENERAL_ROUTE,
          },
          {
            content: t('advanced'),
            classNames: 'advanced',
            description: t('advancedSettingsDescription'),
            key: ADVANCED_ROUTE,
          },
          {
            content: t('networks'),
            classNames: 'networks',
            description: t('networkSettingsDescription'),
            key: NETWORKS_ROUTE,
          }, // {
          //   content: t('contacts'),
          //   classNames: 'contacts',
          //   description: t('contactsSettingsDescription'),
          //   key: CONTACT_LIST_ROUTE,
          // },
          {
            content: t('securityAndPrivacy'),
            classNames: 'security',
            description: t('securitySettingsDescription'),
            key: SECURITY_ROUTE,
          },
          {
            content: t('alerts'),
            classNames: 'alerts',
            description: t('alertsSettingsDescription'),
            key: ALERTS_ROUTE,
          },
          {
            content: t('about'),
            classNames: 'about',
            description: t('aboutSettingsDescription'),
            key: ABOUT_US_ROUTE,
          },
        ]}
        isActive={(key) => {
          if (key === GENERAL_ROUTE && currentPath === SETTINGS_ROUTE) {
            return true;
          }

          return matchPath(currentPath, {
            path: key,
            exact: true,
          });
        }}
        onSelect={(key) => history.push(key)}
      />
    );
  }

  renderContent() {
    return (
      <Switch>
        <Route exact path={GENERAL_ROUTE} component={SettingsTab} />
        <Route exact path={ABOUT_US_ROUTE} component={InfoTab} />
        <Route exact path={ADVANCED_ROUTE} component={AdvancedTab} />
        <Route exact path={ALERTS_ROUTE} component={AlertsTab} />
        <Route path={NETWORKS_ROUTE} component={NetworksTab} />
        <Route exact path={SECURITY_ROUTE} component={SecurityTab} />
        {/* <Route exact path={CONTACT_LIST_ROUTE} component={ContactListTab} /> */}
        <Route exact path={CONTACT_ADD_ROUTE} component={ContactListTab} />
        <Route
          exact
          path={`${CONTACT_EDIT_ROUTE}/:id`}
          component={ContactListTab}
        />
        <Route
          exact
          path={`${CONTACT_VIEW_ROUTE}/:id`}
          component={ContactListTab}
        />
        <Route component={SettingsTab} />
      </Switch>
    );
  }
}

export default SettingsPage;
