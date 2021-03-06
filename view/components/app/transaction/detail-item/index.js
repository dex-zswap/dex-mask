import Typography from '@c/ui/typography';
import {
  COLORS,
  FONT_WEIGHT,
  TYPOGRAPHY,
} from '@view/helpers/constants/design-system';
import PropTypes from 'prop-types';
import React from 'react';

export default function TransactionDetailItem({
  detailTitle = '',
  detailText = '',
  detailTitleColor = COLORS.BLACK,
  detailTotal = '',
  subTitle = '',
  subText = '',
}) {
  return (
    <div className="transaction-detail-item">
      <div className="transaction-detail-item__row">
        <Typography
          color={detailTitleColor}
          fontWeight={FONT_WEIGHT.BOLD}
          variant={TYPOGRAPHY.H6}
          className="transaction-detail-item__title"
        >
          {detailTitle}
        </Typography>
        <Typography
          color={COLORS.BLACK}
          fontWeight={FONT_WEIGHT.BOLD}
          variant={TYPOGRAPHY.H6}
          className="transaction-detail-item__total"
        >
          {detailTotal}
        </Typography>
      </div>
      {detailText && (
        <div style={{ textAlign: 'right' }}>
          <Typography
            variant={TYPOGRAPHY.H6}
            className="transaction-detail-item__detail-text"
            color={COLORS.UI4}
          >
            {detailText}
          </Typography>
        </div>
      )}
      <div className="transaction-detail-item__row justify-end">
        {/* {React.isValidElement(subTitle) ? (
          <div className="transaction-detail-item__subtitle">{subTitle}</div>
        ) : (
          <Typography
            variant={TYPOGRAPHY.H7}
            className="transaction-detail-item__subtitle"
            color={COLORS.UI4}
          >
            {subTitle}
          </Typography>
        )} */}

        <Typography
          variant={TYPOGRAPHY.H7}
          color={COLORS.UI4}
          className="transaction-detail-item__subtext"
        >
          {subText}
        </Typography>
      </div>
    </div>
  );
}

TransactionDetailItem.propTypes = {
  detailTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  detailTitleColor: PropTypes.string,
  detailText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  detailTotal: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  subTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  subText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};
