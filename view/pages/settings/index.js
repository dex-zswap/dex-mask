import React, { useMemo } from 'react'
import { Route, Switch, useHistory, useLocation } from 'react-router-dom'
import BackBar from '@c/ui/back-bar'
import Logo from '@c/ui/logo'
import RevealSeedConfirmation from '@pages/keychains/reveal-seed'
import {
  ABOUT_US_ROUTE,
  ADVANCED_ROUTE,
  ALERTS_ROUTE,
  GENERAL_ROUTE,
  NETWORKS_FORM_ROUTE,
  NETWORKS_ROUTE,
  REVEAL_SEED_ROUTE,
  SECURITY_ROUTE,
  SETTINGS_ROUTE,
} from '@view/helpers/constants/routes'
import { useI18nContext } from '@view/hooks/useI18nContext'
import AdvancedTab from './advanced-tab'
import AlertsTab from './alerts-tab'
import InfoTab from './info-tab'
import NetworksTab from './networks-tab'
import SecurityTab from './security-tab'
import SettingsTab from './settings-tab'
const ROUTES_TO_I18N_KEYS = {
  [ABOUT_US_ROUTE]: 'about',
  [ADVANCED_ROUTE]: 'advanced',
  [ALERTS_ROUTE]: 'alerts',
  [GENERAL_ROUTE]: 'general',
  [NETWORKS_ROUTE]: 'networks',
  [NETWORKS_FORM_ROUTE]: 'networks',
  [SECURITY_ROUTE]: 'securityAndPrivacy',
}

const SettingsPage = () => {
  const t = useI18nContext()
  const history = useHistory()
  const { pathname } = useLocation()
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
        icon: 'network',
        iconWidth: 18,
      },
      {
        title: t('securityAndPrivacy'),
        subTitle: t('securitySettingsDescription'),
        url: SECURITY_ROUTE,
        icon: 'security',
        iconWidth: 18,
      },
      {
        title: t('alerts'),
        subTitle: t('alertsSettingsDescription'),
        url: ALERTS_ROUTE,
        icon: 'alerts',
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
    [t],
  )
  const getTitleText = useMemo(() => {
    const subTitle = {
      [GENERAL_ROUTE]: t('general'),
      [ADVANCED_ROUTE]: t('advanced'),
      [SECURITY_ROUTE]: t('securityAndPrivacy'),
      [REVEAL_SEED_ROUTE]: t('walletSeed'),
      [ALERTS_ROUTE]: t('alerts'),
      [NETWORKS_ROUTE]: t('networks'),
      [ABOUT_US_ROUTE]: t('about'),
      [NETWORKS_FORM_ROUTE]: t('addRPCNetwork'),
    }

    if (subTitle[pathname]) {
      return subTitle[pathname]
    }

    return t('settings')
  }, [t, pathname])
  return (
    <div className='dex-page-container'>
      <Logo plain isCenter />
      <BackBar title={getTitleText} />
      {pathname === SETTINGS_ROUTE && (
        <div className='setting-content-wrap base-width'>
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
                className='setting-arrow-right'
                width={8}
                src='images/icons/arrow-down.png'
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
          <Route exact path={NETWORKS_FORM_ROUTE} component={NetworksTab} />
          <Route exact path={SECURITY_ROUTE} component={SecurityTab} />
          <Route
            exact
            path={REVEAL_SEED_ROUTE}
            component={RevealSeedConfirmation}
          />
          <Route exact path={ALERTS_ROUTE} component={AlertsTab} />
          <Route exact path={ABOUT_US_ROUTE} component={InfoTab} />
        </Switch>
      }
    </div>
  )
}

export default React.memo(SettingsPage)
