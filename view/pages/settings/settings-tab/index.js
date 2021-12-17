import locales from '@app/_locales/index.json';
import Selector from '@c/ui/selector';
import Switch from '@c/ui/switch';
import availableCurrencies from '@view/helpers/constants/available-conversions.json';
import { useI18nContext } from '@view/hooks/useI18nContext';
import { getPreferences } from '@view/selectors';
import {
  setCurrentCurrency,
  setHideZeroBalanceTokens,
  setUseBlockie,
  updateCurrentLocale,
} from '@view/store/actions';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const sortedCurrencies = availableCurrencies.sort((a, b) => {
  return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
});

const currencyOptions = sortedCurrencies.map(({ code }) => {
  return { label: code.toUpperCase(), value: code };
});

const localeOptions = locales.map((locale) => {
  return { label: locale.name, value: locale.code };
});

export default function SettingsTab() {
  const t = useI18nContext();
  const { warning } = useSelector((state) => state.appState);
  const metamask = useSelector((state) => state.metamask);
  const { currentCurrency, useBlockie, currentLocale } = metamask;
  const dispatch = useDispatch();
  const { hideZeroBalanceTokens } = useSelector(getPreferences);

  return (
    <div className="setting-tab-wrap base-width">
      {warning && <div className="settings-tab__error">{warning}</div>}
      <div className="setting-item">
        <div className="setting-label">{t('currencyConversion')}</div>
        <Selector
          options={currencyOptions}
          selectedValue={currentCurrency}
          onSelect={(newCurrency) => dispatch(setCurrentCurrency(newCurrency))}
        />
      </div>
      <div className="setting-item">
        <div className="setting-label">{t('currentLanguage')}</div>
        <Selector
          options={localeOptions}
          selectedValue={currentLocale}
          onSelect={async (newLocale) =>
            dispatch(updateCurrentLocale(newLocale))
          }
        />
      </div>
      <div className="setting-item">
        <div className="setting-label">{t('blockiesIdenticon')}</div>
        <Switch
          value={useBlockie}
          onChange={() => dispatch(setUseBlockie(!useBlockie))}
        />
      </div>
      <div className="setting-item">
        <div className="setting-label">{t('hideZeroBalanceTokens')}</div>
        <Switch
          value={hideZeroBalanceTokens}
          onChange={() =>
            dispatch(setHideZeroBalanceTokens(!hideZeroBalanceTokens))
          }
        />
      </div>
    </div>
  );
}
