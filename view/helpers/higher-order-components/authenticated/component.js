import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { UNLOCK_ROUTE, INITIALIZE_ROUTE } from '@view/helpers/constants/routes';
export default function Authenticated(props) {
  const {
    isUnlocked,
    completedOnboarding
  } = props;

  switch (true) {
    case isUnlocked && completedOnboarding:
      return <Route {...props} />;

    case !completedOnboarding:
      return <Redirect to={{
        pathname: INITIALIZE_ROUTE
      }} />;

    default:
      return <Redirect to={{
        pathname: UNLOCK_ROUTE
      }} />;
  }
}
Authenticated.propTypes = {
  isUnlocked: PropTypes.bool,
  completedOnboarding: PropTypes.bool
};