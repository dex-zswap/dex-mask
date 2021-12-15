import React from 'react';
import classnames from 'classnames';

const WalletOverview = ({ buttons, className }) => {
  return (
    <div className={classnames('wallet-overview', className)}>
      <div className="wallet-overview-buttons">
        { buttons.map((btn) => {
          return (
            <div key={btn.key} className={classnames('overview-btn', `btn-${btn.key}`)} onClick={btn.onClick}>
              <div className={classnames('overview-btn-icon', btn.iconClass)}></div>
              <p className="overview-btn-label">{btn.label}</p>
            </div>
          );
        }) }
      </div>
    </div>
  );
};

export default WalletOverview;
