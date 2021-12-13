import React, { useContext, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { getDexMaskState } from '@view/reducer/dexmask/dexmask';
import { getFirstTimeFlowTypeRoute } from '@view/selectors';

import useDeepEffect from '@view/hooks/useDeepEffect';
import { I18nContext } from '@view/contexts/i18n';

import { setFirstTimeFlowType } from '@view/store/actions';
import Button from '@c/ui/button';
import Logo from '@c/ui/logo';

import {
  INITIALIZE_CREATE_PASSWORD_ROUTE,
  INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE,
} from '@view/helpers/constants/routes';

export default function SelectAction() {
  const history = useHistory();
  const dispatch = useDispatch();
  const t = useContext(I18nContext);

  const nextRoute = useSelector(getFirstTimeFlowTypeRoute);
  const { isInitialized } = useSelector(getDexMaskState);

  const handleCreate = useCallback(() => {
    dispatch(setFirstTimeFlowType('create'));
    history.push(INITIALIZE_CREATE_PASSWORD_ROUTE);
  }, [history, dispatch, setFirstTimeFlowType]);

  const handleImport = useCallback(() => {
    dispatch(setFirstTimeFlowType('import'));
    history.push(INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE);
  }, [history, dispatch, setFirstTimeFlowType]);

  useDeepEffect(() => {
    if (isInitialized) {
      history.push(nextRoute);
    }
  }, [isInitialized, nextRoute, history]);

  return (
    <div className="select-action select-action__page">
      <div className="select-action__wrapper">
        <Logo />
        <div className="select-action__body">
          <div className="select-action__header">{t('welcomeDexWallet')}</div>
          <div className="select-action__description">
            <div>{t('rightWay')}</div>
          </div>
          <div className="select-action__select-buttons">
            <Button
              type="primary"
              className="create-wallet-button"
              onClick={handleCreate}
            >
              {t('createWallet')}
            </Button>
            <Button
              type="default"
              className="import-wallet-button"
              onClick={handleImport}
            >
              {t('importWallet')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

