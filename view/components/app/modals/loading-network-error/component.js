import Modal, { ModalContent } from '@c/app/modal';
import PropTypes from 'prop-types';
import React from 'react';

const LoadingNetworkError = (props, context) => {
  const { t } = context;
  const { hideModal } = props;

  return (
    <Modal onSubmit={() => hideModal()} submitText={t('tryAgain')}>
      <ModalContent description={t('somethingWentWrong')} />
    </Modal>
  );
};

LoadingNetworkError.contextTypes = {
  t: PropTypes.func,
};

LoadingNetworkError.propTypes = {
  hideModal: PropTypes.func,
};

export default LoadingNetworkError;
