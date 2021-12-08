import { getEnvironmentType } from '@app/scripts/lib/util';
import Identicon from '@c/ui/identicon';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { ENVIRONMENT_TYPE_NOTIFICATION } from './constants';
import Footer from './signature-request-footer';
import Header from './signature-request-header';
import Message from './signature-request-message';

export default class SignatureRequest extends PureComponent {
  static propTypes = {
    txData: PropTypes.object.isRequired,
    fromAccount: PropTypes.shape({
      address: PropTypes.string.isRequired,
      balance: PropTypes.string,
      name: PropTypes.string,
    }).isRequired,

    clearConfirmTransaction: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    sign: PropTypes.func.isRequired,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  componentDidMount() {
    if (getEnvironmentType() === ENVIRONMENT_TYPE_NOTIFICATION) {
      window.addEventListener('beforeunload', this._beforeUnload);
    }
  }

  _beforeUnload = (event) => {
    const { clearConfirmTransaction, cancel } = this.props;
    clearConfirmTransaction();
    cancel(event);
  };

  formatWallet(wallet) {
    return `${wallet.slice(0, 8)}...${wallet.slice(
      wallet.length - 8,
      wallet.length,
    )}`;
  }

  render() {
    const {
      fromAccount,
      txData: {
        msgParams: { data, origin },
      },
      cancel,
      sign,
    } = this.props;
    const { address: fromAddress } = fromAccount;
    const { message, domain = {} } = JSON.parse(data);

    const onSign = (event) => {
      window.removeEventListener('beforeunload', this._beforeUnload);
      sign(event);
    };

    const onCancel = (event) => {
      window.removeEventListener('beforeunload', this._beforeUnload);
      cancel(event);
    };

    return (
      <div className="signature-request page-container">
        <Header fromAccount={fromAccount} />
        <div className="signature-request-content">
          <div className="signature-request-content__title">
            {this.context.t('sigRequest')}
          </div>
          <div className="signature-request-content__identicon-container">
            <div className="signature-request-content__identicon-initial">
              {domain.name && domain.name[0]}
            </div>
            <div className="signature-request-content__identicon-border" />
            <Identicon address={fromAddress} diameter={70} />
          </div>
          <div className="signature-request-content__info--bolded">
            {domain.name}
          </div>
          <div className="signature-request-content__info">{origin}</div>
          <div className="signature-request-content__info">
            {this.formatWallet(fromAddress)}
          </div>
        </div>
        <Message data={message} />
        <Footer cancelAction={onCancel} signAction={onSign} />
      </div>
    );
  }
}
