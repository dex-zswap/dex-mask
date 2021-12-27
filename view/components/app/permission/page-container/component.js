import React, { Component } from 'react'
import { isEqual } from 'lodash'
import PropTypes from 'prop-types'
import PermissionsConnectFooter from '@c/app/permission/connect-footer'
import Button from '@c/ui/button'
import { PermissionPageContainerContent } from '.'
export default class PermissionPageContainer extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }
  state = {
    selectedPermissions: this.getRequestedMethodState(
      this.getRequestedMethodNames(this.props),
    ),
  }

  componentDidUpdate() {
    const newMethodNames = this.getRequestedMethodNames(this.props)

    if (!isEqual(Object.keys(this.state.selectedPermissions), newMethodNames)) {
      // this should be a new request, so just overwrite
      this.setState({
        selectedPermissions: this.getRequestedMethodState(newMethodNames),
      })
    }
  }

  getRequestedMethodState(methodNames) {
    return methodNames.reduce((acc, methodName) => {
      acc[methodName] = true
      return acc
    }, {})
  }

  getRequestedMethodNames(props) {
    return Object.keys(props.request.permissions || {})
  }

  onPermissionToggle = (methodName) => {
    this.setState({
      selectedPermissions: {
        ...this.state.selectedPermissions,
        [methodName]: !this.state.selectedPermissions[methodName],
      },
    })
  }
  onCancel = () => {
    const { request, rejectPermissionsRequest } = this.props
    rejectPermissionsRequest(request.metadata.id)
  }
  onSubmit = () => {
    const {
      request: _request,
      approvePermissionsRequest,
      rejectPermissionsRequest,
      selectedIdentities,
    } = this.props
    const request = { ..._request, permissions: { ..._request.permissions } }
    Object.keys(this.state.selectedPermissions).forEach((key) => {
      if (!this.state.selectedPermissions[key]) {
        delete request.permissions[key]
      }
    })

    if (Object.keys(request.permissions).length > 0) {
      approvePermissionsRequest(
        request,
        selectedIdentities.map((selectedIdentity) => selectedIdentity.address),
      )
    } else {
      rejectPermissionsRequest(request.metadata.id)
    }
  }

  render() {
    const {
      requestMetadata,
      targetDomainMetadata,
      selectedIdentities,
      allIdentitiesSelected,
    } = this.props
    return (
      <div className='permission-approval-container dex-page-container space-between base-width'>
        <PermissionPageContainerContent
          requestMetadata={requestMetadata}
          domainMetadata={targetDomainMetadata}
          selectedPermissions={this.state.selectedPermissions}
          onPermissionToggle={this.onPermissionToggle}
          selectedIdentities={selectedIdentities}
          allIdentitiesSelected={allIdentitiesSelected}
        />
        <div className='permission-approval-container__footers'>
          <PermissionsConnectFooter />
          <div className='permission-approval-container__footers-buttons flex space-between'>
            <Button className='half-button' onClick={() => this.onCancel()}>
              {this.context.t('cancel')}
            </Button>
            <Button
              type='primary'
              className='half-button'
              onClick={() => this.onSubmit()}
            >
              {this.context.t('connect')}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
