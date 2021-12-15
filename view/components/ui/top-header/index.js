import React, { useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import classnames from 'classnames';
import extension from 'extensionizer';

import { getEnvironmentType } from '@app/scripts/lib/util';
import { getDexMaskState } from '@reducer/dexmask/dexmask';
import { getOriginOfCurrentTab, getSelectedAddress } from '@selectors/selectors';
import { toggleAccountMenu } from '@view/store/actions';
import AccountMenu from '@c/app/account-menu';

import ConnectedStatusIndicator from '@c/app/connected/status-indicator';
import Identicon from '@c/ui/identicon';

import { ENVIRONMENT_TYPE_POPUP } from '@shared/constants/app';
import Logo from '@c/ui/logo';

export default function TopHeader({ fixed }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const origin = useSelector(getOriginOfCurrentTab);
  const selectedAddress = useSelector(getSelectedAddress);

  const showStatus = useMemo(() => getEnvironmentType() === ENVIRONMENT_TYPE_POPUP && origin && origin !== extension.runtime.id, [origin]);

  const toggleMenu = useCallback(
    () => {
      dispatch(toggleAccountMenu());
    },
    [dispatch, toggleAccountMenu]
  );

  return (
    <div className="top-header-component">
      <div  className={classnames('top-header-container flex space-between items-center base-width', fixed && 'fixed-top-header')}>
        <Logo plain />
        {
          showStatus && <ConnectedStatusIndicator />
        }
        <div className="account-menu-trigger flex items-center justify-center" onClick={toggleMenu}>
          <Identicon address={selectedAddress} diameter={28} />
        </div>
      </div>
      {
        fixed && <div className="header-placeholder"></div>
      }
      <AccountMenu />
    </div>
  );
}
