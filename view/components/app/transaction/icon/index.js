import React from 'react';
import classnames from 'classnames';

export default function TransactionIcon({ category }) {
  return (
    <div className={classnames('transaction-icon', category)}></div>
  );
}