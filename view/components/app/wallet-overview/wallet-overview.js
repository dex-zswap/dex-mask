import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const WalletOverview = ({ balance, buttons, className, icon }) => {
  return (
    <div className={classnames('wallet-overview', className)}>
      <div className="wallet-overview__buttons">{buttons}</div>
    </div>
  );
};

WalletOverview.propTypes = {
  balance: PropTypes.element,
  buttons: PropTypes.element.isRequired,
  className: PropTypes.string,
  icon: PropTypes.element.isRequired,
};

WalletOverview.defaultProps = {
  className: undefined,
};

export default WalletOverview;
