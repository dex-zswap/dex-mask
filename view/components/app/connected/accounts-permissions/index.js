import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import CheckBox from '@c/ui/check-box'
export default class ConnectedAccountsPermissions extends PureComponent {
  static contextTypes = {
    t: PropTypes.func.isRequired,
  }
  static defaultProps = {
    permissions: [],
  }
  state = {
    expanded: true,
  }
  toggleExpanded = () => {
    this.setState((prevState) => ({
      expanded: !prevState.expanded,
    }))
  }

  render() {
    const { permissions } = this.props
    const { t } = this.context
    const { expanded } = this.state

    if (permissions.length === 0) {
      return null
    }

    return (
      <div className='connected-accounts-permissions'>
        <p className='connected-accounts-permissions__header'>
          <p>{t('permissions')}</p>
        </p>
        <div className='connected-accounts-permissions__list-container'>
          <p className='description'>{t('authorizedPermissions')}:</p>
          <ul className='connected-accounts-permissions__list'>
            {permissions.map(({ key: permissionName }) => (
              <li
                key={permissionName}
                className='connected-accounts-permissions__list-item'
              >
                <CheckBox
                  checked
                  disabled
                  id={permissionName}
                  className='connected-accounts-permissions__checkbox'
                />
                <label className='description-label' htmlFor={permissionName}>
                  {t(permissionName)}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}
