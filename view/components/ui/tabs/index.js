import React, { useState, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import classnames from 'classnames'
import Selector from '@c/ui/selector'
import { getCurrentLocale } from '@reducer/dexmask/dexmask'

const Tabs = ({ tabs, actived, children, onChange }) => {
  const [current, setCurrent] = useState(actived ?? tabs[0]?.key)
  const tabChildren = useMemo(() => {
    const index = tabs.findIndex(({ key }) => key === current)
    return index > -1 ? children[index] : null
  }, [children, current, tabs])
  const switchTab = useCallback(
    (e, key) => {
      e.stopPropagation()
      setCurrent(key)
      typeof onChange === 'function' && onChange(key)
    },
    [onChange],
  )

  const locale = useSelector(getCurrentLocale)

  return (
    <div className='dex-tabs'>
      <div className='tabs-tab flex space-between items-center'>
        {tabs.map((tab) => {
          return (
            <div
              className={classnames(
                'tab-item',
                current === tab.key && 'active',
                tab.children && 'with-children'
              )}
              key={tab.key}
              onClick={(e) => switchTab(e, tab.key)}
            >
              <div>
                {!tab.children && tab.label}
                {
                  tab.children &&
                  <Selector
                    className={classnames('tab-item-selector', locale.split('_')[0])}
                    selectedValue={tab.childrenValue}
                    onSelect={tab.onSelect}
                    options={tab.children}
                    labelRender={() => tab.label}
                    itemRender={(item) => (
                      <div className='flex items-center'>
                        <span className='select-radio flex-inline items-center justify-center'>
                          <i className='checked'></i>
                        </span>
                        {item.label}
                      </div>
                    )}
                  />
                }
              </div>
            </div>
          )
        })}
      </div>
      <div className='tabs-content'>{tabChildren}</div>
    </div>
  )
}

export default Tabs
