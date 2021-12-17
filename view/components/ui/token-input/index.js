import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getShouldShowFiat, getTokenExchangeRates } from '@view/selectors';
import TokenInput from './component';

const mapStateToProps = state => {
  const {
    metamask: {
      currentCurrency
    }
  } = state;
  return {
    currentCurrency,
    tokenExchangeRates: getTokenExchangeRates(state),
    hideConversion: !getShouldShowFiat(state)
  };
};

const TokenInputContainer = connect(mapStateToProps)(TokenInput);
TokenInputContainer.propTypes = {
  token: PropTypes.shape({
    address: PropTypes.string.isRequired,
    decimals: PropTypes.number,
    symbol: PropTypes.string
  }).isRequired
};
export default TokenInputContainer;