import { getEnvironmentType } from '@app/scripts/lib/util';
// Modal Components
import ConfirmCustomizeGasModal from '@c/app/gas-customization/gas-modal-page-container';
import SwapsGasCustomizationModal from '@pages/swaps/swaps-gas-customization-modal';
import { resetCustomData as resetCustomGasData } from '@reducer/gas/gas.duck';
import { ENVIRONMENT_TYPE_POPUP } from '@shared/constants/app';
import isMobileView from '@view/helpers/utils/is-mobile-view';
import * as actions from '@view/store/actions';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import AccountDetailsModal from './account-details-modal';
import AddToAddressBookModal from './add-to-addressbook-modal';
import CancelTransaction from './cancel-transaction';
import ConfirmDeleteNetwork from './confirm-delete-network';
import ConfirmRemoveAccount from './confirm-remove-account';
import ConfirmResetAccount from './confirm-reset-account';
import CustomizeNonceModal from './customize-nonce';
import DepositEtherModal from './deposit-ether-modal';
import EditApprovalPermission from './edit-approval-permission';
import ExportPrivateKeyModal from './export-private-key-modal';
import FadeModal from './fade-modal';
import HideTokenConfirmationModal from './hide-token-confirmation-modal';
import MetaMetricsOptInModal from './metametrics-opt-in-modal';
import NewAccountModal from './new-account-modal';
import QRScanner from './qr-scanner';
import RejectTransactions from './reject-transactions';
import TransactionConfirmed from './transaction-confirmed';

const modalContainerBaseStyle = {
  border: 'none',
  borderRadius: '8px',
  backgroundColor: 'rgba(20, 24, 39, 0.9)',
  boxShadow: 'none',
};

const modalContainerLaptopStyle = {
  ...modalContainerBaseStyle,
  width: '344px',
};

const modalContainerMobileStyle = {
  ...modalContainerBaseStyle,
  width: '92vw',
};

const accountModalStyle = {
  mobileModalStyle: {
    width: '92vw',
    // top: isPopupOrNotification() === 'popup' ? '52vh' : '36.5vh',
    boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 2px 2px',
    borderRadius: '4px',
    top: '10%',
    transform: 'none',
    left: '0',
    right: '0',
    margin: '0 auto',
  },
  laptopModalStyle: {
    width: '360px',
    // top: 'calc(33% + 45px)',
    boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 2px 2px',
    borderRadius: '4px',
    top: '10%',
    transform: 'none',
    left: '0',
    right: '0',
    margin: '0 auto',
  },
  contentStyle: {
    borderRadius: '4px',
  },
};

