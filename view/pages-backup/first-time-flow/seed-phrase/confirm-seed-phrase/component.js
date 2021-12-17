import React, { PureComponent } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Button from '@c/ui/button';
import Steps from '@c/ui/steps';
import { INITIALIZE_END_OF_FLOW_ROUTE } from '@view/helpers/constants/routes';
export default class ConfirmSeedPhraseComponent extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  };
  static propTypes = {
    history: PropTypes.object,
    seedPhrase: PropTypes.string,
  };
  state = {
    selectedPhrase: [],
  };
  handleNext = async (event) => {
    event.preventDefault();
    const { history } = this.props;
    history.push(INITIALIZE_END_OF_FLOW_ROUTE);
  };

  handleSelectPhrase(str) {
    const { selectedPhrase } = this.state;
    let phrases = selectedPhrase;

    if (!selectedPhrase.includes(str)) {
      phrases.push(str);
    } else {
      phrases = selectedPhrase.filter((s) => s !== str);
    }

    this.setState({
      selectedPhrase: phrases,
    });
  }

  renderPhrase = () => {
    const { selectedPhrase } = this.state;
    const { seedPhrase: seedPhraseString } = this.props;
    const seedPhrase = seedPhraseString.split(' ').sort();
    let classes = [];
    return (
      <div className="confirm-seed-phrase__word-display">
        <div className="confirm-seed-phrase__word-column">
          {seedPhrase.slice(0, 6).map((str, index) => {
            classes = [];

            if (selectedPhrase.includes(str)) {
              classes.push('active');
            }

            return (
              <div
                onClick={() => this.handleSelectPhrase(str)}
                className={classnames([
                  'word-item',
                  selectedPhrase.includes(str) ? 'active' : '',
                ])}
                key={str}
              >
                <span className="word-text">{str}</span>
              </div>
            );
          })}
        </div>
        <div className="confirm-seed-phrase__word-column">
          {seedPhrase.slice(6).map((str, index) => {
            classes = [];

            if (selectedPhrase.includes(str)) {
              classes.push('active');
            }

            return (
              <div
                onClick={() => this.handleSelectPhrase(str)}
                className={classnames([
                  'word-item',
                  selectedPhrase.includes(str) ? 'active' : '',
                ])}
                key={str}
              >
                <span className="word-text">{str}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  renderSelected() {
    const { selectedPhrase } = this.state;

    if (selectedPhrase.length === 0) {
      return null;
    }

    return (
      <div className="confirm-seed-phrase__word-selected">
        {selectedPhrase.map((str, index) => (
          <div className="word-item" key={str}>
            {index + 1}: <span className="word-text">{str}</span>
          </div>
        ))}
      </div>
    );
  }

  isDisabled() {
    const { selectedPhrase } = this.state;
    const { seedPhrase } = this.props;
    return seedPhrase !== selectedPhrase.join(' ');
  }

  render() {
    const { t } = this.context;
    return (
      <div>
        <div className="first-time-flow__header">
          <div className="first-time-flow__account-password">
            <span className="dark-text">{t('createWallet')}</span>
            <span className="sperator">/</span>
            <span className="light-text">{t('confirm')}</span>
          </div>
        </div>
        <Steps total={3} current={3} />
        <div className="first-time-flow__form confirm-seed__form">
          {this.renderPhrase()}
          {this.renderSelected()}
          <div className="first-time-flow__account-password-btn">
            {/* <Button
            type="primary"
            className="first-time-flow__button"
            onClick={this.handleNext}
            disabled={this.isDisabled()}
            rightArrow={true}
            >
            {t('next')}
            </Button> */}
            <Button
              type="primary"
              className="first-time-flow__button"
              disabled={this.isDisabled()}
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
