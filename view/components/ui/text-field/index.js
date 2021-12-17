import classnames from 'classnames';
import React, { useMemo } from 'react';

const TextField = (
  { className, error, label, bordered = true, ...inputProps },
  ref,
) => {
  const inputClassNames = useMemo(
    () =>
      classnames(
        'dex-text-field-input',
        bordered && 'bordered',
        `${className}-input`,
      ),
    [className, bordered],
  );

  return (
    <div className={classnames('dex-text-field', className)}>
      {React.isValidElement(label) ? (
        label
      ) : (
        <label
          className={classnames('dex-text-field-label', `${className}-label`)}
        >
          {label}
        </label>
      )}
      <input {...inputProps} className={inputClassNames} ref={ref} />
      {error && <div className="input-error">{error}</div>}
    </div>
  );
};

export default React.forwardRef(TextField);
