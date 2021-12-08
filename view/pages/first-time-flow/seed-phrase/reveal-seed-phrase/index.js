import { getOnboardingInitiator } from '@view/selectors';
import {
  setCompletedOnboarding,
  setSeedPhraseBackedUp,
} from '@view/store/actions';
import { connect } from 'react-redux';
import RevealSeedPhrase from './component';

const mapStateToProps = (state) => {
  return {
    onboardingInitiator: getOnboardingInitiator(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setSeedPhraseBackedUp: (seedPhraseBackupState) =>
      dispatch(setSeedPhraseBackedUp(seedPhraseBackupState)),
    setCompletedOnboarding: () => dispatch(setCompletedOnboarding()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RevealSeedPhrase);
