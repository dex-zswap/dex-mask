import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '@c/ui/button';
import Copy from '@c/ui/icon/copy-icon.component';
import Identicon from '@c/ui/identicon';
import Tooltip from '@c/ui/tooltip';
import { useCopyToClipboard } from '@view/hooks/useCopyToClipboard';
import { useI18nContext } from '@view/hooks/useI18nContext';

function quadSplit(address) {
  return `0x ${address.slice(2).match(/.{1,4}/gu).join(' ')}`;
}

function ViewContact({
  history,
  name,
  address,
  checkSummedAddress,
  memo,
  editRoute,
  listRoute
}) {
  const t = useI18nContext();
  const [copied, handleCopy] = useCopyToClipboard();

  if (!address) {
    return <Redirect to={{
      pathname: listRoute
    }} />;
  }

  return <div className="settings-page__content-row">
      <div className="settings-page__content-item">
        <div className="settings-page__header address-book__header">
          <Identicon address={address} diameter={60} />
          <div className="address-book__header__name">{name}</div>
        </div>
        <div className="address-book__view-contact__group">
          <Button type="secondary" onClick={() => {
          history.push(`${editRoute}/${address}`);
        }}>
            {t('edit')}
          </Button>
        </div>
        <div className="address-book__view-contact__group">
          <div className="address-book__view-contact__group__label">
            {t('ethereumPublicAddress')}
          </div>
          <div className="address-book__view-contact__group__value">
            <div className="address-book__view-contact__group__static-address">
              {quadSplit(checkSummedAddress)}
            </div>
            <Tooltip position="bottom" title={copied ? t('copiedExclamation') : t('copyToClipboard')}>
              <button className="address-book__view-contact__group__static-address--copy-icon" onClick={() => {
              handleCopy(checkSummedAddress);
            }}>
                <Copy size={20} color="#3098DC" />
              </button>
            </Tooltip>
          </div>
        </div>
        <div className="address-book__view-contact__group">
          <div className="address-book__view-contact__group__label--capitalized">
            {t('memo')}
          </div>
          <div className="address-book__view-contact__group__static-address">
            {memo}
          </div>
        </div>
      </div>
    </div>;
}

ViewContact.propTypes = {
  name: PropTypes.string,
  address: PropTypes.string,
  history: PropTypes.object,
  checkSummedAddress: PropTypes.string,
  memo: PropTypes.string,
  editRoute: PropTypes.string,
  listRoute: PropTypes.string.isRequired
};
export default React.memo(ViewContact);