import React from 'react'
import PropTypes from 'prop-types'
export default function TransactionTotalBanner({
  total = '',
  detail = '',
  timing,
}) {
  return (
    <div className='transaction-total-banner'>
      <div className='transaction-total-banner_title'>{total}</div>
      {/* <Typography color={COLORS.BLACK} variant={TYPOGRAPHY.H1}>
      {total}
      </Typography> */}
      {
        detail && (
          <div className='transaction-total-banner__detail'>{detail}</div>
        ) // <Typography
        //   color={COLORS.WHITE}
        //   variant={TYPOGRAPHY.H6}
        //   className="transaction-total-banner__detail"
        // >
        //   {detail}
        // </Typography>
      }
      {timing}
    </div>
  )
}
TransactionTotalBanner.propTypes = {
  total: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  detail: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  timing: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}
