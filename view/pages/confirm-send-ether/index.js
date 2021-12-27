import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { clearConfirmTransaction } from '@reducer/confirm-transaction/confirm-transaction.duck'
import { ASSET_TYPES, editTransaction } from '@reducer/send'
import ConfirmSendEther from './component'

const mapStateToProps = (state) => {
  const {
    confirmTransaction: { txData: { txParams } = {} },
  } = state
  return {
    txParams,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    editTransaction: async (txData) => {
      const { id } = txData
      await dispatch(editTransaction(ASSET_TYPES.NATIVE, id.toString()))
      dispatch(clearConfirmTransaction())
    },
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ConfirmSendEther)
