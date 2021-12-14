import React, { useCallback, useMemo, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import classnames from 'classnames';

import Button from '@c/ui/button';
import Steps from '@c/ui/steps';
import Logo from '@c/ui/logo';

import { I18nContext } from '@view/contexts/i18n';
import { INITIALIZE_CONFIRM_SEED_PHRASE_ROUTE } from '@view/helpers/constants/routes';

export default function RevealSeedPhrase({ seedPhrase }) {
  const t = useContext(I18nContext);
  const history = useHistory();
  const dispatch = useDispatch();

  const phraseArray = useMemo(() => {
    const phrases = seedPhrase.split(' ');
    return [phrases.slice(0, 6), phrases.slice(6)];
  }, [seedPhrase]);

  const handleNext = useCallback(async (event) => {
    event.preventDefault();
    history.push(INITIALIZE_CONFIRM_SEED_PHRASE_ROUTE);
  }, [history]);

  return (
    <div className="reveal-seed-phrase dex-page-container space-between base-width">
      <div>
        <Logo plain />
        <div className="first-time-flow__header">
          <div className="first-time-flow__account-password">
            <p className="title">{t('createAWallet')}</p>
            <p className="sub-title">{t('createPassword')}</p>
          </div>
        </div>
        <Steps total={3} current={2} />
        <div className="first-time-flow__form">
          {
            phraseArray.map((phrases, cIndex) => {
              return (
                <div className={classnames('reveal-seed-phrase__word-column', cIndex ? 'right' : 'left')} key={phrases.join('')}>
                  {
                    phrases.map((phrase, index) => (
                      <div className="word-item" key={phrase}>
                        {index + (1 + cIndex * 6)}.<span className="word-text">{phrase}</span>
                      </div>
                    ))
                  }
                </div>
              );
            })
          }
        </div>
      </div>
      <div className="first-time-flow__account-password-btn">
        <Button
          type="primary"
          className="first-time-flow__button"
          onClick={handleNext}
        >
          {t('next')}
        </Button>
      </div>
    </div>
  );
}
