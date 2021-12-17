import React, { useState, useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getDexMaskState } from '@view/reducer/dexmask/dexmask';
import useDeepEffect from '@view/hooks/useDeepEffect';
import { I18nContext } from '@view/contexts/i18n';
import LocaleSwitcher from '@c/ui/locale-switcher';
import Button from '@c/ui/button';
import Logo from '@c/ui/logo';
import { INITIALIZE_CREATE_PASSWORD_ROUTE, INITIALIZE_SELECT_ACTION_ROUTE } from '@view/helpers/constants/routes';
export default function Welcome() {
  const history = useHistory();
  const t = useContext(I18nContext);
  const handleContinue = useCallback(() => {
    history.push(INITIALIZE_SELECT_ACTION_ROUTE);
  }, [history]);
  const {
    participateInMetaMetrics,
    welcomeScreenSeen
  } = useSelector(getDexMaskState);
  useDeepEffect(() => {
    if (welcomeScreenSeen && participateInMetaMetrics !== null) {
      history.push(INITIALIZE_CREATE_PASSWORD_ROUTE);
    } else if (welcomeScreenSeen) {
      history.push(INITIALIZE_SELECT_ACTION_ROUTE);
    }
  }, [history, participateInMetaMetrics, welcomeScreenSeen]);
  return <div className="welcome-page__wrapper">
      <div className="welcome-page">
        <Logo />
        <div className="welcome-page__header">{t('welcome')}</div>
        <div className="welcome-page__description">
          <div>{t('happyToSeeYou')}</div>
        </div>
        <LocaleSwitcher className="locale-switcher" />
        <Button type="primary" className="welcone-page__button" rightArrow={true} onClick={handleContinue}>
          {t('getStarted')}
        </Button>
      </div>
    </div>;
}
;