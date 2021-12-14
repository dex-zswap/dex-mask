import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import extension from 'extensionizer';

import { getEnvironmentType } from '@app/scripts/lib/util';
import { getDexMaskState } from '@reducer/dexmask/dexmask';
import { getOriginOfCurrentTab } from '@selectors/selectors';

import ConnectedStatusIndicator from '@c/app/connected/status-indicator';

import { ENVIRONMENT_TYPE_POPUP } from '@shared/constants/app';
import Logo from '@c/ui/logo';

export default function TopHeader() {
  const history = useHistory();
  const origin = useSelector(getOriginOfCurrentTab);

  const showStatus = useMemo(() => getEnvironmentType() === ENVIRONMENT_TYPE_POPUP && origin && origin !== extension.runtime.id, [origin]);

  return (
    <div className="top-header-component base-width">
      <Logo plain width={38} height={46} />
      {
        showStatus && <ConnectedStatusIndicator />
      }
      
    </div>
  );
}
