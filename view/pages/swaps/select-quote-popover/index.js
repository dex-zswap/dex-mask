import Button from '@c/ui/button';
import Popover from '@c/ui/popover';
import { I18nContext } from '@view/contexts/i18n';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useState } from 'react';
import QuoteDetails from './quote-details';
import { QUOTE_DATA_ROWS_PROPTYPES_SHAPE } from './select-quote-popover-constants';
import SortList from './sort-list';

const SelectQuotePopover = ({
  quoteDataRows = [],
  onClose = null,
  onSubmit = null,
  swapToSymbol,
  initialAggId,
  onQuoteDetailsIsOpened,
}) => {
  const t = useContext(I18nContext);

  const [sortDirection, setSortDirection] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);

  const [selectedAggId, setSelectedAggId] = useState(initialAggId);
  const [contentView, setContentView] = useState('sortList');
  const [viewingAgg, setViewingAgg] = useState(null);

  const onSubmitClick = useCallback(() => {
    onSubmit(selectedAggId);
    onClose();
  }, [selectedAggId, onClose, onSubmit]);

  const closeQuoteDetails = useCallback(() => {
    setViewingAgg(null);
    setContentView('sortList');
  }, []);

  const onRowClick = useCallback((aggId) => setSelectedAggId(aggId), [
    setSelectedAggId,
  ]);

  const onCaretClick = useCallback(
    (aggId) => {
      const agg = quoteDataRows.find((quote) => quote.aggId === aggId);
      setContentView('quoteDetails');
      onQuoteDetailsIsOpened();
      setViewingAgg(agg);
    },
    [quoteDataRows, onQuoteDetailsIsOpened],
  );

  const CustomBackground = useCallback(
    () => (
      <div className="select-quote-popover__popover-bg" onClick={onClose} />
    ),
    [onClose],
  );
  const footer = (
    <>
      <Button
        type="default"
        className="page-container__footer-button select-quote-popover__button"
        onClick={onClose}
      >
        {t('close')}
      </Button>

      <Button
        type="confirm"
        className="page-container__footer-button select-quote-popover__button"
        onClick={onSubmitClick}
      >
        {t('swapSelect')}
      </Button>
    </>
  );

  return (
    <div className="select-quote-popover">
      <Popover
        title={
          contentView === 'quoteDetails'
            ? t('swapSelectAQuote')
            : t('swapQuoteDetails')
        }
        subtitle={
          contentView === 'sortList'
            ? t('swapSelectQuotePopoverDescription')
            : null
        }
        onClose={onClose}
        CustomBackground={CustomBackground}
        className="select-quote-popover__popover-wrap"
        footerClassName="swaps__footer"
        footer={contentView === 'quoteDetails' ? null : footer}
        onBack={contentView === 'quoteDetails' ? closeQuoteDetails : null}
      >
        {contentView === 'sortList' && (
          <SortList
            quoteDataRows={quoteDataRows}
            selectedAggId={selectedAggId}
            onSelect={onRowClick}
            onCaretClick={onCaretClick}
            swapToSymbol={swapToSymbol}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            sortColumn={sortColumn}
            setSortColumn={setSortColumn}
          />
        )}
        {contentView === 'quoteDetails' && viewingAgg && (
          <QuoteDetails {...viewingAgg} />
        )}
      </Popover>
    </div>
  );
};

SelectQuotePopover.propTypes = {
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  swapToSymbol: PropTypes.string,
  renderableData: PropTypes.array,
  quoteDataRows: PropTypes.arrayOf(QUOTE_DATA_ROWS_PROPTYPES_SHAPE),
  initialAggId: PropTypes.string,
  onQuoteDetailsIsOpened: PropTypes.func,
};

export default SelectQuotePopover;
