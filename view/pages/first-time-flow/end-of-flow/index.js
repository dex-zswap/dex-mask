import React, { useCallback, useState, useContext, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { DEFAULT_ROUTE } from '@view/helpers/constants/routes';

import { I18nContext } from '@view/contexts/i18n';

import { getOnboardingInitiator } from '@view/selectors';
import { setCompletedOnboarding } from '@view/store/actions';

import { getDexMaskState } from '@reducer/dexmask/dexmask';

import { returnToOnboardingInitiator } from '@pages/first-time-flow/util';

import Button from '@c/ui/button';
import Logo from '@c/ui/logo';

export default function EndOfFlow() {
  const t = useContext(I18nContext);
  const history = useHistory();
  const dispatch = useDispatch();

  const { firstTimeFlowType } = useSelector(getDexMaskState);
  const onboardingInitiator = useSelector(getOnboardingInitiator);

  const localeKey = useMemo(() => firstTimeFlowType === 'create' ? 'endOfFlowMessage10' : 'endOfFlowMessage11', [firstTimeFlowType]);

  const onOnboardingComplete = useCallback(async () => {
    await dispatch(setCompletedOnboarding());
  }, [setCompletedOnboarding, dispatch]);

  const beforeUnload = useCallback(async () => {
    await onOnboardingComplete();
  }, [onOnboardingComplete]);

  const removeBeforeUnload = useCallback(() => {
    window.removeEventListener('beforeunload', beforeUnload);
  }, [beforeUnload]);

  const onComplete = useCallback(async () => {
    removeBeforeUnload();
    await onOnboardingComplete();
    if (onboardingInitiator) {
      await returnToOnboardingInitiator(onboardingInitiator);
    }
    history.push(DEFAULT_ROUTE);
  }, [history, onboardingInitiator, removeBeforeUnload]);

  useEffect(() => {
    window.addEventListener('beforeunload', beforeUnload);

    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
    };
  }, [beforeUnload]);

  return (
    <div className="end-of-flow base-width">
      <Logo plain />
      <div className="end-of-flow__success-icon"></div>
      <div className="end-of-flow__text-block end-of-flow__success-text">
        {t(localeKey)}
      </div>
      <Button
        type="primary"
        className="first-time-flow__button end-of-flow__button"
        onClick={onComplete}
        rightArrow={true}
      >
        {t('endOfFlowMessage10')}
      </Button>
    </div>
  )
}
