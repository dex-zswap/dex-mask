import React, { useMemo } from 'react';

import classnames from 'classnames';

const TextField = ({
  className,
  error,
  label,
  bordered,
  ...inputProps
}) => {
  const inputClassNames = useMemo(() => classnames('dex-text-field-input', bordered && 'bordered', `${className}-input`), [className, bordered]);

  return (
    <div className={classnames('dex-text-field', className)}>
      {
        React.isValidElement(label) ?
        label : <label className={classnames('dex-text-field-label', `${className}-label`)}>{label}</label>
      }
      <input {...inputProps} className={inputClassNames} />
      {
        error && <div className="input-error">{error}</div>
      }
    </div>
  );
};

export default TextField;
