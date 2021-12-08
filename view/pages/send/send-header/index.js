import PageContainerHeader from '@c/ui/page-container/page-container-header';
import { getMostRecentOverviewPage } from '@reducer/history/history';
import {
  ASSET_TYPES,
  getSendAsset,
  getSendStage,
  resetSendState,
  SEND_STAGES,
} from '@reducer/send';
import { useI18nContext } from '@view/hooks/useI18nContext';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

export default function SendHeader() {
  const history = useHistory();
  const mostRecentOverviewPage = useSelector(getMostRecentOverviewPage);
  const dispatch = useDispatch();
  const stage = useSelector(getSendStage);
  const asset = useSelector(getSendAsset);
  const t = useI18nContext();

  const onClose = () => {
    dispatch(resetSendState());
    history.push(mostRecentOverviewPage);
  };

  let title = asset.type === ASSET_TYPES.NATIVE ? t('send') : t('sendTokens');

  if (stage === SEND_STAGES.ADD_RECIPIENT || stage === SEND_STAGES.INACTIVE) {
    title = t('addRecipient');
  } else if (stage === SEND_STAGES.EDIT) {
    title = t('edit');
  }

  if (stage === SEND_STAGES.DRAFT) {
    return null;
  }

  return (
    <PageContainerHeader
      className="send__header"
      onClose={onClose}
      title={title}
      headerCloseText={t('cancel')}
    />
  );
}
