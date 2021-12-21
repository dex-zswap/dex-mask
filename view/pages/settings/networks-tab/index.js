import Button from '@c/ui/button';
import { NETWORK_TYPE_RPC } from '@shared/constants/network';
import {
  DEFAULT_ROUTE,
  NETWORKS_FORM_ROUTE,
} from '@view/helpers/constants/routes';
import { useI18nContext } from '@view/hooks/useI18nContext';
import {
  editRpc,
  setNetworksTabAddMode,
  setSelectedSettingsRpcUrl,
  showModal,
  updateAndSetCustomRpc,
} from '@view/store/actions';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { defaultNetworksData } from './constants';
import NetworkForm from './network-form';

const defaultNetworks = defaultNetworksData.map((network) => ({
  ...network,
  viewOnly: true,
}));

export default function NetworksTab() {
  const t = useI18nContext();
  const history = useHistory();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { networksTabSelectedRpcUrl, networksTabIsInAddMode } = useSelector(
    (state) => state.appState,
  );
  const { frequentRpcListDetail, provider } = useSelector(
    (state) => state.metamask,
  );

  const providerType = useMemo(() => provider.type, [provider]);
  const providerUrl = useMemo(() => provider.rpcUrl, [provider]);

  useEffect(() => {
    return () => {
      dispatch(setSelectedSettingsRpcUrl(''));
      dispatch(setNetworksTabAddMode(false));
    };
  }, []);

  const setRpcTarget = useCallback(
    (newRpc, chainId, ticker, nickname, rpcPrefs) =>
      dispatch(
        updateAndSetCustomRpc(newRpc, chainId, ticker, nickname, rpcPrefs),
      ),
    [],
  );

  const showConfirmDeleteNetworkModal = useCallback(() => {
    ({ target, onConfirm }) =>
      dispatch(
        showModal({
          name: 'CONFIRM_DELETE_NETWORK',
          target,
          onConfirm,
        }),
      );
  }, []);

  const showNetworkForm = useMemo(
    () => Boolean(pathname.match(NETWORKS_FORM_ROUTE)),
    [pathname],
  );

  const frequentRpcNetworkListDetails = frequentRpcListDetail.map((rpc) => {
    return {
      label: rpc.nickname,
      iconImg: 'rpc.png',
      providerType: NETWORK_TYPE_RPC,
      rpcUrl: rpc.rpcUrl,
      chainId: rpc.chainId,
      ticker: rpc.ticker,
      blockExplorerUrl: rpc.rpcPrefs?.blockExplorerUrl || '',
    };
  });
  const networksToRender = [
    ...defaultNetworks,
    ...frequentRpcNetworkListDetails,
  ];
  let selectedNetwork =
    networksToRender.find(
      (network) => network.rpcUrl === networksTabSelectedRpcUrl,
    ) || {};
  const networkIsSelected = Boolean(selectedNetwork.rpcUrl);
  let networkDefaultedToProvider = false;
  if (!networkIsSelected && !networksTabIsInAddMode) {
    selectedNetwork =
      networksToRender.find((network) => {
        return (
          network.rpcUrl === provider.rpcUrl ||
          (network.providerType !== NETWORK_TYPE_RPC &&
            network.providerType === provider.type)
        );
      }) || {};
    networkDefaultedToProvider = true;
  }

  const renderNetworksList = useMemo(
    () =>
      networksToRender.map((network) => {
        const {
          label,
          labelKey,
          iconImg,
          rpcUrl,
          providerType: currentProviderType,
        } = network;
        return (
          <div
            className="setting-network-list-item"
            onClick={() => {
              dispatch(setNetworksTabAddMode(false));
              dispatch(setSelectedSettingsRpcUrl(rpcUrl));
              history.push(NETWORKS_FORM_ROUTE);
            }}
          >
            <img width={12} src={`images/default-chains/${iconImg}`} />
            <div className="setting-network-list-item-label">
              {label || t(labelKey)}
            </div>
            <div>
              {currentProviderType !== NETWORK_TYPE_RPC && (
                <img
                  className="setting-network-list-item-lock"
                  width={10}
                  src="images/settings/lock.png"
                />
              )}
              <img width={6} src="images/settings/arrow_right.png" />
            </div>
          </div>
        );
      }),
    [
      setSelectedSettingsRpcUrl,
      setNetworksTabAddMode,
      history,
      networksToRender,
      t,
    ],
  );

  const renderNetworksForm = useMemo(() => {
    const {
      labelKey,
      label,
      rpcUrl,
      chainId,
      ticker,
      viewOnly,
      rpcPrefs,
      blockExplorerUrl,
    } = selectedNetwork;

    return (
      <NetworkForm
        setRpcTarget={setRpcTarget}
        editRpc={(oldRpc, newRpc, chainId, ticker, nickname, rpcPrefs) =>
          dispatch(editRpc(oldRpc, newRpc, chainId, ticker, nickname, rpcPrefs))
        }
        networkName={label || (labelKey && t(labelKey)) || ''}
        rpcUrl={rpcUrl}
        chainId={chainId}
        networksToRender={networksToRender}
        ticker={ticker}
        onClear={() => {
          dispatch(setNetworksTabAddMode(false));
          dispatch(setSelectedSettingsRpcUrl(''));
          history.push(DEFAULT_ROUTE);
        }}
        showConfirmDeleteNetworkModal={showConfirmDeleteNetworkModal}
        viewOnly={viewOnly}
        isCurrentRpcTarget={providerUrl === rpcUrl}
        networksTabIsInAddMode={networksTabIsInAddMode}
        rpcPrefs={rpcPrefs}
        blockExplorerUrl={blockExplorerUrl}
      />
    );
  }, [selectedNetwork]);

  return (
    <div className="base-width">
      {showNetworkForm ? (
        renderNetworksForm
      ) : (
        <>
          <div className="setting-item">
            <div className="setting-label">{t('addNetwork')}</div>
            <Button
              type="primary"
              onClick={(event) => {
                event.preventDefault();
                dispatch(setSelectedSettingsRpcUrl(''));
                dispatch(setNetworksTabAddMode(true));
                history.push(NETWORKS_FORM_ROUTE);
              }}
            >
              {t('addNetwork')}
            </Button>
          </div>
          {renderNetworksList}
        </>
      )}
    </div>
  );
}
