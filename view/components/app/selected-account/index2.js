import { getNativeCurrency } from '@reducer/dexmask/dexmask';
import {
  getNativeCurrencyImage,
  getSelectedAccount,
  getSelectedIdentity,
} from '@view/selectors';
import { connect } from 'react-redux';
import SelectedAccount from './component';

const mapStateToProps = (state) => {
  return {
    selectedIdentity: getSelectedIdentity(state),
    selectedAccount: getSelectedAccount(state),
    nativeCurrencyImage: getNativeCurrencyImage(state),
    nativeCurrency: getNativeCurrency(state),
  };
};

export default connect(mapStateToProps)(SelectedAccount);
