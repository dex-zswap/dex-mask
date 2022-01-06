import React, { Component } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import TokenImage from '@c/ui/token-image'
import { checkExistingAddresses } from '@view/helpers/utils'
import TokenListPlaceholder from './token-list-placeholder'
export default class TokenList extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  render() {
    const {
      results = [],
      selectedTokens = {},
      onToggleToken,
      tokens = [],
    } = this.props
    return results.length === 0 ? (
      <TokenListPlaceholder />
    ) : (
      <div className='token-list'>
        <div className='token-list__title'>
          {this.context.t('searchResults')}
        </div>
        <div className='token-list__tokens-container'>
          {results.slice(0, 6).map((_, i) => {
            const { logo, symbol, name, address, chainId } = results[i] || {}
            const tokenAlreadyAdded = checkExistingAddresses(address, tokens)

            const onClick = () =>
              !tokenAlreadyAdded && onToggleToken(results[i])

            return (
              Boolean(logo || symbol || name) && (
                <div
                  className={classnames('token-list__token', {
                    'token-list__token--selected': selectedTokens[address],
                    'token-list__token--disabled': tokenAlreadyAdded,
                  })}
                  onClick={onClick}
                  onKeyPress={(event) => event.key === 'Enter' && onClick()}
                  key={i}
                  tabIndex='0'
                >
                  <div
                    className='token-list__token-icon'
                  >
                    <TokenImage address={address} chainId={chainId} size={32} />
                  </div>
                  <div className='token-list__token-data'>
                    <span className='token-list__token-name'>{`${name} (${symbol})`}</span>
                  </div>
                </div>
              )
            )
          })}
        </div>
      </div>
    )
  }
}
