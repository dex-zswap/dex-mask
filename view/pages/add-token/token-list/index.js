import { connect } from 'react-redux'
import TokenList from './component'

const mapStateToProps = ({ metamask }) => {
  const { tokens } = metamask
  return {
    tokens,
  }
}

export default connect(mapStateToProps)(TokenList)
