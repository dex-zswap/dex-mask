import { INITIALIZE_BACKUP_SEED_PHRASE_ROUTE } from '@view/helpers/constants/routes';
import { getFirstTimeFlowTypeRoute } from '@view/selectors';
import {
  createNewVaultAndGetSeedPhrase,
  createNewVaultAndRestore,
  unlockAndGetSeedPhrase,
  verifySeedPhrase,
} from '@view/store/actions';
import { connect } from 'react-redux';
import FirstTimeFlow from './component';

const mapStateToProps = (state, ownProps) => {
  const {
    metamask: {
      completedOnboarding,
      isInitialized,
      isUnlocked,
      seedPhraseBackedUp,
    },
  } = state;
  const showingSeedPhraseBackupAfterOnboarding = Boolean(
    ownProps.location.pathname.match(INITIALIZE_BACKUP_SEED_PHRASE_ROUTE),
  );

  return {
    completedOnboarding,
    isInitialized,
    isUnlocked,
    nextRoute: getFirstTimeFlowTypeRoute(state),
    showingSeedPhraseBackupAfterOnboarding,
    seedPhraseBackedUp,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createNewAccount: (password) =>
      dispatch(createNewVaultAndGetSeedPhrase(password)),
    createNewAccountFromSeed: (password, seedPhrase) => {
      return dispatch(createNewVaultAndRestore(password, seedPhrase));
    },
    unlockAccount: (password) => dispatch(unlockAndGetSeedPhrase(password)),
    verifySeedPhrase: () => verifySeedPhrase(),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FirstTimeFlow);
