import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SiteIcon from '@c/ui/site-icon'
import { stripHttpSchemes } from '@view/helpers/utils'
export default class ConnectedSitesList extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  render() {
    const { connectedDomains, onDisconnect } = this.props
    const { t } = this.context
    return (
      <main className='connected-sites-list__content-rows'>
        {connectedDomains.map((domain) => (
          <div
            key={domain.origin}
            className='connected-sites-list__content-row'
          >
            <div className='connected-sites-list__domain-info'>
              <SiteIcon icon={domain.icon} name={domain.name} size={28} />
              <span
                className='connected-sites-list__domain-name'
                title={domain.extensionId || domain.origin}
              >
                {this.getDomainDisplayName(domain)}
              </span>
            </div>
            <i
              className='fas fa-trash-alt connected-sites-list__trash'
              title={t('disconnect')}
              onClick={() => onDisconnect(domain.origin)}
            />
          </div>
        ))}
      </main>
    )
  }

  getDomainDisplayName(domain) {
    if (domain.extensionId) {
      return this.context.t('externalExtension')
    }

    return this.props.domainHostCount[domain.host] > 1
      ? domain.origin
      : stripHttpSchemes(domain.origin)
  }
}
