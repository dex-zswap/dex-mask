import { connect } from 'react-redux'
import { debounce } from 'lodash'
import {
  initializeEnsSlice,
  lookupEnsName,
  resetEnsResolution,
} from '@reducer/ens'
import EnsInput from './ens-input.component'

function mapDispatchToProps(dispatch) {
  return {
    lookupEnsName: debounce((ensName) => dispatch(lookupEnsName(ensName)), 150),
    initializeEnsSlice: () => dispatch(initializeEnsSlice()),
    resetEnsResolution: debounce(() => dispatch(resetEnsResolution()), 300),
  }
}

export default connect(null, mapDispatchToProps)(EnsInput)
