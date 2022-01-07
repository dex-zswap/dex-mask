import React, { Component } from 'react'
import { getTokenTrackerLink } from '@metamask/etherscan-link'
import PropTypes from 'prop-types'
import { addHexPrefix } from '@app/scripts/lib/util'
import Button from '@c/ui/button'
import Tabs from '@c/ui/tabs'
import TopHeader from '@c/ui/top-header'
import BackBar from '@c/ui/back-bar'
import TextField from '@c/ui/text-field'
import { CHAINID_EXPLORE_MAP } from '@shared/constants/network'
import { isValidHexAddress } from '@shared/modules/hexstring-utils'
import {
  CONFIRM_ADD_TOKEN_ROUTE,
  DEFAULT_ROUTE,
} from '@view/helpers/constants/routes'
import { toBnString } from '@view/helpers/utils/conversions.util'
import { checkExistingAddresses } from '@view/helpers/utils'
import { tokenInfoGetter } from '@view/helpers/utils/token-util'
import TokenList from './token-list'
import TokenSearch from './token-search'
const emptyAddr = '0x0000000000000000000000000000000000000000'
const MIN_DECIMAL_VALUE = 0
const MAX_DECIMAL_VALUE = 36

class AddToken extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }
  state = {
    activeTab: 'search',
    customAddress: '',
    customSymbol: '',
    customDecimals: 0,
    searchResults: [],
    selectedTokens: {},
    tokenSelectorError: null,
    customAddressError: null,
    customSymbolError: null,
    customDecimalsError: null,
    forceEditSymbol: false,
    symbolAutoFilled: false,
    decimalAutoFilled: false,
  }

  componentDidMount() {
    this.tokenInfoGetter = tokenInfoGetter()
    const { pendingTokens = {} } = this.props
    const pendingTokenKeys = Object.keys(pendingTokens)

    if (pendingTokenKeys.length > 0) {
      let selectedTokens = {}
      let customToken = {}
      pendingTokenKeys.forEach((tokenAddress) => {
        const token = pendingTokens[tokenAddress]
        const { isCustom } = token

        if (isCustom) {
          customToken = { ...token }
        } else {
          selectedTokens = { ...selectedTokens, [tokenAddress]: { ...token } }
        }
      })
      const {
        address: customAddress = '',
        symbol: customSymbol = '',
        decimals: customDecimals = 0,
      } = customToken
      this.setState({
        selectedTokens,
        customAddress,
        customSymbol,
        customDecimals,
      })
    }
  }

  handleToggleToken(token) {
    const { address } = token
    const { selectedTokens = {} } = this.state
    const selectedTokensCopy = { ...selectedTokens }

    if (address in selectedTokensCopy) {
      delete selectedTokensCopy[address]
    } else {
      selectedTokensCopy[address] = token
    }

    this.setState({
      selectedTokens: selectedTokensCopy,
      tokenSelectorError: null,
    })
  }

  hasError() {
    const {
      tokenSelectorError,
      customAddressError,
      customSymbolError,
      customDecimalsError,
    } = this.state
    return (
      tokenSelectorError ||
      customAddressError ||
      customSymbolError ||
      customDecimalsError
    )
  }

  hasSelected() {
    const { customAddress = '', selectedTokens = {} } = this.state
    return customAddress || Object.keys(selectedTokens).length > 0
  }

  handleNext = () => {
    if (this.hasError()) {
      return
    }

    if (!this.hasSelected()) {
      this.setState({
        tokenSelectorError: this.context.t('mustSelectOne'),
      })
      return
    }

    const { setPendingTokens, history } = this.props
    const {
      customAddress: address,
      customSymbol: symbol,
      customDecimals: decimals,
      selectedTokens,
    } = this.state
    const customToken = {
      address,
      symbol,
      decimals,
    }
    setPendingTokens({
      customToken,
      selectedTokens,
    })
    history.push(CONFIRM_ADD_TOKEN_ROUTE)
  }

  async attemptToAutoFillTokenParams(address) {
    const { symbol = '', decimals } = await this.tokenInfoGetter(address)
    const symbolAutoFilled = Boolean(symbol)
    const decimalAutoFilled = Boolean(decimals)
    this.setState({
      symbolAutoFilled,
      decimalAutoFilled,
    })
    this.handleCustomSymbolChange(symbol || '')
    this.handleCustomDecimalsChange(decimals)
  }

  handleCustomAddressChange(value) {
    const customAddress = value.trim()
    this.setState({
      customAddress,
      customAddressError: null,
      tokenSelectorError: null,
      symbolAutoFilled: false,
      decimalAutoFilled: false,
    })
    const addressIsValid = isValidHexAddress(customAddress, {
      allowNonPrefixed: false,
    })
    const standardAddress = addHexPrefix(customAddress).toLowerCase()

    switch (true) {
      case !addressIsValid:
        this.setState({
          customAddressError: this.context.t('invalidAddress'),
          customSymbol: '',
          customDecimals: 0,
          customSymbolError: null,
          customDecimalsError: null,
        })
        break

      case Boolean(this.props.identities[standardAddress]):
        this.setState({
          customAddressError: this.context.t('personalAddressDetected'),
        })
        break

      case checkExistingAddresses(customAddress, this.props.tokens):
        this.setState({
          customAddressError: this.context.t('tokenAlreadyAdded'),
        })
        break

      default:
        if (customAddress !== emptyAddr) {
          this.attemptToAutoFillTokenParams(customAddress)
        }
    }
  }

  handleCustomSymbolChange(value) {
    const customSymbol = value.trim()
    const symbolLength = customSymbol.length
    let customSymbolError = null

    if (symbolLength <= 0 || symbolLength >= 12) {
      customSymbolError = this.context.t('symbolBetweenZeroTwelve')
    }

    this.setState({
      customSymbol,
      customSymbolError,
    })
  }

  handleCustomDecimalsChange(value) {
    let customDecimals
    let customDecimalsError = null

    if (value) {
      customDecimals = Number(value.trim())
      customDecimalsError =
        value < MIN_DECIMAL_VALUE || value > MAX_DECIMAL_VALUE
          ? this.context.t('decimalsMustZerotoTen')
          : null
    } else {
      customDecimals = ''
      customDecimalsError = this.context.t('tokenDecimalFetchFailed')
    }

    this.setState({
      customDecimals,
      customDecimalsError,
    })
  }

  renderCustomTokenForm() {
    const {
      customAddress,
      customSymbol,
      customDecimals,
      customAddressError,
      customSymbolError,
      customDecimalsError,
      forceEditSymbol,
      symbolAutoFilled,
      decimalAutoFilled,
    } = this.state
    const { chainId, rpcPrefs } = this.props
    const blockExplorerTokenLink = getTokenTrackerLink(
      customAddress,
      chainId,
      null,
      null,
      {
        blockExplorerUrl:
          rpcPrefs?.blockExplorerUrl ?? CHAINID_EXPLORE_MAP[chainId] ?? null,
      },
    )
    const blockExplorerLabel = rpcPrefs?.blockExplorerUrl
      ? new URL(blockExplorerTokenLink).hostname
      : this.context.t('etherscan')
    return (
      <div className='add-token__custom-token-form'>
        <TextField
          id='custom-address'
          label={this.context.t('tokenContractAddress')}
          type='text'
          value={customAddress}
          onChange={(e) => this.handleCustomAddressChange(e.target.value)}
          error={customAddressError}
        />
        <TextField
          id='custom-symbol'
          label={
            <div className='add-token__custom-symbol__label-wrapper'>
              <span className='add-token__custom-symbol__label'>
                {this.context.t('tokenSymbol')}
              </span>
              {symbolAutoFilled && !forceEditSymbol && (
                <div
                  className='add-token__custom-symbol__edit'
                  onClick={() =>
                    this.setState({
                      forceEditSymbol: true,
                    })
                  }
                ></div>
              )}
            </div>
          }
          type='text'
          value={customSymbol}
          onChange={(e) => this.handleCustomSymbolChange(e.target.value)}
          error={customSymbolError}
          disabled={symbolAutoFilled && !forceEditSymbol}
        />
        <TextField
          id='custom-decimals'
          label={this.context.t('decimal')}
          type='number'
          value={customDecimals}
          onChange={(e) => this.handleCustomDecimalsChange(e.target.value)}
          error={customDecimals ? customDecimalsError : null}
          disabled={decimalAutoFilled}
          min={MIN_DECIMAL_VALUE}
          max={MAX_DECIMAL_VALUE}
        />
        {customDecimals === '' && (
          <div className='custom-decimals-warning'>
            <div className='title'>
              {this.context.t('tokenDecimalFetchFailed')}
            </div>
            <p className='description'>
              {this.context.t('verifyThisTokenDecimalOn', [
                <a
                  key='add-token-verify-token-decimal'
                  className='add-token__link'
                  rel='noopener noreferrer'
                  target='_blank'
                  href={blockExplorerTokenLink}
                >
                  {blockExplorerLabel}
                </a>,
              ])}
            </p>
          </div>
        )}
      </div>
    )
  }

  renderSearchToken() {
    const { tokenSelectorError, selectedTokens, searchResults } = this.state
    const { chainId } = this.props
    return (
      <div className='add-token__search-token'>
        <TokenSearch
          chainId={toBnString(chainId)}
          onSearch={({ results = [] }) =>
            this.setState({
              searchResults: results,
            })
          }
          error={tokenSelectorError}
        />
        <div className='add-token__token-list'>
          <TokenList
            results={searchResults}
            selectedTokens={selectedTokens}
            onToggleToken={(token) => this.handleToggleToken(token)}
          />
        </div>
      </div>
    )
  }

  render() {
    const { history, clearPendingTokens, mostRecentOverviewPage } = this.props
    return (
      <div className='add-token-page dex-page-container base-width space-between'>
        <div className='add-token-top'>
          <TopHeader />
          <BackBar title={this.context.t('addTokens')} />
          <Tabs
            actived={this.state.activeTab}
            tabs={[
              {
                label: this.context.t('search'),
                key: 'search',
              },
              {
                label: this.context.t('customToken'),
                key: 'customToken',
              },
            ]}
            onChange={(activeTab) =>
              this.setState({
                activeTab,
              })
            }
          >
            {this.renderSearchToken()}
            {this.renderCustomTokenForm()}
          </Tabs>
        </div>
        <Button
          type='primary'
          onClick={this.handleNext}
          disabled={!this.hasSelected()}
        >
          {this.context.t(
            this.state.activeTab === 'search' ? 'addTokens' : 'addCustomTokens',
          )}
        </Button>
      </div>
    )
  }
}

export default AddToken
