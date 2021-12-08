import { Menu, MenuItem } from '@c/ui/menu';
import {
  createCustomAccountLink,
  getAccountLink,
} from '@metamask/etherscan-link';
import {
  CHAINID_EXPLORE_MAP,
  MAINNET_CHAIN_ID,
  NETWORK_TO_NAME_MAP,
} from '@shared/constants/network';
import { CONNECTED_ROUTE } from '@view/helpers/constants/routes';
import { useI18nContext } from '@view/hooks/useI18nContext';
import {
  getCurrentChainId,
  getCurrentKeyring,
  getRpcPrefsForCurrentProvider,
  getSelectedIdentity,
} from '@view/selectors';
import { showModal } from '@view/store/actions';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

export default function AccountOptionsMenu({ anchorElement, onClose }) {
  const t = useI18nContext();
  const dispatch = useDispatch();
  const history = useHistory();

  const provider = useSelector((state) => state.metamask.provider);
  const keyring = useSelector(getCurrentKeyring);
  const chainId = useSelector(getCurrentChainId);
  const rpcPrefs = useSelector(getRpcPrefsForCurrentProvider);
  const selectedIdentity = useSelector(getSelectedIdentity);
  const { address } = selectedIdentity;
  let addressLink = getAccountLink(address, chainId, rpcPrefs);
  const { blockExplorerUrl } = rpcPrefs;

  if (!addressLink && CHAINID_EXPLORE_MAP[chainId]) {
    addressLink = createCustomAccountLink(
      address,
      CHAINID_EXPLORE_MAP[chainId],
    );
  }

  const providerType =
    NETWORK_TO_NAME_MAP[provider.type] ?? provider.type.toUpperCase();

  const isMainnet = useMemo(() => chainId === MAINNET_CHAIN_ID, [chainId]);

  const getBlockExplorerUrlHost = () => {
    try {
      return new URL(blockExplorerUrl)?.hostname;
    } catch (err) {
      return '';
    }
  };

  const isRemovable = keyring.type !== 'HD Key Tree';
  const blockExplorerUrlSubTitle = getBlockExplorerUrlHost();

  return (
    <Menu
      anchorElement={anchorElement}
      className="account-options-menu"
      onHide={onClose}
    >
      {!process.env.DEXMASK_DEBUG ? null : (
        <MenuItem
          onClick={() => {
            global.platform.openExtensionInBrowser();
            onClose();
          }}
          iconClassName="fas fa-expand-alt"
        >
          {t('expandView')}
        </MenuItem>
      )}
      <MenuItem
        data-testid="account-options-menu__account-details"
        onClick={() => {
          dispatch(showModal({ name: 'ACCOUNT_DETAILS' }));
          onClose();
        }}
        iconClassName="fas fa-qrcode"
      >
        {t('accountDetails')}
      </MenuItem>
      <MenuItem
        onClick={() => {
          global.platform.openTab({
            url: addressLink,
          });
          onClose();
        }}
        subtitle={
          blockExplorerUrlSubTitle ? (
            <span className="account-options-menu__explorer-origin">
              {blockExplorerUrlSubTitle}
            </span>
          ) : null
        }
        iconClassName="fas fa-external-link-alt"
      >
        {rpcPrefs.blockExplorerUrl
          ? t('viewinExplorer', [providerType])
          : isMainnet
          ? t('viewOnEtherscan')
          : t('viewinExplorer', [providerType])}
      </MenuItem>
      <MenuItem
        data-testid="account-options-menu__connected-sites"
        onClick={() => {
          history.push(CONNECTED_ROUTE);
          onClose();
        }}
        iconClassName="account-options-menu__connected-sites"
      >
        {t('connectedSites')}
      </MenuItem>
      {isRemovable ? (
        <MenuItem
          data-testid="account-options-menu__remove-account"
          onClick={() => {
            dispatch(
              showModal({
                name: 'CONFIRM_REMOVE_ACCOUNT',
                identity: selectedIdentity,
              }),
            );
            onClose();
          }}
          iconClassName="fas fa-trash-alt"
        >
          {t('removeAccount')}
        </MenuItem>
      ) : null}
    </Menu>
  );
}

AccountOptionsMenu.propTypes = {
  anchorElement: PropTypes.instanceOf(window.Element),
  onClose: PropTypes.func.isRequired,
};

AccountOptionsMenu.defaultProps = {
  anchorElement: undefined,
};
