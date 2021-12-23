import React, { useContext, useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import { getCurrentLocale } from '@reducer/dexmask/dexmask';
import { updateCurrentLocale } from '@view/store/actions';
import { I18nContext } from '@view/contexts/i18n';
import Selector from '@c/ui/selector';
import locales from '@app/_locales/index.json';
export default function LocaleSwitcher({ className }) {
  const t = useContext(I18nContext);
  const dispatch = useDispatch();
  const currentLocale = useSelector(getCurrentLocale);
  const localOptions = useMemo(
    () =>
      locales.map(({ code, name }) => ({
        value: code,
        label: name,
      })),
    [],
  );
  const localeChanged = useCallback((code) => {
    dispatch(updateCurrentLocale(code));
  }, []);
  return (
    <div className={classnames(['locale-switcher-component', className])}>
      <div className="switcher-label">{t('language')}</div>
      <Selector
        options={localOptions}
        selectedValue={currentLocale}
        onSelect={localeChanged}
      />
    </div>
  );
}
