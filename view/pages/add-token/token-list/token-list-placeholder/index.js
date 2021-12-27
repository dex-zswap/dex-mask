import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '@c/ui/button'
export default class TokenListPlaceholder extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  render() {
    return (
      <div className='token-list-placeholder'>
        <div className='token-list-placeholder__text'>
          {this.context.t('addAcquiredTokens')}
        </div>
      </div>
    )
  }
}
