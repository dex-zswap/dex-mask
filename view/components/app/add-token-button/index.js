import React from 'react';
import { useHistory } from 'react-router-dom';
import { useI18nContext } from '@view/hooks/useI18nContext';
import { ADD_TOKEN_ROUTE } from '@view/helpers/constants/routes';
export default function AddTokenButton() {
  const t = useI18nContext();
  const history = useHistory();
  return (
    <div
      className="add-token-button flex items-center"
      onClick={() => {
        history.push(ADD_TOKEN_ROUTE);
      }}
    >
      <div className="icon"></div>
      <p className="text">{t('addToken')}</p>
    </div>
  );
}
