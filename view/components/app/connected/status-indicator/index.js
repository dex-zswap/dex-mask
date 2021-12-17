import React from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import { findKey } from 'lodash';
import { STATUS_CONNECTED, STATUS_CONNECTED_TO_ANOTHER_ACCOUNT, STATUS_NOT_CONNECTED } from '@view/helpers/constants/connected-sites';
import { useI18nContext } from '@view/hooks/useI18nContext';
import { getAddressConnectedDomainMap, getOriginOfCurrentTab, getSelectedAddress } from '@view/selectors';
export default function ConnectedStatusIndicator({
  onClick
}) {
  const t = useI18nContext();
  const selectedAddress = useSelector(getSelectedAddress);
  const addressConnectedDomainMap = useSelector(getAddressConnectedDomainMap);
  const originOfCurrentTab = useSelector(getOriginOfCurrentTab);
  const selectedAddressDomainMap = addressConnectedDomainMap[selectedAddress];
  const currentTabIsConnectedToSelectedAddress = Boolean(selectedAddressDomainMap && selectedAddressDomainMap[originOfCurrentTab]);
  let status;

  if (currentTabIsConnectedToSelectedAddress) {
    status = STATUS_CONNECTED;
  } else if (findKey(addressConnectedDomainMap, originOfCurrentTab)) {
    status = STATUS_CONNECTED_TO_ANOTHER_ACCOUNT;
  } else {
    status = STATUS_NOT_CONNECTED;
  }

  const text = status === STATUS_CONNECTED ? t('statusConnected') : t('statusNotConnected');
  return <button className="connected-status-indicator flex items-center" onClick={onClick}>
      <i className={classnames('connected-status', status === STATUS_CONNECTED ? 'connected' : 'not-connected')}></i>
      <div className="connected-status-indicator__text">{text}</div>
    </button>;
}