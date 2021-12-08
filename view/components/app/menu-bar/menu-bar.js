import { getEnvironmentType } from '@app/scripts/lib/util';
import ConnectedStatusIndicator from '@c/app/connected/status-indicator';
import { ENVIRONMENT_TYPE_POPUP } from '@shared/constants/app';
import { CONNECTED_ACCOUNTS_ROUTE } from '@view/helpers/constants/routes';
import { useI18nContext } from '@view/hooks/useI18nContext';
import { getOriginOfCurrentTab } from '@view/selectors';
import extension from 'extensionizer';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

export default function MenuBar() {
  const t = useI18nContext();
  const history = useHistory();
  const [
    accountOptionsButtonElement,
    setAccountOptionsButtonElement,
  ] = useState(null);
  const [accountOptionsMenuOpen, setAccountOptionsMenuOpen] = useState(false);
  const origin = useSelector(getOriginOfCurrentTab);

  const showStatus =
    getEnvironmentType() === ENVIRONMENT_TYPE_POPUP &&
    origin &&
    origin !== extension.runtime.id;

  return (
    <div className="menu-bar">
      {showStatus ? (
        <ConnectedStatusIndicator
          onClick={() => history.push(CONNECTED_ACCOUNTS_ROUTE)}
        />
      ) : null}

      <button
        className="fas fa-ellipsis-v menu-bar__account-options"
        data-testid="account-options-menu-button"
        ref={setAccountOptionsButtonElement}
        title={t('accountOptions')}
        onClick={() => {
          setAccountOptionsMenuOpen(true);
        }}
      />
    </div>
  );
}
