import { connect } from 'react-redux'
import Authenticated from './component'

const mapStateToProps = (state) => {
  const {
    metamask: { isUnlocked, completedOnboarding },
  } = state
  return {
    isUnlocked,
    completedOnboarding,
  }
}

export default connect(mapStateToProps)(Authenticated)
