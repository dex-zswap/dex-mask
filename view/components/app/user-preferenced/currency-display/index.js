import CurrencyDisplay from '@c/ui/currency-display';
import { ETH, PRIMARY, SECONDARY } from '@view/helpers/constants/common';
import { useUserPreferencedCurrency } from '@view/hooks/useUserPreferencedCurrency';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

export default function UserPreferencedCurrencyDisplay({
  'data-testid': dataTestId,
  ethLogoHeight = 12,
  ethNumberOfDecimals,
  fiatNumberOfDecimals,
  numberOfDecimals: propsNumberOfDecimals,
  showEthLogo,
  type,
  ...restProps
}) {
  const { currency = ETH, numberOfDecimals } = useUserPreferencedCurrency(
    type,
    {
      ethNumberOfDecimals,
      fiatNumberOfDecimals,
      numberOfDecimals: propsNumberOfDecimals,
    },
  );
  const prefixComponent = useMemo(() => {
    return (
      currency === ETH &&
      showEthLogo && (
        <img src="./images/eth.svg" height={ethLogoHeight} alt="" />
      )
    );
  }, [currency, showEthLogo, ethLogoHeight]);

  return (
    <CurrencyDisplay
      {...restProps}
      currency={currency}
      data-testid={dataTestId}
      numberOfDecimals={numberOfDecimals}
      prefixComponent={prefixComponent}
    />
  );
}

UserPreferencedCurrencyDisplay.propTypes = {
  className: PropTypes.string,
  'data-testid': PropTypes.string,
  prefix: PropTypes.string,
  value: PropTypes.string,
  numberOfDecimals: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  hideLabel: PropTypes.bool,
  hideTitle: PropTypes.bool,
  style: PropTypes.object,
  showEthLogo: PropTypes.bool,
  ethLogoHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.oneOf([PRIMARY, SECONDARY]),
  ethNumberOfDecimals: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  fiatNumberOfDecimals: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};
