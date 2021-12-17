import React from 'react';
import PropTypes from 'prop-types';
import { exportAsFile } from '@view/helpers/utils';
import { useCopyToClipboard } from '@view/hooks/useCopyToClipboard';
import { useI18nContext } from '@view/hooks/useI18nContext';

function ExportTextContainer({
  text = ''
}) {
  const t = useI18nContext();
  const [copied, handleCopy] = useCopyToClipboard();
  return <div className="export-text-container">
      <div className="export-text-container__text-container">
        <div className="export-text-container__text notranslate">{text}</div>
      </div>
      <div className="export-text-container__buttons-container">
        <div className="export-text-container__button export-text-container__button--copy" onClick={() => {
        handleCopy(text);
      }}>
          <div className="export-text-container__button-text">
            {copied ? t('copiedExclamation') : t('copyToClipboard')}
          </div>
        </div>
        <div className="export-text-container__button" onClick={() => exportAsFile('', text)}>
          <div className="export-text-container__button-text">
            {t('saveAsCsvFile')}
          </div>
        </div>
      </div>
    </div>;
}

ExportTextContainer.propTypes = {
  text: PropTypes.string
};
export default React.memo(ExportTextContainer);