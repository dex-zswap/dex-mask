import { ethErrors } from 'eth-rpc-errors';
import { NETWORK_TYPE_RPC } from '@shared/constants/network';
import {
  JUSTIFY_CONTENT,
  SEVERITIES,
  TYPOGRAPHY,
} from '@view/helpers/constants/design-system';
const PENDING_TX_DROP_NOTICE = {
  id: 'PENDING_TX_DROP_NOTICE',
  severity: SEVERITIES.WARNING,
  content: {
    element: 'span',
    children: {
      element: 'DexMaskTranslation',
      props: {
        translationKey: 'switchingNetworksCancelsPendingConfirmations',
      },
    },
  },
};

async function getAlerts() {
  return [PENDING_TX_DROP_NOTICE];
}

function getValues(pendingApproval, t, actions) {
  return {
    content: [
      {
        element: 'div',
        key: 'title',
        children: t('switchEthereumChainConfirmationTitle'),
        props: {
          align: 'center',
          fontWeight: 'bold',
          boxProps: {
            margin: [0, 0, 4],
          },
        },
      },
      {
        element: 'div',
        key: 'description',
        children: t('switchEthereumChainConfirmationDescription'),
        props: {
          align: 'center',
          boxProps: {
            margin: [0, 0, 4],
          },
        },
      },
      {
        element: 'div',
        key: 'status-box',
        props: {
          justifyContent: JUSTIFY_CONTENT.CENTER,
        },
        children: {
          element: 'NetworkDisplay',
          key: 'network-being-switched',
          props: {
            colored: false,
            outline: true,
            targetNetwork: {
              type: pendingApproval.requestData.type || NETWORK_TYPE_RPC,
              nickname: pendingApproval.requestData.nickname,
            },
          },
        },
      },
    ],
    approvalText: t('switchNetwork'),
    cancelText: t('cancel'),
    onApprove: () =>
      actions.resolvePendingApproval(
        pendingApproval.id,
        pendingApproval.requestData,
      ),
    onCancel: () =>
      actions.rejectPendingApproval(
        pendingApproval.id,
        ethErrors.provider.userRejectedRequest(),
      ),
  };
}

const switchEthereumChain = {
  getAlerts,
  getValues,
};
export default switchEthereumChain;
