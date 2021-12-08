import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { hexToDecimal } from '@view/helpers/utils/conversions.util';

export default class HexToDecimal extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
  };

  render() {
    const { className, value } = this.props;
    const decimalValue = hexToDecimal(value);

    return <div className={className}>{decimalValue}</div>;
  }
}
