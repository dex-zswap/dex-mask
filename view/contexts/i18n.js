import React, { Component, createContext, useMemo } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { getCurrentLocale } from '@reducer/dexmask/dexmask'
import {
  getCurrentLocaleMessages,
  getEnLocaleMessages,
} from '@reducer/locale/locale'
import { getMessage } from '@view/helpers/utils/i18n-helper'
export const I18nContext = createContext((key) => `[${key}]`)
export const I18nProvider = (props) => {
  const currentLocale = useSelector(getCurrentLocale)
  const current = useSelector(getCurrentLocaleMessages)
  const en = useSelector(getEnLocaleMessages)
  const t = useMemo(() => {
    return (key, ...args) =>
      getMessage(currentLocale, current, key, ...args) ||
      getMessage(currentLocale, en, key, ...args)
  }, [currentLocale, current, en])
  return <I18nContext.Provider value={t}>{props.children}</I18nContext.Provider>
}
I18nProvider.propTypes = {
  children: PropTypes.node,
}
I18nProvider.defaultProps = {
  children: undefined,
}
export class LegacyI18nProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
  }
  static defaultProps = {
    children: undefined,
  }
  static contextType = I18nContext
  static childContextTypes = {
    t: PropTypes.func,
  }

  getChildContext() {
    return {
      t: this.context,
    }
  }

  render() {
    return this.props.children
  }
}
