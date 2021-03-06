import Modal, { ModalContent } from '@c/app/modal';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

export default class ConfirmDeleteNetwork extends PureComponent {
  static propTypes = {
    hideModal: PropTypes.func.isRequired,
    delRpcTarget: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    target: PropTypes.string.isRequired,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  handleDelete = () => {
    this.props.delRpcTarget(this.props.target).then(() => {
      this.props.onConfirm();
      this.props.hideModal();
    });
  };

  render() {
    const { t } = this.context;

    return (
      <>
        <div
          className="confirm-delete-network__mask"
          onClick={this.props.onConfirm}
        ></div>
        <Modal
          containerClass="confirm-delete-network__modal"
          onSubmit={this.handleDelete}
          onCancel={() => this.props.hideModal()}
          submitText={t('delete')}
          cancelText={t('cancel')}
          submitType="primary"
        >
          <ModalContent
            title={t('deleteNetwork')}
            description={t('deleteNetworkDescription')}
          />
        </Modal>
      </>
    );
  }
}
