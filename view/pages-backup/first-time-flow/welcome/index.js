import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { closeWelcomeScreen, updateCurrentLocale } from '@view/store/actions';
import Welcome from './component';

const mapStateToProps = ({
  metamask
}) => {
  const {
    welcomeScreenSeen,
    participateInMetaMetrics,
    currentLocale
  } = metamask;
  return {
    currentLocale,
    welcomeScreenSeen,
    participateInMetaMetrics
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateCurrentLocale: key => dispatch(updateCurrentLocale(key)),
    closeWelcomeScreen: () => dispatch(closeWelcomeScreen())
  };
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Welcome);