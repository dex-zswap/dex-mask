import { connect } from 'react-redux'
import { getMostRecentOverviewPage } from '@reducer/history/history'
import { addTokens, clearPendingTokens } from '@view/store/actions'
import ConfirmAddToken from './component'

const mapStateToProps = (state) => {
  const {
    metamask: { pendingTokens },
  } = state
  return {
    mostRecentOverviewPage: getMostRecentOverviewPage(state),
    pendingTokens,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addTokens: (tokens) => dispatch(addTokens(tokens)),
    clearPendingTokens: () => dispatch(clearPendingTokens()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmAddToken)
