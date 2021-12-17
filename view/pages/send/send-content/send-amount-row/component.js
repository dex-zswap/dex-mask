import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserPreferencedCurrencyInput from '@c/app/user-preferenced/currency-input';
import UserPreferencedTokenInput from '@c/app/user-preferenced/token-input';
import SendRowWrapper from '@pages/send/send-content/send-row-wrapper';
import { ASSET_TYPES } from '@reducer/send';
import AmountMaxButton from './amount-max-button';
export default class SendAmountRow extends Component {
  static propTypes = {
    amount: PropTypes.string,
    inError: PropTypes.bool,
    asset: PropTypes.object,
    updateSendAmount: PropTypes.func,
  };
  static contextTypes = {
    t: PropTypes.func,
  };
  handleChange = (newAmount) => {
    this.props.updateSendAmount(newAmount);
  };

  renderInput() {
    const { amount, inError, asset } = this.props;
    return asset.type === ASSET_TYPES.TOKEN ? (
      <UserPreferencedTokenInput
        error={inError}
        onChange={this.handleChange}
        token={asset.details}
        value={amount}
      />
    ) : (
      <UserPreferencedCurrencyInput
        error={inError}
        onChange={this.handleChange}
        value={amount}
      />
    );
  }

  render() {
    const { inError } = this.props;
    return (
      <div className="send-amount-row">
        <SendRowWrapper>
          <>
            <div className="send-amount-row__amount-label">
              {this.context.t('inputAmount')}
            </div>
            {this.renderInput()}
            <AmountMaxButton inError={inError} />
          </>
        </SendRowWrapper>
      </div>
    );
  }
}
