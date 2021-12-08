import { getMetaMaskIdentities } from '@view/selectors';
import { connect } from 'react-redux';
import PermissionPageContainer from './component';

export { default as PermissionPageContainerContent } from './permission-page-container-content';

const mapStateToProps = (state, ownProps) => {
  const { selectedIdentities } = ownProps;

  const allIdentities = getMetaMaskIdentities(state);
  const allIdentitiesSelected =
    Object.keys(selectedIdentities).length ===
      Object.keys(allIdentities).length && selectedIdentities.length > 1;

  return {
    allIdentitiesSelected,
  };
};

export default connect(mapStateToProps)(PermissionPageContainer);
