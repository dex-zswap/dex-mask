import Button from '@c/ui/button';
import {
  INITIALIZE_CREATE_PASSWORD_ROUTE,
  INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE,
} from '@view/helpers/constants/routes';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

export default class SelectAction extends PureComponent {
  static propTypes = {
    history: PropTypes.object,
    isInitialized: PropTypes.bool,
    setFirstTimeFlowType: PropTypes.func,
    nextRoute: PropTypes.string,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  componentDidMount() {
    const { history, isInitialized, nextRoute } = this.props;

    if (isInitialized) {
      history.push(nextRoute);
    }
  }

  handleCreate = () => {
    this.props.setFirstTimeFlowType('create');
    this.props.history.push(INITIALIZE_CREATE_PASSWORD_ROUTE);
  };

  handleImport = () => {
    this.props.setFirstTimeFlowType('import');
    this.props.history.push(INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE);
  };

  render() {
    const { t } = this.context;

    return (
      <div className="select-action select-action__page">
        <div className="select-action__wrapper">
          <div className="select-action__top-image"></div>
          <div className="select-action__body">
            <div className="select-action__header">{t('welcomeDexWallet')}</div>
            <div className="select-action__description">
              <div>{t('happyToSeeYou')}</div>
            </div>
            <div className="select-action__select-buttons">
              <Button
                type="primary"
                rightArrow={true}
                className="first-time-flow__button"
                onClick={this.handleCreate}
              >
                {t('createAWallet')}
              </Button>
              <Button
                type="default"
                className="first-time-flow__button"
                onClick={this.handleImport}
              >
                {t('importWallet')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
