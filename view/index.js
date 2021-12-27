import React from 'react'
import { render } from 'react-dom'
import copyToClipboard from 'copy-to-clipboard'
import { clone } from 'lodash'
import log from 'loglevel'
import { getEnvironmentType } from '@app/scripts/lib/util'
import { ALERT_TYPES } from '@shared/constants/alerts' // import { SENTRY_STATE } from '../app/scripts/lib/setupSentry';

import { ENVIRONMENT_TYPE_POPUP } from '@shared/constants/app'
import * as actions from './store/actions'
import configureStore from './store/store'
import {
  fetchLocale,
  loadRelativeTimeFormatLocaleData,
} from './helpers/utils/i18n-helper'
import switchDirection from './helpers/utils/switch-direction'
import {
  getPermittedAccountsForCurrentTab,
  getSelectedAddress,
} from './selectors'
import { ALERT_STATE } from './reducer/alerts'
import {
  getUnconnectedAccountAlertEnabledness,
  getUnconnectedAccountAlertShown,
} from './reducer/dexmask/dexmask'
import Root from './pages'
import txHelper from './helpers/utils/tx-helper'
log.setLevel(global.DEXMASK_DEBUG ? 'debug' : 'warn')
export default function launchDexmaskUi(opts, cb) {
  const { backgroundConnection } = opts

  actions._setBackgroundConnection(backgroundConnection) // check if we are unlocked first

  backgroundConnection.getState(function (err, dexmaskState) {
    if (err) {
      cb(err)
      return
    }

    startApp(dexmaskState, backgroundConnection, opts).then((store) => {
      setupDebuggingHelpers(store)
      cb(null, store)
    })
  })
}

async function startApp(dexmaskState, backgroundConnection, opts) {
  // parse opts
  if (!dexmaskState.featureFlags) {
    dexmaskState.featureFlags = {}
  }

  const currentLocaleMessages = dexmaskState.currentLocale
    ? await fetchLocale(dexmaskState.currentLocale)
    : {}
  const enLocaleMessages = await fetchLocale('en')
  await loadRelativeTimeFormatLocaleData('en')

  if (dexmaskState.currentLocale) {
    await loadRelativeTimeFormatLocaleData(dexmaskState.currentLocale)
  }

  if (dexmaskState.textDirection === 'rtl') {
    await switchDirection('rtl')
  }

  const draftInitialState = {
    activeTab: opts.activeTab,
    // dexmaskState represents the cross-tab state
    metamask: dexmaskState,
    // appState represents the current tab's popup state
    appState: {},
    localeMessages: {
      current: currentLocaleMessages,
      en: enLocaleMessages,
    },
  }

  if (getEnvironmentType() === ENVIRONMENT_TYPE_POPUP) {
    const { origin } = draftInitialState.activeTab
    const permittedAccountsForCurrentTab = getPermittedAccountsForCurrentTab(
      draftInitialState,
    )
    const selectedAddress = getSelectedAddress(draftInitialState)
    const unconnectedAccountAlertShownOrigins = getUnconnectedAccountAlertShown(
      draftInitialState,
    )
    const unconnectedAccountAlertIsEnabled = getUnconnectedAccountAlertEnabledness(
      draftInitialState,
    )

    if (
      origin &&
      unconnectedAccountAlertIsEnabled &&
      !unconnectedAccountAlertShownOrigins[origin] &&
      permittedAccountsForCurrentTab.length > 0 &&
      !permittedAccountsForCurrentTab.includes(selectedAddress)
    ) {
      draftInitialState[ALERT_TYPES.unconnectedAccount] = {
        state: ALERT_STATE.OPEN,
      }
      actions.setUnconnectedAccountAlertShown(origin)
    }
  }

  const store = configureStore(draftInitialState) // if unconfirmed txs, start on txConf page

  const unapprovedTxsAll = txHelper(
    dexmaskState.unapprovedTxs,
    dexmaskState.unapprovedMsgs,
    dexmaskState.unapprovedPersonalMsgs,
    dexmaskState.unapprovedDecryptMsgs,
    dexmaskState.unapprovedEncryptionPublicKeyMsgs,
    dexmaskState.unapprovedTypedMessages,
    dexmaskState.network,
    dexmaskState.provider.chainId,
  )
  const numberOfUnapprovedTx = unapprovedTxsAll.length

  if (numberOfUnapprovedTx > 0) {
    store.dispatch(
      actions.showConfTxPage({
        id: unapprovedTxsAll[0].id,
      }),
    )
  }

  backgroundConnection.onNotification((data) => {
    if (data.method === 'sendUpdate') {
      store.dispatch(actions.updateDexmaskState(data.params[0]))
    } else {
      throw new Error(
        `Internal JSON-RPC Notification Not Handled:\n\n ${JSON.stringify(
          data,
        )}`,
      )
    }
  }) // global metamask api - used by tooling

  global.metamask = {
    updateCurrentLocale: (code) => {
      store.dispatch(actions.updateCurrentLocale(code))
    },
    setProviderType: (type) => {
      store.dispatch(actions.setProviderType(type))
    },
    setFeatureFlag: (key, value) => {
      store.dispatch(actions.setFeatureFlag(key, value))
    },
  } // start app

  render(<Root store={store} />, opts.container)
  return store
}

function maskObject(object, mask) {
  return Object.keys(object).reduce((state, key) => {
    if (mask[key] === true) {
      state[key] = object[key]
    } else if (mask[key]) {
      state[key] = maskObject(object[key], mask[key])
    }

    return state
  }, {})
}

function setupDebuggingHelpers(store) {
  window.getCleanAppState = function () {
    const state = clone(store.getState())
    state.version = global.platform.getVersion()
    state.browser = window.navigator.userAgent
    return state
  }
}

window.logStateString = function (cb) {
  const state = window.getCleanAppState()
  global.platform.getPlatformInfo((err, platform) => {
    if (err) {
      cb(err)
      return
    }

    state.platform = platform
    const stateString = JSON.stringify(state, null, 2)
    cb(null, stateString)
  })
}

window.logState = function (toClipboard) {
  return window.logStateString((err, result) => {
    if (err) {
      console.error(err.message)
    } else if (toClipboard) {
      copyToClipboard(result)
      console.log('State log copied')
    } else {
      console.log(result)
    }
  })
}
