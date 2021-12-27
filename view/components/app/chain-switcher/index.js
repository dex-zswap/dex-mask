import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import Button from '@c/ui/button'
import LongLetter from '@c/ui/long-letter'
import { Menu, MenuItem } from '@c/ui/menu'
import Selector from '@c/ui/selector'
import {
  DEFAULT_NETWORK_LIST,
  NETWORK_TYPE_RPC,
} from '@shared/constants/network'
import { isPrefixedFormattedHexString } from '@shared/modules/network.utils'
import { NETWORKS_FORM_ROUTE } from '@view/helpers/constants/routes'
import * as actions from '@view/store/actions'

const SelectorOption = (props) => {
  return (
    <div
      className={classnames(
        'chain-option-item flex items-center',
        props.provider?.toLowerCase(),
      )}
    >
      <i className='option-item-chain'></i>
      {props.label}
    </div>
  )
}

class ChainSwitcher extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }
  defaultChains = DEFAULT_NETWORK_LIST.map(({ chainId, provider, label }) => {
    return {
      key: chainId,
      value: chainId,
      provider: provider,
      isBulitIn: true,
      label,
    }
  })

  getNetWorkOptions() {
    const networkOptions = this.defaultChains
    const { frequentRpcListDetail } = this.props
    return networkOptions.concat(
      frequentRpcListDetail.map((item) => {
        return {
          key: item.chainId,
          value: item.chainId,
          isBulitIn: false,
          label: item.nickname,
          setPrcParams: [item.rpcUrl, item.chainId, item.ticker, item.nickname],
        }
      }),
    )
  }

  switchNetWork = (value, detail) => {
    if (detail.isBulitIn) {
      this.props.setProviderType(detail.provider)
      return
    }

    this.props.setRpcTarget.apply(null, detail.setPrcParams ?? [])
  }

  render() {
    const {
      history,
      showNetworkDropdown,
      provider,
      resetNetworksForm,
      addRpc,
    } = this.props
    const networkOptions = this.getNetWorkOptions()
    return (
      <>
        <div className='chain-switcher'>
          <Selector
            className='chain-switcher-selector'
            selectedValue={provider.chainId}
            options={networkOptions}
            labelRender={SelectorOption}
            itemRender={SelectorOption}
            onSelect={this.switchNetWork}
            footer={
              addRpc ? (
                <Button
                  className='add-rpc-entry'
                  onClick={() => {
                    resetNetworksForm()
                    history.push(NETWORKS_FORM_ROUTE)
                  }}
                >
                  <span>
                    {this.context.t('addNetwork')}
                    <i className='add-icon'></i>
                  </span>
                </Button>
              ) : null
            }
            small
          />
        </div>
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    provider: state.metamask.provider,
    frequentRpcListDetail: state.metamask.frequentRpcListDetail || [],
  }
}

function mapDispatchToProps(dispatch) {
  return {
    resetNetworksForm: () => {
      dispatch(actions.setSelectedSettingsRpcUrl(''))
      dispatch(actions.setNetworksTabAddMode(true))
    },
    showNetworkDropdown: () => dispatch(actions.showNetworkDropdown('menu')),
    setProviderType: (type) => {
      dispatch(actions.setProviderType(type))
    },
    setRpcTarget: (target, chainId, ticker, nickname) => {
      dispatch(actions.setRpcTarget(target, chainId, ticker, nickname))
    },
    hideNetworkDropdown: () => dispatch(actions.hideNetworkDropdown()),
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

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ChainSwitcher)
