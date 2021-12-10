import { connect } from 'react-redux';
import { setSeedPhraseBackedUp, initializeThreeBox } from '@view/store/actions';
import ImportWithSeedPhrase from './component';

const mapDispatchToProps = (dispatch) => {
  return {
    setSeedPhraseBackedUp: (seedPhraseBackupState) =>
      dispatch(setSeedPhraseBackedUp(seedPhraseBackupState)),
    initializeThreeBox: () => dispatch(initializeThreeBox()),
  };
};

export default connect(null, mapDispatchToProps)(ImportWithSeedPhrase);
