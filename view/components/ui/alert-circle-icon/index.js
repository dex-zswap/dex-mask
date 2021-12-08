import CircleIcon from '@c/ui/circle-icon';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

const typeConfig = {
  danger: {
    circleClass: 'alert-circle-icon--danger',
    iconSource: 'images/icons/red-triangle-exclaim.svg',
  },
  warning: {
    circleClass: 'alert-circle-icon--warning',
    iconSource: 'images/icons/yellow-bell.svg',
  },
};

export default class AlertCircleIcon extends Component {
  static propTypes = {
    type: PropTypes.oneOf(Object.keys(typeConfig)).isRequired,
  };

  render() {
    return <CircleIcon {...typeConfig[this.props.type]} />;
  }
}
