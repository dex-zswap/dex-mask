import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '@c/ui/button';
import { returnToOnboardingInitiator } from '@pages/first-time-flow/util';
import { DEFAULT_ROUTE } from '@view/helpers/constants/routes';
export default class EndOfFlowScreen extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  };
  static propTypes = {
    history: PropTypes.object,
    completionMetaMetricsName: PropTypes.string,
    setCompletedOnboarding: PropTypes.func,
    onboardingInitiator: PropTypes.exact({
      location: PropTypes.string,
      tabId: PropTypes.number,
    }),
  };

  async _beforeUnload() {
    await this._onOnboardingComplete();
  }

  _removeBeforeUnload() {
    window.removeEventListener('beforeunload', this._beforeUnload);
  }

  async _onOnboardingComplete() {
    const { setCompletedOnboarding, completionMetaMetricsName } = this.props;
    await setCompletedOnboarding();
  }

  onComplete = async () => {
    const { history, onboardingInitiator } = this.props;

    this._removeBeforeUnload();

    await this._onOnboardingComplete();

    if (onboardingInitiator) {
      await returnToOnboardingInitiator(onboardingInitiator);
    }

    history.push(DEFAULT_ROUTE);
  };

  componentDidMount() {
    window.addEventListener('beforeunload', this._beforeUnload.bind(this));
  }

  componentWillUnmount = () => {
    this._removeBeforeUnload();
  };

  render() {
    const { t } = this.context;
    return (
      <div className="end-of-flow">
        <div className="end-of-flow__success-icon"></div>
        <div className="end-of-flow__text-block end-of-flow__success-text">
          {t('endOfFlowMessage1')}
        </div>
        <Button
          type="primary"
          className="first-time-flow__button end-of-flow__button"
          onClick={this.onComplete}
          rightArrow={true}
        >
          {t('endOfFlowMessage10')}
        </Button>
      </div>
    );
  }
}
