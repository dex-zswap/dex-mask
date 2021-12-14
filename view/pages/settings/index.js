import { getEnvironmentType } from '@app/scripts/lib/util';
import PageTitle from '@c/app/page-title';
import TabBar from '@c/app/tab-bar';
import { ENVIRONMENT_TYPE_POPUP } from '@shared/constants/app';
import {
  isBurnAddress,
  isValidHexAddress,
} from '@shared/modules/hexstring-utils';
import { I18nContext } from '@view/contexts/i18n';
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
import { getAddressBookEntryName } from '@view/selectors';
import classnames from 'classnames';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { matchPath, Route, Switch } from 'react-router-dom';
import AdvancedTab from './advanced-tab';
import AlertsTab from './alerts-tab';
import ContactListTab from './contact-list-tab';
import InfoTab from './info-tab';
import NetworksTab from './networks-tab';
import SecurityTab from './security-tab';
import SettingsTab from './settings-tab';

const ROUTES_TO_I18N_KEYS = {
  [ABOUT_US_ROUTE]: 'about',
  [ADVANCED_ROUTE]: 'advanced',
  [ALERTS_ROUTE]: 'alerts',
  [GENERAL_ROUTE]: 'general',
  [CONTACT_ADD_ROUTE]: 'newContact',
  [CONTACT_EDIT_ROUTE]: 'editContact',
  [CONTACT_LIST_ROUTE]: 'contacts',
  [CONTACT_VIEW_ROUTE]: 'viewContact',
  [NETWORKS_ROUTE]: 'networks',
  [NETWORKS_FORM_ROUTE]: 'networks',
  [SECURITY_ROUTE]: 'securityAndPrivacy',
};

let backRoute = SETTINGS_ROUTE;
let initialBreadCrumbRoute;
let initialBreadCrumbKey;

const SettingsPage = ({
  history,
  breadCrumbTextKey,
  location: { pathname },
}) => {
  const t = useContext(I18nContext);
  const pathNameTail = pathname.match(/[^/]+$/u)[0];

  const isAddressEntryPage = pathNameTail.includes('0x');
  const isAddContactPage = Boolean(pathname.match(CONTACT_ADD_ROUTE));
  const isEditContactPage = Boolean(pathname.match(CONTACT_EDIT_ROUTE));
  const isNetworksFormPage = Boolean(pathname.match(NETWORKS_FORM_ROUTE));

  const isPopup = getEnvironmentType() === ENVIRONMENT_TYPE_POPUP;
  const pathnameI18nKey = ROUTES_TO_I18N_KEYS[pathname];

  if (isEditContactPage) {
    backRoute = `${CONTACT_VIEW_ROUTE}/${pathNameTail}`;
  } else if (isAddressEntryPage || isAddContactPage) {
    backRoute = CONTACT_LIST_ROUTE;
  } else if (isNetworksFormPage) {
    backRoute = NETWORKS_ROUTE;
  }

  const addressName = useSelector((state) =>
    getAddressBookEntryName(
      state,
      !isBurnAddress(pathNameTail) &&
        isValidHexAddress(pathNameTail, { mixedCaseUseChecksum: true })
        ? pathNameTail
        : '',
    ),
  );

  const getTitleText = () => {
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
  };

  const renderTitle = () => {
    return <div className="settings-page__header__title">{getTitleText()}</div>;
  };

  const renderSubHeader = () => {
    let subheaderText;

    if (isPopup && isAddressEntryPage) {
      subheaderText = t('settings');
    } else if (initialBreadCrumbKey) {
      subheaderText = t(initialBreadCrumbKey);
    } else {
      subheaderText = t(pathnameI18nKey || 'contacts');
    }

    return (
      !pathname.startsWith(NETWORKS_ROUTE) && (
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
  };

  const renderTabs = () => {
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
          },
          // {
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
          if (key === GENERAL_ROUTE && pathname === SETTINGS_ROUTE) {
            return true;
          }
          return matchPath(pathname, { path: key, exact: true });
        }}
        onSelect={(key) => history.push(key)}
      />
    );
  };

  const renderContent = () => {
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
  };

  return (
    <div
      className={classnames('main-container settings-page', {
        'settings-page--selected': pathname !== SETTINGS_ROUTE,
      })}
    >
      <PageTitle
        title={NETWORKS_FORM_ROUTE == pathname ? t('custom') : t('manage')}
        subTitle={getTitleText()}
      />
      <div className="settings-page__content">
        <div className="settings-page__content__tabs">{renderTabs()}</div>
        <div className="settings-page__content__modules">
          {renderSubHeader()}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default React.memo(SettingsPage);
