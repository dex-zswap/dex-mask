import { initializeThreeBox, setSeedPhraseBackedUp } from '@view/store/actions';
import { connect } from 'react-redux';
import ConfirmSeedPhrase from './component';

const mapDispatchToProps = (dispatch) => {
  return {
    setSeedPhraseBackedUp: (seedPhraseBackupState) =>
      dispatch(setSeedPhraseBackedUp(seedPhraseBackupState)),
    initializeThreeBox: () => dispatch(initializeThreeBox()),
  };
};

export default connect(null, mapDispatchToProps)(ConfirmSeedPhrase);
