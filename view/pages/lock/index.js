import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { lockDexmask } from '@view/store/actions';
import Lock from './component';

const mapStateToProps = state => {
  const {
    metamask: {
      isUnlocked
    }
  } = state;
  return {
    isUnlocked
  };
};

const mapDispatchToProps = dispatch => {
  return {
    lockDexmask: () => dispatch(lockDexmask())
  };
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Lock);