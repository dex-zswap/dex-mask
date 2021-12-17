import React, { useMemo } from 'react';
import {
  Link,
  matchPath,
  Redirect,
  Route,
  Switch,
  useLocation,
} from 'react-router-dom';
import classnames from 'classnames';
import PageTitle from '@c/app/page-title';
import { LIQUIDITY_ROUTE, ZSWAP_ROUTE } from '@view/helpers/constants/routes';
import { useI18nContext } from '@view/hooks/useI18nContext';
import Liquidity from './liquidity';
import Zswap from './swap';
export default function Trade() {
  const t = useI18nContext();
  const { pathname } = useLocation();
  const activeInfo = useMemo(() => {
    return {
      swap: matchPath(pathname, {
        path: ZSWAP_ROUTE,
        exact: true,
      }),
      liquidity: matchPath(pathname, {
        path: LIQUIDITY_ROUTE,
        exact: true,
      }),
    };
  }, [pathname]);
  return (
    <div className="trade-component__wrapper">
      <PageTitle
        title={t('swap')}
        subTitle={activeInfo.swap ? t('zswap') : t('liquidity')}
      />
      <div className="trade-component__tabs">
        <div
          className={classnames([
            'trade-component__tab',
            activeInfo.swap && 'active',
          ])}
        >
          <Link to={ZSWAP_ROUTE}>{t('zswap')}</Link>
        </div>
        <div
          className={classnames([
            'trade-component__tab',
            activeInfo.liquidity && 'active',
          ])}
        >
          <Link to={LIQUIDITY_ROUTE}>{t('liquidity')}</Link>
        </div>
      </div>
      <Switch>
        <Route path={LIQUIDITY_ROUTE} component={Liquidity} />
        <Route path={ZSWAP_ROUTE} component={Zswap} />
        <Redirect from="*" to={ZSWAP_ROUTE} />
      </Switch>
    </div>
  );
}
