import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Logo from '@c/ui/logo';
import { DEFAULT_ROUTE, INITIALIZE_BACKUP_SEED_PHRASE_ROUTE, INITIALIZE_CONFIRM_SEED_PHRASE_ROUTE, INITIALIZE_SEED_PHRASE_INTRO_ROUTE, INITIALIZE_SEED_PHRASE_ROUTE } from '@view/helpers/constants/routes';
import ConfirmSeedPhrase from './confirm-seed-phrase';
import RevealSeedPhrase from './reveal-seed-phrase';
import SeedPhraseIntro from './seed-phrase-intro';
export default class SeedPhrase extends PureComponent {
  static propTypes = {
    history: PropTypes.object,
    seedPhrase: PropTypes.string,
    verifySeedPhrase: PropTypes.func
  };
  state = {
    verifiedSeedPhrase: ''
  };

  componentDidMount() {
    const {
      seedPhrase,
      history,
      verifySeedPhrase
    } = this.props;

    if (!seedPhrase) {
      verifySeedPhrase().then(verifiedSeedPhrase => {
        if (verifiedSeedPhrase) {
          this.setState({
            verifiedSeedPhrase
          });
        } else {
          history.push(DEFAULT_ROUTE);
        }
      });
    }
  }

  render() {
    const {
      seedPhrase,
      history
    } = this.props;
    const {
      verifiedSeedPhrase
    } = this.state;
    const pathname = history?.location?.pathname;
    const introClass = pathname === INITIALIZE_SEED_PHRASE_INTRO_ROUTE ? 'intro' : '';
    return <DragDropContextProvider backend={HTML5Backend}>
        <div className={`seed-phrase__wrapper ${introClass}`}>
          <Logo width="82" height="97" />
          <Switch>
            <Route exact path={INITIALIZE_CONFIRM_SEED_PHRASE_ROUTE} render={routeProps => <ConfirmSeedPhrase {...routeProps} seedPhrase={seedPhrase || verifiedSeedPhrase} />} />
            <Route exact path={INITIALIZE_SEED_PHRASE_ROUTE} render={routeProps => <RevealSeedPhrase {...routeProps} seedPhrase={seedPhrase || verifiedSeedPhrase} />} />
            <Route exact path={INITIALIZE_BACKUP_SEED_PHRASE_ROUTE} render={routeProps => <RevealSeedPhrase {...routeProps} seedPhrase={seedPhrase || verifiedSeedPhrase} />} />
            <Route exact path={INITIALIZE_SEED_PHRASE_INTRO_ROUTE} render={routeProps => <SeedPhraseIntro {...routeProps} seedPhrase={seedPhrase || verifiedSeedPhrase} />} />
          </Switch>
        </div>
      </DragDropContextProvider>;
  }

}