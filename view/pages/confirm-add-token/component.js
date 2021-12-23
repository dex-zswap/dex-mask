import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@c/ui/button';
import TopHeader from '@c/ui/top-header';
import BackBar from '@c/ui/back-bar';
import TokenBalance from '@c/ui/token-balance';
import TokenImage from '@c/ui/token-image';
import { ADD_TOKEN_ROUTE, ASSET_ROUTE } from '@view/helpers/constants/routes';
export default class ConfirmAddToken extends Component {
  static contextTypes = {
    t: PropTypes.func,
  };

  componentDidMount() {
    const { mostRecentOverviewPage, pendingTokens = {}, history } = this.props;

    if (Object.keys(pendingTokens).length === 0) {
      history.push(mostRecentOverviewPage);
    }
  }

  render() {
    const {
      history,
      addTokens,
      clearPendingTokens,
      mostRecentOverviewPage,
      pendingTokens,
    } = this.props;
    const { t } = this.context;
    return (
      <div className="confirm-add-token dex-page-container base-width space-between">
        <div className="confirm-add-token-top">
          <TopHeader />
          <BackBar title={this.context.t('addTokens')} />
          <div className="page-container__subtitle">
            {this.context.t('likeToAddTokens')}
          </div>
          <div className="confirm-add-token__title flex space-between items-center">
            <div className="label">{t('token')}</div>
            <div className="label">{t('balance')}</div>
          </div>
          <div className="confirm-add-token__token-list">
            {Object.entries(pendingTokens).map(([address, token]) => {
              const { name, symbol, logo } = token;
              return (
                <div
                  className="confirm-add-token__token-list-item flex space-between items-center"
                  key={address}
                >
                  <div className="confirm-add-token__token flex items-center confirm-add-token__data">
                    {logo ? (
                      <div
                        className="token-image-origin"
                        style={{
                          backgroundImage: `url('images/contract/${logo}')`,
                        }}
                      ></div>
                    ) : (
                      <TokenImage symbol={symbol} size={32} address={address} />
                    )}
                    <div
                      style={{
                        marginLeft: '12px',
                      }}
                      className="confirm-add-token__name"
                    >
                      {symbol}
                    </div>
                  </div>
                  <div className="confirm-add-token__balance">
                    <TokenBalance token={token} hideSymbol />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="confirm-add-token-buttons flex space-between">
          <Button
            type="default"
            className="half-button"
            onClick={() => {
              clearPendingTokens();
              history.push(ADD_TOKEN_ROUTE);
            }}
          >
            {this.context.t('back')}
          </Button>
          <Button
            type="primary"
            className="half-button"
            onClick={() => {
              addTokens(pendingTokens).then(() => {
                const pendingTokenValues = Object.values(pendingTokens);
                clearPendingTokens();
                const firstTokenAddress = pendingTokenValues?.[0].address?.toLowerCase();

                if (firstTokenAddress) {
                  history.push(`${ASSET_ROUTE}/${firstTokenAddress}`);
                } else {
                  history.push(mostRecentOverviewPage);
                }
              });
            }}
          >
            {this.context.t('addTokens')}
          </Button>
        </div>
      </div>
    );
  }
}
