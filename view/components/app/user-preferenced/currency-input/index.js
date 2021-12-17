import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CurrencyInput from '@c/ui/currency-input';
import { getPreferences } from '@view/selectors';

class UserPreferencedCurrencyInput extends PureComponent {
  static propTypes = {
    useNativeCurrencyAsPrimaryCurrency: PropTypes.bool
  };

  render() {
    const {
      useNativeCurrencyAsPrimaryCurrency,
      ...restProps
    } = this.props;
    return <CurrencyInput {...restProps} useFiat={!useNativeCurrencyAsPrimaryCurrency} />;
  }

}

const mapStateToProps = state => {
  const {
    useNativeCurrencyAsPrimaryCurrency
  } = getPreferences(state);
  return {
    useNativeCurrencyAsPrimaryCurrency
  };
};

export default connect(mapStateToProps)(UserPreferencedCurrencyInput);