const MODALS = {
  DEPOSIT_ETHER: {
    contents: <DepositEtherModal />,
    onHide: (props) => props.hideWarning(),
    mobileModalStyle: {
      width: '100%',
      height: '100%',
      transform: 'none',
      left: '0',
      right: '0',
      margin: '0 auto',
      boxShadow: '0 0 7px 0 rgba(0,0,0,0.08)',
      top: '0',
      display: 'flex',
    },
    laptopModalStyle: {
      width: 'initial',
      maxWidth: '850px',
      top: 'calc(10% + 10px)',
      left: '0',
      right: '0',
      margin: '0 auto',
      boxShadow: '0 0 6px 0 rgba(0,0,0,0.3)',
      borderRadius: '7px',
      transform: 'none',
      height: 'calc(80% - 20px)',
      overflowY: 'hidden',
    },
    contentStyle: {
      borderRadius: '7px',
      height: '100%',
    },
  },

  ADD_TO_ADDRESSBOOK: {
    contents: <AddToAddressBookModal />,
    mobileModalStyle: {
      width: '92vw',
      top: '10%',
      boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 2px 2px',
      transform: 'none',
      left: '0',
      right: '0',
      margin: '0 auto',
      borderRadius: '10px',
    },
    laptopModalStyle: {
      width: '92vw',
      top: '10%',
      boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 2px 2px',
      transform: 'none',
      left: '0',
      right: '0',
      margin: '0 auto',
      borderRadius: '10px',
    },
    contentStyle: {
      borderRadius: '10px',
    },
  },

  NEW_ACCOUNT: {
    contents: <NewAccountModal />,
    mobileModalStyle: {
      width: '92vw',
      top: '10%',
      boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 2px 2px',
      transform: 'none',
      left: '0',
      right: '0',
      margin: '0 auto',
      borderRadius: '10px',
    },
    laptopModalStyle: {
      width: '92vw',
      top: '10%',
      boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 2px 2px',
      transform: 'none',
      left: '0',
      right: '0',
      margin: '0 auto',
      borderRadius: '10px',
    },
    contentStyle: {
      borderRadius: '10px',
    },
  },

  ACCOUNT_DETAILS: {
    contents: <AccountDetailsModal />,
    ...accountModalStyle,
  },

  EXPORT_PRIVATE_KEY: {
    contents: <ExportPrivateKeyModal />,
    ...accountModalStyle,
  },

  HIDE_TOKEN_CONFIRMATION: {
    contents: <HideTokenConfirmationModal />,
    mobileModalStyle: {
      width: '92vw',
      top: getEnvironmentType() === ENVIRONMENT_TYPE_POPUP ? '52vh' : '36.5vh',
    },
    laptopModalStyle: {
      width: '92vw',
      top: 'calc(33% + 45px)',
    },
  },

  METAMETRICS_OPT_IN_MODAL: {
    contents: <MetaMetricsOptInModal />,
    mobileModalStyle: {
      ...modalContainerMobileStyle,
      width: '100%',
      height: '100%',
      top: '0px',
    },
    laptopModalStyle: {
      ...modalContainerLaptopStyle,
      top: '10%',
    },
    contentStyle: {
      borderRadius: '8px',
    },
  },

  CONFIRM_RESET_ACCOUNT: {
    contents: <ConfirmResetAccount />,
    mobileModalStyle: {
      ...modalContainerMobileStyle,
    },
    laptopModalStyle: {
      ...modalContainerLaptopStyle,
    },
    contentStyle: {
      borderRadius: '8px',
    },
  },

  CONFIRM_REMOVE_ACCOUNT: {
    contents: <ConfirmRemoveAccount />,
    mobileModalStyle: {
      ...modalContainerMobileStyle,
    },
    laptopModalStyle: {
      ...modalContainerLaptopStyle,
    },
    contentStyle: {
      borderRadius: '8px',
    },
  },

  CONFIRM_DELETE_NETWORK: {
    contents: <ConfirmDeleteNetwork />,
    mobileModalStyle: {
      // ...modalContainerMobileStyle,
    },
    laptopModalStyle: {
      // ...modalContainerLaptopStyle,
    },
    contentStyle: {
      borderRadius: '8px',
    },
  },

  LEGACY_CUSTOMIZE_GAS: {
    contents: <ConfirmCustomizeGasModal />,
    mobileModalStyle: {
      width: '92vw',
      height: '90vh',
      top: '0',
      transform: 'none',
      left: '0',
      right: '0',
      margin: '0 auto',
    },
    laptopModalStyle: {
      width: 'auto',
      height: '0px',
      top: '80px',
      left: '0px',
      transform: 'none',
      margin: '0 auto',
      position: 'relative',
    },
    contentStyle: {
      borderRadius: '8px',
    },
    customOnHideOpts: {
      action: resetCustomGasData,
      args: [],
    },
  },

  CUSTOMIZE_METASWAP_GAS: {
    contents: <SwapsGasCustomizationModal />,
    mobileModalStyle: {
      width: '92vw',
      height: '90vh',
      top: '0',
      transform: 'none',
      left: '0',
      right: '0',
      margin: '0 auto',
    },
    laptopModalStyle: {
      width: 'auto',
      height: '0px',
      top: '80px',
      left: '0px',
      transform: 'none',
      margin: '0 auto',
      position: 'relative',
    },
    contentStyle: {
      borderRadius: '8px',
    },
  },

  EDIT_APPROVAL_PERMISSION: {
    contents: <EditApprovalPermission />,
    mobileModalStyle: {
      width: '95vw',
      height: '100vh',
      top: '50px',
      transform: 'none',
      left: '0',
      right: '0',
      margin: '0 auto',
    },
    laptopModalStyle: {
      width: 'auto',
      height: '0px',
      top: '80px',
      left: '0px',
      transform: 'none',
      margin: '0 auto',
      position: 'relative',
    },
    contentStyle: {
      borderRadius: '8px',
    },
  },

  TRANSACTION_CONFIRMED: {
    disableBackdropClick: true,
    contents: <TransactionConfirmed />,
    mobileModalStyle: {
      ...modalContainerMobileStyle,
    },
    laptopModalStyle: {
      ...modalContainerLaptopStyle,
    },
    contentStyle: {
      borderRadius: '8px',
    },
  },

  QR_SCANNER: {
    contents: <QRScanner />,
    mobileModalStyle: {
      ...modalContainerMobileStyle,
    },
    laptopModalStyle: {
      ...modalContainerLaptopStyle,
    },
    contentStyle: {
      borderRadius: '8px',
    },
  },

  CANCEL_TRANSACTION: {
    contents: <CancelTransaction />,
    mobileModalStyle: {
      ...modalContainerMobileStyle,
    },
    laptopModalStyle: {
      ...modalContainerLaptopStyle,
    },
    contentStyle: {
      borderRadius: '8px',
    },
  },

  REJECT_TRANSACTIONS: {
    contents: <RejectTransactions />,
    mobileModalStyle: {
      ...modalContainerMobileStyle,
    },
    laptopModalStyle: {
      ...modalContainerLaptopStyle,
    },
    contentStyle: {
      borderRadius: '8px',
    },
  },

  CUSTOMIZE_NONCE: {
    contents: <CustomizeNonceModal />,
    mobileModalStyle: {
      ...modalContainerMobileStyle,
    },
    laptopModalStyle: {
      ...modalContainerLaptopStyle,
    },
    contentStyle: {
      borderRadius: '8px',
    },
  },

  DEFAULT: {
    contents: [],
    mobileModalStyle: {},
    laptopModalStyle: {},
  },
};

