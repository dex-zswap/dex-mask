import React, { useState, useCallback, useMemo } from 'react';

const Tabs = ({ tabs, children }) => {
  const [ current, setCurrent ] = useState(tabs[0]?.key);

  const tabChildren = useMemo(() => {
    const index = tabs.findIndex(({ key }) => key === current);
    return index > -1 ? children[index] : null;
  }, [children, current, tabs]);

  const switchTab = useCallback((e, key) => {
    e.stopPropagation();
    setCurrent(key);
  }, []);

  console.log(tabChildren, current, tabs)

  return (
    <div className="dex-tabs">
      <div className="tabs-tab flex space-between items-center">
        {tabs.map((tab) => {
          return (
            <div className="tab-item" key={tab.key} onClick={(e) => switchTab(e, key)}>
              {tab.label}
            </div>
          );
        })}
      </div>
      <div className="tabs-content">
        {tabChildren}
      </div>
    </div>
  );
};

export default Tabs;