import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { getEnvironmentType } from '@app/scripts/lib/util'
import ColorIndicator from '@c/ui/color-indicator'
import { Menu, MenuItem } from '@c/ui/menu'
import { openAlert as displayInvalidCustomNetworkAlert } from '@reducer/alerts/invalid-custom-network'
import { ENVIRONMENT_TYPE_FULLSCREEN } from '@shared/constants/app'
import { NETWORK_TYPE_RPC } from '@shared/constants/network'
import { isPrefixedFormattedHexString } from '@shared/modules/network.utils'
import { COLORS, SIZES } from '@view/helpers/constants/design-system'
import {
  NETWORKS_FORM_ROUTE,
  NETWORKS_ROUTE,
} from '@view/helpers/constants/routes'
import * as actions from '@view/store/actions'
import { Dropdown, DropdownMenuItem } from './dropdown' // classes from nodes of the toggle element.

const notToggleElementClassnames = [
  'menu-icon',
  'network-name',
  'network-indicator',
  'network-caret',
  'network-component',
  'modal-container__footer-button',
]
const DROP_DOWN_MENU_ITEM_STYLE = {
  fontSize: '16px',
  lineHeight: '20px',
  padding: '12px 0',
}

function mapStateToProps(state) {
  return {
    provider: state.metamask.provider,
    frequentRpcListDetail: state.metamask.frequentRpcListDetail || [],
    networkType: state.appState.networkType,
    networkDropdownOpen: state.appState.networkDropdownOpen,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setProviderType: (type) => {
      dispatch(actions.setProviderType(type))
    },
    setRpcTarget: (target, chainId, ticker, nickname) => {
      dispatch(actions.setRpcTarget(target, chainId, ticker, nickname))
    },
    hideNetworkDropdown: () => dispatch(actions.hideNetworkDropdown()),
    setNetworksTabAddMode: (isInAddMode) => {
      dispatch(actions.setNetworksTabAddMode(isInAddMode))
    },
    setSelectedSettingsRpcUrl: (url) => {
      dispatch(actions.setSelectedSettingsRpcUrl(url))
    },
    displayInvalidCustomNetworkAlert: (networkName) => {
      dispatch(displayInvalidCustomNetworkAlert(networkName))
    },
    showConfirmDeleteNetworkModal: ({ target, onConfirm }) => {
      return dispatch(
        actions.showModal({
          name: 'CONFIRM_DELETE_NETWORK',
          target,
          onConfirm,
        }),
      )
    },
  }
}

