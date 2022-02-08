import React, { PureComponent, useEffect } from 'react'
import { HashRouter, useHistory } from 'react-router-dom'
import { Provider, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import AutoInitTokens from '@c/app/auto-init-tokens'
import { I18nProvider, LegacyI18nProvider } from '@view/contexts/i18n'
import {
  TransactionCacheProvider,
  LegacyTransactionCacheProvider,
} from '@view/contexts/transaction-cache'
import { hideWarning } from '@view/store/actions'
import ErrorPage from './error'
import Routes from './routes'

const RestoreWarning = () => {
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    history.listen(() => dispatch(hideWarning()))

    return () => history.unlisten()
  }, [])

  return null
}

class Page extends PureComponent {
  state = {}

  static getDerivedStateFromError(error) {
    return {
      error,
    }
  }

  componentDidCatch(error) {
    console.log(error)
  }

  render() {
    const { error, errorId } = this.state
    const { store } = this.props

    if (error) {
      return (
        <Provider store={store}>
          <I18nProvider>
            <LegacyI18nProvider>
              <ErrorPage error={error} errorId={errorId} />
            </LegacyI18nProvider>
          </I18nProvider>
        </Provider>
      )
    }

    return (
      <Provider store={store}>
        <HashRouter hashType='noslash'>
          <TransactionCacheProvider>
            <LegacyTransactionCacheProvider>
              <I18nProvider>
                <LegacyI18nProvider>
                  <>
                    <Routes />
                    <AutoInitTokens />
                  </>
                </LegacyI18nProvider>
              </I18nProvider>
            </LegacyTransactionCacheProvider>
          </TransactionCacheProvider>
        </HashRouter>
      </Provider>
    )
  }
}

export default Page
