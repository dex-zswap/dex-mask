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
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

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
      leftIcon={
        <LoadingIndicator
          alt={t('attemptingConnect')}
          title={t('attemptingConnect')}
          isLoading={networkIsLoading}
        >
          <ColorIndicator
            color={networkType === NETWORK_TYPE_RPC ? COLORS.UI4 : networkType}
            size={indicatorSize}
            type={ColorIndicator.TYPES.FILLED}
            iconClassName={
              networkType === NETWORK_TYPE_RPC && indicatorSize !== SIZES.XS
                ? 'fa fa-question'
                : undefined
            }
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
NetworkDisplay.propTypes = {
  colored: PropTypes.bool,
  indicatorSize: PropTypes.oneOf(Object.values(SIZES)),
  labelProps: Chip.propTypes.labelProps,
  targetNetwork: PropTypes.shape({
    type: PropTypes.oneOf([
      ...Object.values(NETWORK_TYPE_TO_ID_MAP),
      NETWORK_TYPE_RPC,
    ]),
    nickname: PropTypes.string,
  }),
  outline: PropTypes.bool,
  disabled: PropTypes.bool,
  iconClassName: PropTypes.string,
  onClick: PropTypes.func,
};

NetworkDisplay.defaultProps = {
  colored: true,
  indicatorSize: SIZES.LG,
};
