import React, { useCallback, useMemo, useContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import classnames from 'classnames';

import Button from '@c/ui/button';
import Steps from '@c/ui/steps';
import Logo from '@c/ui/logo';

import { I18nContext } from '@view/contexts/i18n';
import { INITIALIZE_CONFIRM_SEED_PHRASE_ROUTE } from '@view/helpers/constants/routes';

import { initializeThreeBox, setSeedPhraseBackedUp } from '@view/store/actions';
import { connect } from 'react-redux';

const mapDispatchToProps = (dispatch) => {
  return {
    setSeedPhraseBackedUp: (seedPhraseBackupState) =>
      dispatch(setSeedPhraseBackedUp(seedPhraseBackupState)),
    initializeThreeBox: () => dispatch(initializeThreeBox()),
  };
};

// export default function ConfirmSeedPhrase({ seedPhrase }) {
export default function ConfirmSeedPhrase() {
  const seedPhrase = 'approve weasel drift hospital adapt quit beach team anger glide wrap toward'

  const t = useContext(I18nContext);
  const history = useHistory();
  const dispatch = useDispatch();

  console.log(t)

  const [selectedPhrase, setSelectedPhrase] = useState([]);

  const phraseArray = useMemo(() => {
    const phrases = seedPhrase.split(' ').sort();;
    return [phrases.slice(0, 6), phrases.slice(6)];
  }, [seedPhrase]);

  const handleNext = useCallback(async (event) => {
    event.preventDefault();
    history.push(INITIALIZE_CONFIRM_SEED_PHRASE_ROUTE);
  }, [history]);

  const selectPhrase = useCallback((phrase) => {
    setSelectedPhrase((phrases) => phrases.includes(phrase) ? phrases.filter(item => item !== phrase) : phrases.concat([phrase]))
  }, []);

  return (
    <div className="confirm-seed-phrase dex-page-container space-between base-width">
      <div>
        <Logo plain />
        <div className="first-time-flow__header">
          <div className="first-time-flow__account-password">
            <p className="title">{t('recoveryPhrase')}</p>
            <p className="sub-title">{t('recoveryPhrase.description')}</p>
          </div>
        </div>
        <Steps total={3} current={3} />
        <div className="seed-phrase-display">
          <div className="first-time-flow__form">
            {
              phraseArray.map((phrases, cIndex) => {
                return (
                  <div className={classnames('confirm-seed-phrase__word-column', cIndex ? 'right' : 'left')} key={phrases.join('')}>
                    {
                      phrases.map((phrase, index) => (
                        <div className={classnames('word-item', selectedPhrase.includes(phrase) && 'active')} key={phrase} onClick={() => selectPhrase(phrase)}>
                          <span className="word-text">{phrase}</span>
                        </div>
                      ))
                    }
                  </div>
                );
              })
            }
          </div>
          <div className="select-text">
            {
              selectedPhrase.map((phrase, index) => (<div className="word-item" key={phrase}>{index + 1}. <span className="word-text">{phrase}</span></div>))
            }
          </div>
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
