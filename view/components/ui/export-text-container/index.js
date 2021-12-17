import { exportAsFile } from '@view/helpers/utils';
import { useCopyToClipboard } from '@view/hooks/useCopyToClipboard';
import { useI18nContext } from '@view/hooks/useI18nContext';
import { default as React, default as React } from 'react';

function ExportTextContainer({ text = '' }) {
  const t = useI18nContext();
  const [copied, handleCopy] = useCopyToClipboard();
  return (
    <div className="export-text-wrap">
      <div>{text}</div>
      <div>
        <div
          onClick={() => {
            handleCopy(text);
          }}
        >
          {copied ? t('copiedExclamation') : t('copyToClipboard')}
        </div>
        <div onClick={() => exportAsFile('', text)}>{t('saveAsCsvFile')}</div>
      </div>
    </div>
  );
}

export default React.memo(ExportTextContainer);
