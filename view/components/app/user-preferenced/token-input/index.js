import TokenInput from '@c/ui/token-input';
import { getPreferences } from '@view/selectors';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

class UserPreferencedTokenInput extends PureComponent {
  static propTypes = {
    token: PropTypes.shape({
      address: PropTypes.string.isRequired,
      decimals: PropTypes.number,
      symbol: PropTypes.string,
    }).isRequired,
    useNativeCurrencyAsPrimaryCurrency: PropTypes.bool,
  };

  render() {
    const { useNativeCurrencyAsPrimaryCurrency, ...restProps } = this.props;

    return (
      <TokenInput
        {...restProps}
        showFiat={!useNativeCurrencyAsPrimaryCurrency}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { useNativeCurrencyAsPrimaryCurrency } = getPreferences(state);

  return {
    useNativeCurrencyAsPrimaryCurrency,
  };
};

const UserPreferencedTokenInputContainer = connect(mapStateToProps)(
  UserPreferencedTokenInput,
);

UserPreferencedTokenInputContainer.propTypes = {
  token: PropTypes.shape({
    address: PropTypes.string.isRequired,
    decimals: PropTypes.number,
    symbol: PropTypes.string,
  }).isRequired,
};

export default UserPreferencedTokenInputContainer;
