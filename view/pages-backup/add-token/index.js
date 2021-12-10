import { getMostRecentOverviewPage } from '@reducer/history/history';
import {
  getIsMainnet,
  getRpcPrefsForCurrentProvider,
} from '@selectors/selectors';
import { clearPendingTokens, setPendingTokens } from '@view/store/actions';
import { connect } from 'react-redux';
import AddToken from './component';

const mapStateToProps = (state) => {
  const {
    metamask: {
      identities,
      tokens,
      pendingTokens,
      provider: { chainId },
    },
  } = state;
  return {
    identities,
    mostRecentOverviewPage: getMostRecentOverviewPage(state),
    tokens,
    pendingTokens,
    showSearchTab: getIsMainnet(state) || process.env.IN_TEST === 'true',
    chainId,
    rpcPrefs: getRpcPrefsForCurrentProvider(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPendingTokens: (tokens) => dispatch(setPendingTokens(tokens)),
    clearPendingTokens: () => dispatch(clearPendingTokens()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddToken);
