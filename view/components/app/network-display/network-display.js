import React from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Chip from '@c/ui/chip';
import ColorIndicator from '@c/ui/color-indicator';
import LoadingIndicator from '@c/ui/loading-indicator';
import {
  NETWORK_TYPE_RPC,
  NETWORK_TYPE_TO_ID_MAP,
} from '@shared/constants/network';
import {
  COLORS,
  SIZES,
  TYPOGRAPHY,
} from '@view/helpers/constants/design-system';
import { useI18nContext } from '@view/hooks/useI18nContext';
import { isNetworkLoading } from '@view/selectors';
export default function NetworkDisplay({
  colored,
  outline,
  iconClassName,
  indicatorSize,
  disabled,
  labelProps,
  targetNetwork,
  onClick,
}) {
  const networkIsLoading = useSelector(isNetworkLoading);
  const currentNetwork = useSelector((state) => ({
    nickname: state.metamask.provider.nickname,
    type: state.metamask.provider.type,
  }));
  const t = useI18nContext();
  const { nickname: networkNickname, type: networkType } =
    targetNetwork ?? currentNetwork;
  return (
    <Chip
      borderColor={outline ? COLORS.UI3 : COLORS.TRANSPARENT}
      onClick={onClick}
      provider={networkType}
      leftIcon={
        <LoadingIndicator
          alt={t('attemptingConnect')}
          title={t('attemptingConnect')}
          isLoading={networkIsLoading}
        >
          <ColorIndicator
            color={
              networkType === NETWORK_TYPE_RPC
                ? COLORS.UI4
                : networkType.toLowerCase()
            }
            size={indicatorSize}
            type={ColorIndicator.TYPES.FILLED}
          />
        </LoadingIndicator>
      }
      rightIcon={
        iconClassName && (
          <i className={classnames('network-display__icon', iconClassName)} />
        )
      }
      label={
        networkType === NETWORK_TYPE_RPC
          ? networkNickname ?? t('privateNetwork')
          : t(networkType)
      }
      className={classnames('network-display', {
        'network-display--colored': colored,
        'network-display--disabled': disabled,
        [`network-display--${networkType}`]: colored && networkType,
        'network-display--clickable': typeof onClick === 'function',
      })}
      labelProps={{
        variant: TYPOGRAPHY.H7,
        ...labelProps,
      }}
    />
  );
}
