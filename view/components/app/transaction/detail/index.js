import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import TransactionDetailItem from '@c/app/transaction/detail-item'
import { I18nContext } from '@view/contexts/i18n'
export default function TransactionDetail({ rows = [] }) {
  const t = useContext(I18nContext)
  return (
    <div className='transaction-detail'>
      {/* {onEdit && (
      <div className='transaction-detail-edit'>
      <img
      style={{
       cursor: 'pointer',
      }}
      width='12px'
      src='images/dex/edit.png'
      onClick={onEdit}
      />
      </div>
      )} */}
      <div className='transaction-detail-rows'>{rows}</div>
    </div>
  )
}
TransactionDetail.propTypes = {
  rows: PropTypes.arrayOf(TransactionDetailItem).isRequired,
  onEdit: PropTypes.func,
}
