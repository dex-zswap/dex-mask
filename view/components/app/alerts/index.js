import { alertIsOpen as invalidCustomNetworkAlertIsOpen } from '@reducer/alerts/invalid-custom-network';
import { alertIsOpen as unconnectedAccountAlertIsOpen } from '@reducer/alerts/unconnected-account';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import InvalidCustomNetworkAlert from './invalid-custom-network-alert';
import UnconnectedAccountAlert from './unconnected-account-alert';

const Alerts = ({ history }) => {
  const _invalidCustomNetworkAlertIsOpen = useSelector(
    invalidCustomNetworkAlertIsOpen,
  );
  const _unconnectedAccountAlertIsOpen = useSelector(
    unconnectedAccountAlertIsOpen,
  );

  if (_invalidCustomNetworkAlertIsOpen) {
    return <InvalidCustomNetworkAlert history={history} />;
  }
  if (_unconnectedAccountAlertIsOpen) {
    return <UnconnectedAccountAlert />;
  }

  return null;
};

Alerts.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Alerts;
