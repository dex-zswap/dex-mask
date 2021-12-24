import { connect } from 'react-redux'
import { compose } from 'redux'
import withModalProps from '@view/helpers/higher-order-components/with-modal-props'
import {
  getCurrentChainId,
  getRpcPrefsForCurrentProvider,
} from '@view/selectors'
import { getDexMaskState } from '@reducer/dexmask/dexmask'
import { removeAccount } from '@view/store/actions'
import ConfirmRemoveAccount from './component'

const mapStateToProps = (state) => {
  const { provider } = getDexMaskState(state)
  return {
    chainId: getCurrentChainId(state),
    rpcPrefs: getRpcPrefsForCurrentProvider(state),
    provider,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeAccount: (address) => dispatch(removeAccount(address)),
  }
}

export default compose(
  withModalProps,
  connect(mapStateToProps, mapDispatchToProps),
)(ConfirmRemoveAccount)
