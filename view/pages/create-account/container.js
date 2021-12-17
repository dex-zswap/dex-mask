import { connect } from 'react-redux';
import { getMostRecentOverviewPage } from '@reducer/history/history';
import * as actions from '@view/store/actions';
import NewAccountCreateForm from './component';

const mapStateToProps = state => {
  const {
    metamask: {
      identities = {}
    }
  } = state;
  const numberOfExistingAccounts = Object.keys(identities).length;
  const newAccountNumber = numberOfExistingAccounts + 1;
  return {
    newAccountNumber,
    mostRecentOverviewPage: getMostRecentOverviewPage(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createAccount: newAccountName => {
      return dispatch(actions.addNewAccount()).then(newAccountAddress => {
        if (newAccountName) {
          dispatch(actions.setAccountLabel(newAccountAddress, newAccountName));
        }
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewAccountCreateForm);