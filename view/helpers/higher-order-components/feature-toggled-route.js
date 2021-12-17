import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
export default function FeatureToggledRoute({ flag, redirectRoute, ...props }) {
  if (flag) {
    return <Route {...props} />;
  }

  return (
    <Redirect
      to={{
        pathname: redirectRoute,
      }}
    />
  );
}
FeatureToggledRoute.propTypes = {
  flag: PropTypes.bool.isRequired,
  redirectRoute: PropTypes.string.isRequired,
};
