import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Selector from '@c/ui/selector'
import Logo from '@c/ui/logo'
import BackBar from '@c/ui/back-bar'
import Button from '@c/ui/button'
import JsonImportView from './json'
import PrivateKeyImportView from './private-key'
export default class AccountImportSubview extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }
  state = {
    type: 'privateKey',
  }

  renderImportView() {
    const { type } = this.state

    switch (type) {
      case 'privateKey':
        return <PrivateKeyImportView />

      case 'jsonFile':
        return <JsonImportView />

      default:
        return <PrivateKeyImportView />
    }
  }

  render() {
    const { type } = this.state
    return (
      <div className='new-account-import-form dex-page-container space-between base-width'>
        <div>
          <Logo plain isCenter />
          <BackBar title={this.context.t('importAccountTitle')} />
          {/* <div className='new-account-import-form__select-section flex items-center space-between'>
            <div className='new-account-import-form__select-label'>
              {this.context.t('selectType')}
            </div>
            <Selector
              className='select-import-type'
              selectedValue={type}
              options={[
                {
                  value: 'privateKey',
                  label: this.context.t('privateKey'),
                },
                {
                  value: 'jsonFile',
                  label: this.context.t('jsonFile'),
                },
              ]}
              onSelect={(type) => {
                this.setState({
                  type,
                })
              }}
            />
          </div> */}
        </div>
        <div className='new-account-import-bottom'>
          <PrivateKeyImportView />
          {/* {this.renderImportView()} */}
        </div>
      </div>
    )
  }
}
