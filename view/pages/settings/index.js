import { getEnvironmentType } from '@app/scripts/lib/util';
import BackBar from '@c/ui/back-bar';
import Logo from '@c/ui/logo';
import { ENVIRONMENT_TYPE_POPUP } from '@shared/constants/app';
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
import React, { useContext, useMemo } from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import AdvancedTab from './advanced-tab';
import AlertsTab from './alerts-tab';
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

const SettingsPage = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const t = useContext(I18nContext);

  const isNetworksFormPage = Boolean(pathname.match(NETWORKS_FORM_ROUTE));

  const isPopup = getEnvironmentType() === ENVIRONMENT_TYPE_POPUP;
  const pathnameI18nKey = ROUTES_TO_I18N_KEYS[pathname];

  if (isNetworksFormPage) {
    backRoute = NETWORKS_ROUTE;
  }

  const menu = useMemo(
    () => [
      {
        title: t('general'),
        subTitle: t('generalSettingsDescription'),
        url: GENERAL_ROUTE,
        icon: 'general',
        iconWidth: 22,
      },
      {
        title: t('advanced'),
        subTitle: t('advancedSettingsDescription'),
        url: ADVANCED_ROUTE,
        icon: 'advanced',
        iconWidth: 22,
      },
      {
        title: t('networks'),
        subTitle: t('networkSettingsDescription'),
        url: NETWORKS_ROUTE,
        icon: 'security',
        iconWidth: 18,
      },
      // {
      //   content: t('contacts'),
      //   classNames: 'contacts',
      //   description: t('contactsSettingsDescription'),
      //   key: CONTACT_LIST_ROUTE,
      // },
      {
        title: t('securityAndPrivacy'),
        subTitle: t('securitySettingsDescription'),
        url: SECURITY_ROUTE,
        icon: 'alerts',
        iconWidth: 18,
      },
      {
        title: t('alerts'),
        subTitle: t('alertsSettingsDescription'),
        url: ALERTS_ROUTE,
        icon: 'network',
        iconWidth: 18,
      },
      {
        title: t('about'),
        subTitle: t('aboutSettingsDescription'),
        url: ABOUT_US_ROUTE,
        icon: 'about',
        iconWidth: 22,
      },
    ],
    [],
  );

  const getTitleText = useMemo(() => {
    const subTitle = {
      [GENERAL_ROUTE]: t('general'),
      [ADVANCED_ROUTE]: t('advanced'),
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

    if (pathnameI18nKey && isPopup) {
      titleText = t(pathnameI18nKey);
    } else {
      titleText = t('settings');
    }

    return titleText;
  }, [pathname, isPopup, pathnameI18nKey]);

  return (
    <div className="dex-page-container">
      <Logo plain isCenter />
      <BackBar title={getTitleText} />
      {pathname === SETTINGS_ROUTE && (
        <div className="setting-content-wrap base-width">
          {menu.map(({ title, subTitle, icon, iconWidth, url }) => (
            <div key={icon} onClick={() => history.push(url)}>
              <div>
                <img width={iconWidth} src={`images/settings/${icon}.png`} />
              </div>
              <div>
                <div>{title}</div>
                <div>{subTitle}</div>
              </div>
              <img
                className="setting-arrow-right"
                width={8}
                src="images/icons/arrow-down.png"
              />
            </div>
          ))}
        </div>
      )}
      {
        <Switch>
          <Route exact path={GENERAL_ROUTE} component={SettingsTab} />
          <Route exact path={ADVANCED_ROUTE} component={AdvancedTab} />
          <Route exact path={NETWORKS_ROUTE} component={NetworksTab} />
          <Route exact path={SECURITY_ROUTE} component={SecurityTab} />
          <Route exact path={ALERTS_ROUTE} component={AlertsTab} />
          <Route exact path={ABOUT_US_ROUTE} component={InfoTab} />
        </Switch>
      }
      {/* <div className="settings-page__content">
        <div className="settings-page__content__tabs">{renderTabs()}</div>
        <div className="settings-page__content__modules">
          {renderSubHeader()}
          {renderContent()}
        </div>
      </div> */}
    </div>
  );
};

export default React.memo(SettingsPage);
