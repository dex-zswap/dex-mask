import { connect } from 'react-redux'
import CreatePassword from './component'

const mapStateToProps = (state) => {
  const {
    metamask: { isInitialized },
  } = state
  return {
    isInitialized,
  }
}

export default connect(mapStateToProps)(CreatePassword)
