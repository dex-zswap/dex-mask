import PageContainerFooter from '@c/ui/page-container/page-container-footer';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class MetaMetricsOptIn extends Component {
  static propTypes = {
    history: PropTypes.object,
    setParticipateInMetaMetrics: PropTypes.func,
    nextRoute: PropTypes.string,
    firstTimeSelectionMetaMetricsName: PropTypes.string,
    participateInMetaMetrics: PropTypes.bool,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  render() {
    const { t } = this.context;
    const {
      nextRoute,
      history,
      setParticipateInMetaMetrics,
      firstTimeSelectionMetaMetricsName,
      participateInMetaMetrics,
    } = this.props;

    return (
      <div className="metametrics-opt-in">
        <div className="metametrics-opt-in__main">
          <MetaFoxLogo />
          <div className="metametrics-opt-in__body-graphic">
            <img src="images/metrics-chart.svg" alt="" />
          </div>
          <div className="metametrics-opt-in__title">
            {t('metametricsHelpImproveMetaMask')}
          </div>
          <div className="metametrics-opt-in__body">
            <div className="metametrics-opt-in__description">
              {t('metametricsOptInDescription')}
            </div>
            <div className="metametrics-opt-in__description">
              {t('metametricsCommitmentsIntro')}
            </div>

            <div className="metametrics-opt-in__committments">
              <div className="metametrics-opt-in__row">
                <i className="fa fa-check" />
                <div className="metametrics-opt-in__row-description">
                  {t('metametricsCommitmentsAllowOptOut')}
                </div>
              </div>
              <div className="metametrics-opt-in__row">
                <i className="fa fa-check" />
                <div className="metametrics-opt-in__row-description">
                  {t('metametricsCommitmentsSendAnonymizedEvents')}
                </div>
              </div>
              <div className="metametrics-opt-in__row metametrics-opt-in__break-row">
                <i className="fa fa-times" />
                <div className="metametrics-opt-in__row-description">
                  {t('metametricsCommitmentsNeverCollectKeysEtc', [
                    <span
                      className="metametrics-opt-in__bold"
                      key="neverCollectKeys"
                    >
                      {t('metametricsCommitmentsBoldNever')}
                    </span>,
                  ])}
                </div>
              </div>
              <div className="metametrics-opt-in__row">
                <i className="fa fa-times" />
                <div className="metametrics-opt-in__row-description">
                  {t('metametricsCommitmentsNeverCollectIP', [
                    <span
                      className="metametrics-opt-in__bold"
                      key="neverCollectIP"
                    >
                      {t('metametricsCommitmentsBoldNever')}
                    </span>,
                  ])}
                </div>
              </div>
              <div className="metametrics-opt-in__row">
                <i className="fa fa-times" />
                <div className="metametrics-opt-in__row-description">
                  {t('metametricsCommitmentsNeverSellDataForProfit', [
                    <span
                      className="metametrics-opt-in__bold"
                      key="neverSellData"
                    >
                      {t('metametricsCommitmentsBoldNever')}
                    </span>,
                  ])}
                </div>
              </div>
            </div>
          </div>
          <div className="metametrics-opt-in__footer">
            <PageContainerFooter
              onCancel={async () => {
                await setParticipateInMetaMetrics(false);
                history.push(nextRoute);
              }}
              cancelText={t('noThanks')}
              hideCancel={false}
              onSubmit={() => {
                history.push(nextRoute);
              }}
              submitText={t('affirmAgree')}
              submitButtonType="primary"
              disabled={false}
            />
            <div className="metametrics-opt-in__bottom-text">
              {t('gdprMessage', [
                <a
                  key="metametrics-bottom-text-wrapper"
                  href="https://metamask.io/privacy.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('gdprMessagePrivacyPolicy')}
                </a>,
              ])}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
