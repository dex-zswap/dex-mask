import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import locales from '@app/_locales/index.json';
import Button from '@c/ui/button';
import Logo from '@c/ui/logo';
import {
  INITIALIZE_CREATE_PASSWORD_ROUTE,
  INITIALIZE_SELECT_ACTION_ROUTE,
} from '@view/helpers/constants/routes';
import EventEmitter from 'events';
export default class Welcome extends PureComponent {
  static propTypes = {
    history: PropTypes.object,
    participateInMetaMetrics: PropTypes.bool,
    welcomeScreenSeen: PropTypes.bool,
    currentLocale: PropTypes.object,
    updateCurrentLocale: PropTypes.func,
  };
  static contextTypes = {
    t: PropTypes.func,
  };
  state = {
    showLocaleOptions: false,
  };

  constructor(props) {
    super(props);
    this.animationEventEmitter = new EventEmitter();
  }

  componentDidMount() {
    const { history, participateInMetaMetrics, welcomeScreenSeen } = this.props;

    if (welcomeScreenSeen && participateInMetaMetrics !== null) {
      history.push(INITIALIZE_CREATE_PASSWORD_ROUTE);
    } else if (welcomeScreenSeen) {
      history.push(INITIALIZE_SELECT_ACTION_ROUTE);
    }
  }

  toggleLocaleOption = () => {
    this.setState((prev) => {
      return { ...prev, showLocaleOptions: !prev.showLocaleOptions };
    });
  };
  handleContinue = () => {
    this.props.history.push(INITIALIZE_SELECT_ACTION_ROUTE);
  };

  changeLocale(e, code) {
    e.stopPropagation();
    this.toggleLocaleOption();
    this.props.updateCurrentLocale(code);
  }

  renderLocaleOptions() {
    return (
      <div className="locale-options">
        {locales.map((locale) => {
          return (
            <div
              className="option-row"
              key={locale.code}
              onClick={(e) => this.changeLocale(e, locale.code)}
            >
              {locale.name}
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const { t } = this.context;
    const { currentLocale } = this.props;
    const { showLocaleOptions } = this.state;
    const currentLocaleMeta = locales.find(
      (locale) => locale.code === currentLocale,
    );
    const currentLocaleName = currentLocaleMeta ? currentLocaleMeta.name : '';
    return (
      <div className="welcome-page__wrapper">
        <div className="welcome-page">
          <div
            className="welcome-page__langage-switcher"
            onClick={this.toggleLocaleOption}
          >
            <div className="switcher-text">{currentLocaleName}</div>
            <div className="switcher-arrow"></div>
            {showLocaleOptions ? this.renderLocaleOptions() : null}
          </div>
          <Logo width="133" height="157" />
          <div className="welcome-page__header">{t('welcome')}</div>
          <div className="welcome-page__description">
            <div>{t('metamaskDescription')}</div>
            <div>{t('happyToSeeYou')}</div>
          </div>
          <Button
            type="primary"
            className="first-time-flow__button"
            rightArrow={true}
            onClick={this.handleContinue}
          >
            {t('getStarted')}
          </Button>
        </div>
      </div>
    );
  }
}
