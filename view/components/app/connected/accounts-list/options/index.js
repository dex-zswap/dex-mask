import { Menu } from '@c/ui/menu';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const ConnectedAccountsListOptions = ({
  children,
  onShowOptions,
  onHideOptions,
  show,
}) => {
  const [optionsButtonElement, setOptionsButtonElement] = useState(null);

  return (
    <>
      <button
        className="fas fa-ellipsis-v connected-accounts-options__button"
        onClick={onShowOptions}
        ref={setOptionsButtonElement}
      />
      {show ? (
        <Menu
          anchorElement={optionsButtonElement}
          onHide={onHideOptions}
          className="connected-accounts-list-item__menu"
          popperOptions={{
            modifiers: [
              { name: 'preventOverflow', options: { altBoundary: true } },
            ],
          }}
        >
          {children}
        </Menu>
      ) : null}
    </>
  );
};

ConnectedAccountsListOptions.propTypes = {
  children: PropTypes.node.isRequired,
  onHideOptions: PropTypes.func.isRequired,
  onShowOptions: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

export default ConnectedAccountsListOptions;
