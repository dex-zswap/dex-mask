import React, { Component } from 'react'
import PropTypes from 'prop-types'
import GasPriceButtonGroup from '@c/app/gas-customization/gas-price-button-group'
import Loading from '@c/ui/loading-screen'
export default class BasicTabContent extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }
  static propTypes = {
    gasPriceButtonGroupProps: PropTypes.object,
  }

  render() {
    const { t } = this.context
    const { gasPriceButtonGroupProps } = this.props
    return (
      <div className='basic-tab-content'>
        <div className='basic-tab-content__title'>
          {t('estimatedProcessingTimes')}
        </div>
        <div className='basic-tab-content__blurb'>
          {t('selectAHigherGasFee')}
        </div>
        {gasPriceButtonGroupProps.loading ? (
          <Loading />
        ) : (
          <GasPriceButtonGroup
            className='gas-price-button-group--alt'
            showCheck
            {...gasPriceButtonGroupProps}
          />
        )}
        <div className='basic-tab-content__footer-blurb'>
          {t('acceleratingATransaction')}
        </div>
      </div>
    )
  }
}
