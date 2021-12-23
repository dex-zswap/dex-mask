import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Identicon from '@c/ui/identicon';

export default function AccountModalContainer(props) {
  const {
    className,
    selectedIdentity,
    showBackButton,
    backButtonAction,
    hideModal,
    children,
  } = props;
  return (
    <div
      className={classnames(className, 'account-modal')}
      style={{
        borderRadius: '4px',
      }}
    >
      <div className="account-modal__container">
        <div className="account-modal-avatar-container">
          <Identicon address={selectedIdentity.address} diameter={55} />
        </div>
        <button className="account-modal__close" onClick={hideModal} />
        {children}
      </div>
    </div>
  );
}