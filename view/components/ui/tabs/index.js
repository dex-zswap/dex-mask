import React, { useState, useCallback, useMemo } from 'react';
import classnames from 'classnames';

const Tabs = ({ tabs, actived, children, onChange }) => {
  const [current, setCurrent] = useState(actived ?? tabs[0]?.key);
  const tabChildren = useMemo(() => {
    const index = tabs.findIndex(({ key }) => key === current);
    return index > -1 ? children[index] : null;
  }, [children, current, tabs]);
  const switchTab = useCallback(
    (e, key) => {
      e.stopPropagation();
      setCurrent(key);
      typeof onChange === 'function' && onChange(key);
    },
    [onChange],
  );
  return (
    <div className="dex-tabs">
      <div className="tabs-tab flex space-between items-center">
        {tabs.map((tab) => {
          return (
            <div
              className={classnames(
                'tab-item',
                current === tab.key && 'active',
              )}
              key={tab.key}
              onClick={(e) => switchTab(e, tab.key)}
            >
              {tab.label}
            </div>
          );
        })}
      </div>
      <div className="tabs-content">{tabChildren}</div>
    </div>
  );
};

export default Tabs;
