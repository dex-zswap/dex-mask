import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Selector from '@c/ui/selector';
import Logo from '@c/ui/logo';
import BackBar from '@c/ui/back-bar';
import Button from '@c/ui/button';

import JsonImportView from './json';
import PrivateKeyImportView from './private-key';

export default class AccountImportSubview extends Component {
  static contextTypes = {
    t: PropTypes.func,
  };

  privateKeyImportRef = React.createRef();
  jsonImportRef = React.createRef();

  state = {
    type: 'privateKey'
  };

  renderImportView() {
    const { type } = this.state;

    switch (type) {
      case 'privateKey':
        return <PrivateKeyImportView ref={this.privateKeyImportRef} />;
      case 'jsonFile':
        return <JsonImportView ref={this.jsonImportRef} />;
      default:
        return <JsonImportView ref={this.jsonImportRef} />;
    }
  }

  shouldDisableImport() {
    const { type } = this.state;

    switch (type) {
      case 'privateKey':
        return this.privateKeyImportRef.current?.shouldDisableImport?.();
      case 'jsonFile':
        return this.jsonImportRef.current?.shouldDisableImport?.();
    }
  }

  importAccount = () => {
    const { type } = this.state;

    switch (type) {
      case 'privateKey':
        return this.privateKeyImportRef.current?.createNewKeychain?.();
      case 'jsonFile':
        return this.jsonImportRef.current?.createNewKeychain?.();
    }
  }

  render() {
    const { type } = this.state;
    return (
      <div className="new-account-import-form dex-page-container space-between base-width">
        <div>
          <Logo plain isCenter />
          <BackBar title={this.context.t('createAccount')} />
          <div className="new-account-import-form__select-section flex items-center space-between">
            <div className="new-account-import-form__select-label">
              {this.context.t('selectType')}
            </div>
            <Selector
              className="select-import-type"
              selectedValue={type}
              options={[
                {
                  value: 'privateKey',
                  label: this.context.t('privateKey')
                },
                {
                  value: 'jsonFile',
                  label: this.context.t('jsonFile')
                }
              ]}
              onSelect={(type) => {
                this.setState({
                  type
                });
              }}
            />
          </div>
          {this.renderImportView()}
        </div>
        <div className="new-account-import-form flex space-between">
          <Button
            className="half-button"
          >
            {this.context.t('pre')}
          </Button>
          <Button
            type="primary"
            className="half-button"
            disabled={this.shouldDisableImport()}
            onClick={this.importAccount}
          >
            {this.context.t('import')}
          </Button>
        </div>
      </div>
    );
  }
}
