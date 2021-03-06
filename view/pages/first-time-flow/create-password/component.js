import Logo from '@c/ui/logo';
import {
  INITIALIZE_CREATE_PASSWORD_ROUTE,
  INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE,
  INITIALIZE_SEED_PHRASE_ROUTE,
} from '@view/helpers/constants/routes';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import ImportWithSeedPhrase from './import-with-seed-phrase';
import NewAccount from './new-account';

export default class CreatePassword extends PureComponent {
  static propTypes = {
    history: PropTypes.object,
    isInitialized: PropTypes.bool,
    onCreateNewAccount: PropTypes.func,
    onCreateNewAccountFromSeed: PropTypes.func,
  };

  componentDidMount() {
    const { isInitialized, history } = this.props;

    if (isInitialized) {
      history.push(INITIALIZE_SEED_PHRASE_ROUTE);
    }
  }

  render() {
    const { onCreateNewAccount, onCreateNewAccountFromSeed } = this.props;

    return (
      <div className="create-password__wrapper">
        <Logo width="82" height="97" />
        <Switch>
          <Route
            exact
            path={INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE}
            render={(routeProps) => (
              <ImportWithSeedPhrase
                {...routeProps}
                onSubmit={onCreateNewAccountFromSeed}
              />
            )}
          />
          <Route
            exact
            path={INITIALIZE_CREATE_PASSWORD_ROUTE}
            render={(routeProps) => (
              <NewAccount {...routeProps} onSubmit={onCreateNewAccount} />
            )}
          />
        </Switch>
      </div>
    );
  }
}
