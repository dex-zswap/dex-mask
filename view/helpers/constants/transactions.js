import {
  TRANSACTION_TYPES,
  TRANSACTION_STATUSES,
} from '@shared/constants/transaction';
export const PENDING_STATUS_HASH = {
  [TRANSACTION_STATUSES.UNAPPROVED]: true,
  [TRANSACTION_STATUSES.APPROVED]: true,
  [TRANSACTION_STATUSES.SUBMITTED]: true,
};
export const PRIORITY_STATUS_HASH = {
  ...PENDING_STATUS_HASH,
  [TRANSACTION_STATUSES.CONFIRMED]: true,
};
export const TOKEN_CATEGORY_HASH = {
  [TRANSACTION_TYPES.TOKEN_METHOD_APPROVE]: true,
  [TRANSACTION_TYPES.TOKEN_METHOD_TRANSFER]: true,
  [TRANSACTION_TYPES.TOKEN_METHOD_TRANSFER_FROM]: true,
};