class NetworkDropdown extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }
  static propTypes = {
    provider: PropTypes.shape({
      nickname: PropTypes.string,
      rpcUrl: PropTypes.string,
      type: PropTypes.string,
      ticker: PropTypes.string,
    }).isRequired,
    setProviderType: PropTypes.func.isRequired,
    setRpcTarget: PropTypes.func.isRequired,
    hideNetworkDropdown: PropTypes.func.isRequired,
    setNetworksTabAddMode: PropTypes.func.isRequired,
    setSelectedSettingsRpcUrl: PropTypes.func.isRequired,
    frequentRpcListDetail: PropTypes.array.isRequired,
    networkDropdownOpen: PropTypes.bool.isRequired,
    networkType: PropTypes.string,
    history: PropTypes.object.isRequired,
    displayInvalidCustomNetworkAlert: PropTypes.func.isRequired,
    showConfirmDeleteNetworkModal: PropTypes.func.isRequired,
    triggerEl: PropTypes.object,
  }

  handleClick(newProviderType) {
    const {
      provider: { type: providerType },
      setProviderType,
    } = this.props
    this.props.hideNetworkDropdown()
    setProviderType(newProviderType)
  }

  renderCustomRpcList(rpcListDetail, provider) {
    const reversedRpcListDetail = rpcListDetail.slice().reverse()
    return reversedRpcListDetail.map((entry) => {
      const { rpcUrl, chainId, ticker = 'ETH', nickname = '' } = entry
      const isCurrentRpcTarget =
        provider.type === NETWORK_TYPE_RPC && rpcUrl === provider.rpcUrl
      return (
        <DropdownMenuItem
          key={`common${rpcUrl}`}
          closeMenu={() => this.props.hideNetworkDropdown()}
          onClick={() => {
            if (isPrefixedFormattedHexString(chainId)) {
              this.props.setRpcTarget(rpcUrl, chainId, ticker, nickname)
            } else {
              this.props.displayInvalidCustomNetworkAlert(nickname || rpcUrl)
            }
          }}
          style={{
            fontSize: '16px',
            lineHeight: '20px',
            padding: '12px 0',
          }}
        >
          {isCurrentRpcTarget ? (
            <i className='fa fa-check' />
          ) : (
            <div className='network-check__transparent'>✓</div>
          )}
          <ColorIndicator
            color={COLORS.UI2}
            size={SIZES.LG}
            type={ColorIndicator.TYPES.FILLED}
            borderColor={isCurrentRpcTarget ? COLORS.WHITE : COLORS.UI2}
          />
          <span
            className='network-name-item'
            style={{
              color: isCurrentRpcTarget ? '#ffffff' : '#9b9b9b',
            }}
          >
            {nickname || rpcUrl}
          </span>
          {isCurrentRpcTarget ? null : (
            <i
              className='fa fa-times delete'
              onClick={(e) => {
                e.stopPropagation()
                this.props.showConfirmDeleteNetworkModal({
                  target: rpcUrl,
                  onConfirm: () => undefined,
                })
              }}
            />
          )}
        </DropdownMenuItem>
      )
    })
  }

  getNetworkName() {
    const { provider } = this.props
    const providerName = provider.type
    let name

    if (providerName === 'mainnet') {
      name = this.context.t('mainnet')
    } else if (providerName === 'ropsten') {
      name = this.context.t('ropsten')
    } else if (providerName === 'kovan') {
      name = this.context.t('kovan')
    } else if (providerName === 'rinkeby') {
      name = this.context.t('rinkeby')
    } else if (providerName === 'goerli') {
      name = this.context.t('goerli')
    } else if (providerName === 'bscMainnet') {
      name = this.context.t('bscMainnet')
    } else if (providerName === 'dexMainnet') {
      name = this.context.t('dexMainnet')
    } else {
      name = provider.nickname || this.context.t('unknownNetwork')
    }

    return name
  }

  renderNetworkEntry(network) {
    const {
      provider: { type: providerType },
    } = this.props
    return (
      <DropdownMenuItem
        key={network}
        closeMenu={this.props.hideNetworkDropdown}
        onClick={() => this.handleClick(network)}
        style={DROP_DOWN_MENU_ITEM_STYLE}
      >
        {providerType === network ? (
          <i className='fa fa-check' />
        ) : (
          <div className='network-check__transparent'>✓</div>
        )}
        <ColorIndicator
          color={network}
          size={SIZES.LG}
          type={ColorIndicator.TYPES.FILLED}
          borderColor={providerType === network ? COLORS.WHITE : network}
        />
        <span
          className='network-name-item'
          style={{
            color: providerType === network ? '#ffffff' : '#9b9b9b',
          }}
        >
          {this.context.t(network)}
        </span>
      </DropdownMenuItem>
    )
  }

  renderCustomRpcListMenus(rpcListDetail, provider) {
    const reversedRpcListDetail = rpcListDetail.slice().reverse()
    return reversedRpcListDetail.map((entry) => {
      const { rpcUrl, chainId, ticker = 'ETH', nickname = '' } = entry
      const isCurrentRpcTarget =
        provider.type === NETWORK_TYPE_RPC && rpcUrl === provider.rpcUrl
      return (
        <MenuItem
          className={isCurrentRpcTarget ? 'active' : ''}
          key={`common${rpcUrl}`}
          onClick={() => {
            this.props.hideNetworkDropdown()

            if (isPrefixedFormattedHexString(chainId)) {
              this.props.setRpcTarget(rpcUrl, chainId, ticker, nickname)
            } else {
              this.props.displayInvalidCustomNetworkAlert(nickname || rpcUrl)
            }
          }}
        >
          <div className='network__chain-icon'></div>
          <div className='chain-name'>{nickname || rpcUrl}</div>
        </MenuItem>
      )
    })
  }

  renderNetworkMenu(network) {
    const {
      provider: { type: providerType },
    } = this.props
    const iconBg =
      'dexMainnet' === network
        ? '/images/dex-token.png'
        : 'mainnet' === network
        ? '/images/eth_logo.png'
        : 'bscMainnet' === network
        ? '/images/bnb.png'
        : '/images/dex/settings/chain-icon.png'
    return (
      <MenuItem
        className={network === providerType ? 'active' : ''}
        key={network}
        onClick={() => this.handleClick(network)}
      >
        <div
          style={{
            background: `url(${iconBg}) no-repeat
            center / cover`,
          }}
          className='network__chain-icon'
        ></div>
        <div className='chain-name'>{this.context.t(network)}</div>
      </MenuItem>
    )
  }

  renderDrop() {
    const {
      provider: { rpcUrl: activeNetwork },
      setNetworksTabAddMode,
      setSelectedSettingsRpcUrl,
    } = this.props
    const rpcListDetail = this.props.frequentRpcListDetail
    const isOpen = this.props.networkDropdownOpen
    return (
      <Dropdown
        isOpen={isOpen}
        onClickOutside={(event) => {
          const { classList } = event.target

          const isInClassList = (className) => classList.contains(className)

          const notToggleElementIndex = notToggleElementClassnames.findIndex(
            isInClassList,
          )

          if (notToggleElementIndex === -1) {
            event.stopPropagation()
            this.props.hideNetworkDropdown()
          }
        }}
        containerClassName={[
          'network-droppo',
          isOpen && 'network-droppo__wrapper',
        ].join(' ')}
        style={{}}
      >
        <div className='network-dropdown-header'>
          <div className='network-dropdown-title'>
            {this.context.t('networks')}
          </div>
          <div className='network-dropdown-divider' />
          <div className='network-dropdown-content'>
            {this.context.t('defaultNetwork')}
          </div>
        </div>
        {this.renderNetworkEntry('dexMainnet')}
        {this.renderNetworkEntry('mainnet')}
        {this.renderNetworkEntry('bscMainnet')}
        {this.renderNetworkEntry('ropsten')}
        {this.renderNetworkEntry('kovan')}
        {this.renderNetworkEntry('rinkeby')}
        {this.renderNetworkEntry('goerli')}

        {this.renderCustomRpcList(rpcListDetail, this.props.provider)}
        <DropdownMenuItem
          closeMenu={() => this.props.hideNetworkDropdown()}
          onClick={() => {
            this.props.history.push(NETWORKS_FORM_ROUTE)
            setSelectedSettingsRpcUrl('')
            setNetworksTabAddMode(true)
          }}
          style={DROP_DOWN_MENU_ITEM_STYLE}
        >
          {activeNetwork === 'custom' ? (
            <i className='fa fa-check' />
          ) : (
            <div className='network-check__transparent'>✓</div>
          )}
          <ColorIndicator
            type={ColorIndicator.TYPES.FILLED}
            color={COLORS.TRANSPARENT}
            borderColor={COLORS.UI2}
            size={SIZES.LG}
          />
          <span
            className='network-name-item'
            style={{
              color: activeNetwork === 'custom' ? '#ffffff' : '#9b9b9b',
            }}
          >
            {this.context.t('customRPC')}
          </span>
        </DropdownMenuItem>
      </Dropdown>
    )
  }

  renderMenu() {
    const {
      provider: { rpcUrl: activeNetwork },
      setNetworksTabAddMode,
      setSelectedSettingsRpcUrl,
      triggerEl,
      hideNetworkDropdown,
    } = this.props
    const rpcListDetail = this.props.frequentRpcListDetail
    const isOpen = this.props.networkDropdownOpen
    return (
      <>
        {isOpen ? (
          <Menu
            className='network-droppo__menu'
            anchorElement={triggerEl}
            onHide={hideNetworkDropdown}
          >
            {this.renderNetworkMenu('dexMainnet')}
            {this.renderNetworkMenu('mainnet')}
            {this.renderNetworkMenu('bscMainnet')}
            {this.renderNetworkMenu('ropsten')}
            {this.renderNetworkMenu('kovan')}
            {this.renderNetworkMenu('rinkeby')}
            {this.renderNetworkMenu('goerli')}
            {this.renderCustomRpcListMenus(rpcListDetail, this.props.provider)}
            <div className='network-divder'></div>
            <MenuItem
              onClick={() => {
                this.props.history.push(
                  getEnvironmentType() === ENVIRONMENT_TYPE_FULLSCREEN
                    ? NETWORKS_ROUTE
                    : NETWORKS_FORM_ROUTE,
                )
                setSelectedSettingsRpcUrl('')
                setNetworksTabAddMode(true)
              }}
            >
              <div className='network__chain-icon custom'></div>
              <div className='chain-name'>{this.context.t('customRPC')}</div>
            </MenuItem>
          </Menu>
        ) : null}
      </>
    )
  }

  render() {
    return this.renderDrop()
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(NetworkDropdown)
