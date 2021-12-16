import locales from '@app/_locales/index.json';
import Selector from '@c/ui/selector';
import Switch from '@c/ui/switch';
import { I18nContext } from '@view/contexts/i18n';
import availableCurrencies from '@view/helpers/constants/available-conversions.json';
import { getPreferences } from '@view/selectors';
import {
  setCurrentCurrency,
  setHideZeroBalanceTokens,
  setUseBlockie,
  updateCurrentLocale,
} from '@view/store/actions';
import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const sortedCurrencies = availableCurrencies.sort((a, b) => {
  return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
});

const currencyOptions = sortedCurrencies.map(({ code, name }) => {
  return {
    label: code.toUpperCase(),
    value: code,
  };
});

const localeOptions = locales.map((locale) => {
  return {
    label: `${locale.name}`,
    value: locale.code,
  };
});

const SettingsTab = () => {
  const t = useContext(I18nContext);
  const { warning } = useSelector((state) => state.appState);
  const metamask = useSelector((state) => state.metamask);
  const { currentCurrency, useBlockie, currentLocale } = metamask;
  const dispatch = useDispatch();
  const { hideZeroBalanceTokens } = useSelector(getPreferences);

  return (
    <div className="setting-tab-content base-width">
      {warning && <div className="settings-tab__error">{warning}</div>}
      <div className="setting-tab-label">{t('currencyConversion')}</div>
      <Selector
        options={currencyOptions}
        selectedValue={currentCurrency}
        onSelect={(newCurrency) => dispatch(setCurrentCurrency(newCurrency))}
      />
      <div className="setting-tab-label">{t('currentLanguage')}</div>
      <Selector
        options={localeOptions}
        selectedValue={currentLocale}
        onSelect={async (newLocale) => dispatch(updateCurrentLocale(newLocale))}
      />
      <div className="setting-tab-label">{t('blockiesIdenticon')}</div>
      <Switch
        value={useBlockie}
        onChange={() => dispatch(setUseBlockie(!useBlockie))}
      />
      <div className="setting-tab-label">{t('hideZeroBalanceTokens')}</div>
      <Switch
        value={hideZeroBalanceTokens}
        onChange={() =>
          dispatch(setHideZeroBalanceTokens(!hideZeroBalanceTokens))
        }
      />
    </div>
  );
};

export default SettingsTab;
