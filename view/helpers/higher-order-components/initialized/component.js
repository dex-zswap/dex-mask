import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { INITIALIZE_ROUTE } from '@view/helpers/constants/routes'
export default function Initialized(props) {
  return props.completedOnboarding ? (
    <Route {...props} />
  ) : (
    <Redirect
      to={{
        pathname: INITIALIZE_ROUTE,
      }}
    />
  )
}
Initialized.propTypes = {
  completedOnboarding: PropTypes.bool,
}
