import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ActionableMessage from '@c/ui/actionable-message/actionable-message';
import Box from '@c/ui/box';
import Button from '@c/ui/button';
import Popover from '@c/ui/popover';
import Typography from '@c/ui/typography';
import UrlIcon from '@c/ui/url-icon';
import { I18nContext } from '@view/contexts/i18n';
import { ALIGN_ITEMS, DISPLAY, FONT_WEIGHT, TYPOGRAPHY } from '@view/helpers/constants/design-system';
export default function ImportToken({
  onImportTokenCloseClick,
  onImportTokenClick,
  setIsImportTokenModalOpen,
  tokenForImport
}) {
  const t = useContext(I18nContext);
  const ImportTokenModalFooter = <>
      <Button type="secondary" className="page-container__footer-button" onClick={onImportTokenCloseClick} rounded>
        {t('cancel')}
      </Button>
      <Button type="confirm" className="page-container__footer-button" onClick={onImportTokenClick} rounded>
        {t('import')}
      </Button>
    </>;
  return <Popover title={t('importTokenQuestion')} onClose={() => setIsImportTokenModalOpen(false)} footer={ImportTokenModalFooter}>
      <Box padding={[0, 6, 4, 6]} alignItems={ALIGN_ITEMS.CENTER} display={DISPLAY.FLEX} className="import-token">
        <ActionableMessage type="danger" message={t('importTokenWarning')} />
        <UrlIcon url={tokenForImport.iconUrl} className="import-token__token-icon" fallbackClassName="import-token__token-icon" name={tokenForImport.symbol} />
        <Typography ariant={TYPOGRAPHY.H4} fontWeight={FONT_WEIGHT.BOLD} boxProps={{
        marginTop: 2,
        marginBottom: 3
      }}>
          {tokenForImport.name}
        </Typography>
        <Typography variant={TYPOGRAPHY.H6}>{t('contract')}:</Typography>
        <Typography className="import-token__contract-address" variant={TYPOGRAPHY.H7} boxProps={{
        marginBottom: 6
      }}>
          {tokenForImport.address}
        </Typography>
      </Box>
    </Popover>;
}
ImportToken.propTypes = {
  onImportTokenCloseClick: PropTypes.func,
  onImportTokenClick: PropTypes.func,
  setIsImportTokenModalOpen: PropTypes.func,
  tokenForImport: PropTypes.object
};