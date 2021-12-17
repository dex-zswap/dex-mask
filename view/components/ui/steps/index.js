import React, { useMemo } from 'react';
import classnames from 'classnames';
export default function Steps({ total, current }) {
  const steps = useMemo(() => new Array(total).fill(0), [total]);
  let isCurrent;
  let isBefore;
  let isLast;
  let currentNumber;
  let classes = [];
  return (
    <div className="steps-component__wrapper">
      {steps.map((item, index) => {
        classes = [];
        currentNumber = index + 1;
        isCurrent = currentNumber <= current;
        isLast = currentNumber === total;
        isBefore = currentNumber < current;
        return (
          <div key={index} className="steps-component__item">
            <div
              className={classnames([
                'step-item',
                `step-${currentNumber}`,
                isCurrent && 'active',
              ])}
            >
              {currentNumber}
            </div>
            {!isLast && (
              <div className={classnames(['line', isBefore && 'active'])}></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
