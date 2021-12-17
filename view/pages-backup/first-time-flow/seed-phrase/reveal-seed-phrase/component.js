import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '@c/ui/button';
import Steps from '@c/ui/steps';
import { INITIALIZE_CONFIRM_SEED_PHRASE_ROUTE } from '@view/helpers/constants/routes';
export default class RevealSeedPhraseComponent extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  };
  static propTypes = {
    history: PropTypes.object,
    seedPhrase: PropTypes.string,
  };
  handleNext = async (event) => {
    event.preventDefault();
    const { history } = this.props;
    history.push(INITIALIZE_CONFIRM_SEED_PHRASE_ROUTE);
  };
  renderPhrase = () => {
    const { seedPhrase: seedPhraseString } = this.props;
    const seedPhrase = seedPhraseString.split(' ');
    return (
      <div className="reveal-seed-phrase__word-display">
        <div className="reveal-seed-phrase__word-column">
          {seedPhrase.slice(0, 6).map((str, index) => (
            <div className="word-item" key={str}>
              {index + 1}.<span className="word-text">{str}</span>
            </div>
          ))}
        </div>
        <div className="reveal-seed-phrase__word-column">
          {seedPhrase.slice(6).map((str, index) => (
            <div className="word-item" key={str}>
              {index + 7}.<span className="word-text">{str}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  render() {
    const { t } = this.context;
    const { seedPhrase } = this.props;
    return (
      <div>
        <div className="first-time-flow__header">
          <div className="first-time-flow__account-password">
            <span className="dark-text">{t('createWallet')}</span>
            <span className="sperator">/</span>
            <span className="light-text">{t('seed')}</span>
          </div>
        </div>
        <Steps total={3} current={2} />
        <div className="first-time-flow__form">
          {this.renderPhrase()}
          <div className="first-time-flow__account-password-btn">
            <Button
              type="primary"
              className="first-time-flow__button"
              onClick={this.handleNext}
              rightArrow={true}
            >
              {t('next')}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
