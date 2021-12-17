import React, { PureComponent } from 'react';
import { matchPath } from 'react-router-dom';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Button from '@c/ui/button';
import ColorIndicator from '@c/ui/color-indicator';
import LockIcon from '@c/ui/lock-icon';
import { NETWORK_TYPE_RPC } from '@shared/constants/network';
import { COLORS, SIZES } from '@view/helpers/constants/design-system';
import { DEFAULT_ROUTE, NETWORKS_FORM_ROUTE } from '@view/helpers/constants/routes';
import NetworkForm from './network-form';
export default class NetworksTab extends PureComponent {
  static contextTypes = {
    t: PropTypes.func.isRequired
  };
  static propTypes = {
    editRpc: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    networkIsSelected: PropTypes.bool,
    networksTabIsInAddMode: PropTypes.bool,
    networksToRender: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedNetwork: PropTypes.object,
    setNetworksTabAddMode: PropTypes.func.isRequired,
    setRpcTarget: PropTypes.func.isRequired,
    setSelectedSettingsRpcUrl: PropTypes.func.isRequired,
    showConfirmDeleteNetworkModal: PropTypes.func.isRequired,
    providerUrl: PropTypes.string,
    providerType: PropTypes.string,
    networkDefaultedToProvider: PropTypes.bool,
    history: PropTypes.object.isRequired,
    shouldRenderNetworkForm: PropTypes.bool.isRequired,
    isFullScreen: PropTypes.bool.isRequired
  };

  componentWillUnmount() {
    this.props.setSelectedSettingsRpcUrl('');
    this.props.setNetworksTabAddMode(false);
  }

  isCurrentPath(pathname) {
    return this.props.location.pathname === pathname;
  }

  renderSubHeader() {
    const {
      setSelectedSettingsRpcUrl,
      setNetworksTabAddMode,
      location,
      history
    } = this.props;

    if (matchPath(location.pathname, {
      path: NETWORKS_FORM_ROUTE,
      exact: true
    })) {
      return null;
    }

    return <div className="settings-page__sub-header">
        <div className="networks-tab__add-network-header-button-wrapper">
          <Button type="primary" onClick={event => {
          event.preventDefault();
          setSelectedSettingsRpcUrl('');
          setNetworksTabAddMode(true);
          history.push(NETWORKS_FORM_ROUTE);
        }}>
            {this.context.t('addNetwork')}
          </Button>
        </div>
      </div>;
  }

  renderNetworkListItem(network, selectRpcUrl) {
    const {
      setSelectedSettingsRpcUrl,
      setNetworksTabAddMode,
      networkIsSelected,
      providerUrl,
      providerType,
      networksTabIsInAddMode,
      history
    } = this.props;
    const {
      label,
      labelKey,
      rpcUrl,
      providerType: currentProviderType
    } = network;
    const listItemNetworkIsSelected = selectRpcUrl && selectRpcUrl === rpcUrl;
    const listItemUrlIsProviderUrl = rpcUrl === providerUrl;
    const listItemTypeIsProviderNonRpcType = providerType !== NETWORK_TYPE_RPC && currentProviderType === providerType;
    const listItemNetworkIsCurrentProvider = !networkIsSelected && !networksTabIsInAddMode && (listItemUrlIsProviderUrl || listItemTypeIsProviderNonRpcType);
    const displayNetworkListItemAsSelected = listItemNetworkIsSelected || listItemNetworkIsCurrentProvider;
    return <div key={`settings-network-list-item:${rpcUrl}`} className="networks-tab__networks-list-item" onClick={() => {
      setNetworksTabAddMode(false);
      setSelectedSettingsRpcUrl(rpcUrl);
      history.push(NETWORKS_FORM_ROUTE);
    }}>
        <ColorIndicator color={labelKey} type={ColorIndicator.TYPES.FILLED} size={SIZES.LG} />
        <div className={classnames('networks-tab__networks-list-name', {
        'networks-tab__networks-list-name--selected': displayNetworkListItemAsSelected,
        'networks-tab__networks-list-name--disabled': currentProviderType !== NETWORK_TYPE_RPC && !displayNetworkListItemAsSelected
      })}>
          {label || this.context.t(labelKey)}
          {currentProviderType !== NETWORK_TYPE_RPC && <LockIcon width="14px" height="17px" fill="#cdcdcd" />}
        </div>
        <div className="networks-tab__networks-list-arrow" />
      </div>;
  }

  renderNetworksList() {
    const {
      networksToRender,
      selectedNetwork,
      networkIsSelected,
      networksTabIsInAddMode,
      networkDefaultedToProvider,
      location
    } = this.props;

    if (matchPath(location.pathname, {
      path: NETWORKS_FORM_ROUTE,
      exact: true
    })) {
      return null;
    }

    return <div className={classnames('networks-tab__networks-list', {
      'networks-tab__networks-list--selection': networkIsSelected && !networkDefaultedToProvider || networksTabIsInAddMode
    })}>
        {networksToRender.map(network => this.renderNetworkListItem(network, selectedNetwork.rpcUrl))}
        {networksTabIsInAddMode && <div className="networks-tab__networks-list-item">
            <ColorIndicator type={ColorIndicator.TYPES.FILLED} color={COLORS.WHITE} borderColor={COLORS.UI4} size={SIZES.LG} />
            <div className="networks-tab__networks-list-name networks-tab__networks-list-name--selected">
              {this.context.t('newNetwork')}
            </div>
            <div className="networks-tab__networks-list-arrow" />
          </div>}
      </div>;
  }

  renderNetworksTabContent() {
    const {
      t
    } = this.context;
    const {
      setRpcTarget,
      showConfirmDeleteNetworkModal,
      setSelectedSettingsRpcUrl,
      setNetworksTabAddMode,
      selectedNetwork: {
        labelKey,
        label,
        rpcUrl,
        chainId,
        ticker,
        viewOnly,
        rpcPrefs,
        blockExplorerUrl
      },
      networksTabIsInAddMode,
      editRpc,
      providerUrl,
      networksToRender,
      history,
      isFullScreen,
      shouldRenderNetworkForm
    } = this.props;
    return <>
        {this.renderNetworksList()}
        {shouldRenderNetworkForm ? <NetworkForm setRpcTarget={setRpcTarget} editRpc={editRpc} networkName={label || labelKey && t(labelKey) || ''} rpcUrl={rpcUrl} chainId={chainId} networksToRender={networksToRender} ticker={ticker} onClear={(shouldUpdateHistory = true) => {
        setNetworksTabAddMode(false);
        setSelectedSettingsRpcUrl('');
        history.push(DEFAULT_ROUTE);
      }} showConfirmDeleteNetworkModal={showConfirmDeleteNetworkModal} viewOnly={viewOnly} isCurrentRpcTarget={providerUrl === rpcUrl} networksTabIsInAddMode={networksTabIsInAddMode} rpcPrefs={rpcPrefs} blockExplorerUrl={blockExplorerUrl} isFullScreen={isFullScreen} /> : null}
      </>;
  }

  render() {
    const {
      setNetworksTabAddMode,
      setSelectedSettingsRpcUrl,
      history,
      isFullScreen,
      shouldRenderNetworkForm
    } = this.props;
    return <div className="networks-tab__body">
        {this.renderSubHeader()}
        <div className="networks-tab__content">
          {this.renderNetworksTabContent()}
        </div>
      </div>;
  }

}