import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@c/ui/button';
import TokenBalance from '@c/ui/token-balance';
import TokenImage from '@c/ui/token-image';
import { ADD_TOKEN_ROUTE, ASSET_ROUTE } from '@view/helpers/constants/routes';
export default class ConfirmAddToken extends Component {
  static contextTypes = {
    t: PropTypes.func
  };
  static propTypes = {
    history: PropTypes.object,
    clearPendingTokens: PropTypes.func,
    addTokens: PropTypes.func,
    mostRecentOverviewPage: PropTypes.string.isRequired,
    pendingTokens: PropTypes.object
  };

  componentDidMount() {
    const {
      mostRecentOverviewPage,
      pendingTokens = {},
      history
    } = this.props;

    if (Object.keys(pendingTokens).length === 0) {
      history.push(mostRecentOverviewPage);
    }
  }

  getTokenName(name, symbol) {
    return typeof name === 'undefined' ? symbol : `${name} (${symbol})`;
  }

  render() {
    const {
      history,
      addTokens,
      clearPendingTokens,
      mostRecentOverviewPage,
      pendingTokens
    } = this.props;
    return <div className="page-container">
        <div className="page-container__header">
          <div className="page-container__title">
            {this.context.t('addTokens')}
          </div>
          <div className="page-container__subtitle">
            {this.context.t('likeToAddTokens')}
          </div>
        </div>
        <div className="page-container__content">
          <div className="confirm-add-token">
            <div className="confirm-add-token__header">
              <div className="confirm-add-token__token">
                {this.context.t('token')}
              </div>
              <div className="confirm-add-token__balance">
                {this.context.t('balance')}
              </div>
            </div>
            <div className="confirm-add-token__token-list">
              {Object.entries(pendingTokens).map(([address, token]) => {
              const {
                name,
                symbol
              } = token;
              return <div className="confirm-add-token__token-list-item" key={address}>
                    <div className="confirm-add-token__token confirm-add-token__data">
                      <TokenImage symbol={symbol} size={40} address={address} />
                      <div style={{
                    marginLeft: '12px'
                  }} className="confirm-add-token__name">
                        {this.getTokenName(name, symbol)}
                      </div>
                    </div>
                    <div className="confirm-add-token__balance">
                      <TokenBalance token={token} />
                    </div>
                  </div>;
            })}
            </div>
          </div>
        </div>
        <div className="page-container__footer">
          <footer>
            <Button type="default" className="page-container__footer-button" onClick={() => history.push(ADD_TOKEN_ROUTE)}>
              {this.context.t('back')}
            </Button>
            <Button type="primary" className="page-container__footer-button" onClick={() => {
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
          }}>
              {this.context.t('addTokens')}
            </Button>
          </footer>
        </div>
      </div>;
  }

}