import Tooltip from '@c/ui/tooltip';
import { useI18nContext } from '@view/hooks/useI18nContext';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { confusables } from 'unicode-confusables';

const Confusable = ({ input }) => {
  const t = useI18nContext();
  const confusableData = useMemo(() => {
    return confusables(input);
  }, [input]);

  return confusableData.map(({ point, similarTo }, index) => {
    const zeroWidth = similarTo === '';
    if (similarTo === undefined) {
      return point;
    }
    return (
      <Tooltip
        key={index.toString()}
        tag="span"
        position="top"
        title={
          zeroWidth
            ? t('confusableZeroWidthUnicode')
            : t('confusableUnicode', [point, similarTo])
        }
      >
        <span className="confusable__point">{zeroWidth ? '?' : point}</span>
      </Tooltip>
    );
  });
};

Confusable.propTypes = {
  input: PropTypes.string.isRequired,
};

export default Confusable;
