import Button from '@c/ui/button';
import ExportTextContainer from '@c/ui/export-text-container';
import TextField from '@c/ui/text-field';
import { getMostRecentOverviewPage } from '@reducer/history/history';
import { useI18nContext } from '@view/hooks/useI18nContext';
import { requestRevealSeedWords } from '@view/store/actions';
import { default as React, default as React, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const PASSWORD_PROMPT_SCREEN = 'PASSWORD_PROMPT_SCREEN';
const REVEAL_SEED_SCREEN = 'REVEAL_SEED_SCREEN';

export default function RevealSeedPage() {
  const t = useI18nContext();
  const history = useHistory();
  const dispatch = useDispatch();
  const mostRecentOverviewPage = useSelector(getMostRecentOverviewPage);

  const [screen, setScreen] = useState(PASSWORD_PROMPT_SCREEN);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [seedWords, setSeedWords] = useState();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSeedWords(null);
    dispatch(requestRevealSeedWords(password))
      .then((words) => {
        setSeedWords(words);
        setScreen(REVEAL_SEED_SCREEN);
      })
      .catch(({ message }) => {
        setError(message);
      });
  };

  return (
    <div className="base-width">
      <div className="setting-item">
        <div className="setting-value">{t('revealSeedWordsDescription')}</div>
      </div>
      <div className="setting-item">
        <div className="reveal-seed-warning-wrap">
          <img width={36} src="images/settings/warning.png" />
          <div>{t('revealSeedWordsWarningTitle')}</div>
          <div>{t('revealSeedWordsWarning')}</div>
        </div>
      </div>
      <div className="setting-item">
        <div className="setting-label">
          {screen === PASSWORD_PROMPT_SCREEN
            ? t('enterPasswordContinue')
            : t('yourPrivateSeedPhrase')}
        </div>
        {screen === PASSWORD_PROMPT_SCREEN ? (
          <>
            <TextField
              type="password"
              placeholder={t('password')}
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              autoFocus
            />
            <div className="reveal-seed-error-tip">{error}</div>
          </>
        ) : (
          <ExportTextContainer text={seedWords} />
        )}
      </div>
      <div className="bottom-fixed-btn-group">
        {screen === PASSWORD_PROMPT_SCREEN ? (
          <div className="flex space-between">
            <Button
              className="half-button"
              onClick={() => history.push(mostRecentOverviewPage)}
            >
              {t('cancel')}
            </Button>
            <Button
              className="half-button"
              type="primary"
              onClick={(event) => handleSubmit(event)}
              disabled={password === ''}
            >
              {t('next')}
            </Button>
          </div>
        ) : (
          <Button onClick={() => history.push(mostRecentOverviewPage)}>
            {t('close')}
          </Button>
        )}
      </div>
    </div>
  );
}
