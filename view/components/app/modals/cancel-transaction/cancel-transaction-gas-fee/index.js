import UserPreferencedCurrencyDisplay from '@c/app/user-preferenced/currency-display';
import { PRIMARY, SECONDARY } from '@view/helpers/constants/common';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

export default class CancelTransaction extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
  };

  render() {
    const { value } = this.props;

    return (
      <div className="cancel-transaction-gas-fee">
        <UserPreferencedCurrencyDisplay
          className="cancel-transaction-gas-fee__eth"
          value={value}
          type={PRIMARY}
        />
        <UserPreferencedCurrencyDisplay
          className="cancel-transaction-gas-fee__fiat"
          value={value}
          type={SECONDARY}
        />
      </div>
    );
  }
}
