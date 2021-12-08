import Button from '@c/ui/button';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

export default class SignatureRequestFooter extends PureComponent {
  static propTypes = {
    cancelAction: PropTypes.func.isRequired,
    signAction: PropTypes.func.isRequired,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  render() {
    const { cancelAction, signAction } = this.props;
    return (
      <div className="signature-request-footer">
        <Button onClick={cancelAction} type="default" large>
          {this.context.t('cancel')}
        </Button>
        <Button onClick={signAction} type="primary" large>
          {this.context.t('sign')}
        </Button>
      </div>
    );
  }
}