const BACKDROPSTYLE = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
};

function mapStateToProps(state) {
  return {
    active: state.appState.modal.open,
    modalState: state.appState.modal.modalState,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideModal: (customOnHideOpts) => {
      dispatch(actions.hideModal());
      if (customOnHideOpts && customOnHideOpts.action) {
        dispatch(customOnHideOpts.action(...customOnHideOpts.args));
      }
    },
    hideWarning: () => {
      dispatch(actions.hideWarning());
    },
  };
}

class Modal extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    hideModal: PropTypes.func.isRequired,
    hideWarning: PropTypes.func.isRequired,
    modalState: PropTypes.object.isRequired,
  };

  hide() {
    this.modalRef.hide();
  }

  show() {
    this.modalRef.show();
  }

  UNSAFE_componentWillReceiveProps(nextProps, _) {
    if (nextProps.active) {
      this.show();
    } else if (this.props.active) {
      this.hide();
    }
  }

  render() {
    const modal = MODALS[this.props.modalState.name || 'DEFAULT'];
    const { contents: children, disableBackdropClick = false } = modal;
    const modalStyle =
      modal[isMobileView() ? 'mobileModalStyle' : 'laptopModalStyle'];
    const contentStyle = modal.contentStyle || {};

    return (
      <FadeModal
        keyboard={false}
        onHide={() => {
          if (modal.onHide) {
            modal.onHide({
              hideWarning: this.props.hideWarning,
            });
          }
          this.props.hideModal(modal.customOnHideOpts);
        }}
        ref={(ref) => {
          this.modalRef = ref;
        }}
        modalStyle={modalStyle}
        contentStyle={contentStyle}
        backdropStyle={BACKDROPSTYLE}
        closeOnClick={!disableBackdropClick}
      >
        {children}
      </FadeModal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
