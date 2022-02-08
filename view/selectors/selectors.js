import { stripHexPrefix } from 'ethereumjs-util'
import { createSelector } from 'reselect'
import createAsyncSelector from '@view/helpers/utils/create-async-selector'
import dexMaskDataBase from '@shared/modules/database'
import { TOKEN_DISPLAY_ORDER_TYPES } from '@shared/constants/tokens'
/**
 * One of the only remaining valid uses of selecting the network subkey of the
 * metamask state tree is to determine if the network is currently 'loading'.
 *
 * This will be used for all cases where this state key is accessed only for that
 * purpose.
 * @param {Object} state - redux state object
 */

import { addHexPrefix } from '@app/scripts/lib/util'
import { TEMPLATED_CONFIRMATION_MESSAGE_TYPES } from '@pages/confirmation/templates'
import {
  getConversionRate,
  getNativeCurrency,
  isEIP1559Network,
} from '@reducer/dexmask/dexmask'
import { KEYRING_TYPES } from '@shared/constants/hardware-wallets'
import {
  BSC_CHAIN_ID,
  MAINNET_CHAIN_ID,
  NATIVE_CURRENCY_TOKEN_IMAGE_MAP,
  NETWORK_TYPE_RPC,
  TEST_CHAINS,
} from '@shared/constants/network'
import {
  ALLOWED_SWAPS_CHAIN_IDS,
  SWAPS_CHAINID_DEFAULT_TOKEN_MAP,
} from '@shared/constants/swaps'
import { DAY } from '@shared/constants/time'
import { toChecksumHexAddress } from '@shared/modules/hexstring-utils'
import { getAccountByAddress, shortenAddress } from '@view/helpers/utils'
import {
  getValueFromWeiHex,
  hexToDecimal,
} from '@view/helpers/utils/conversions.util'
export function isNetworkLoading(state) {
  return state.metamask.network === 'loading'
}
export const getAllState = (state) => state
export function getNetworkIdentifier(state) {
  const {
    metamask: {
      provider: { type, nickname, rpcUrl },
    },
  } = state
  return nickname || rpcUrl || type
}
export function getMetricsNetworkIdentifier(state) {
  const { provider } = state.metamask
  return provider.type === NETWORK_TYPE_RPC ? provider.rpcUrl : provider.type
}
export function getCurrentChainId(state) {
  const { chainId } = state.metamask.provider
  return chainId
}
export function getCurrentKeyring(state) {
  const identity = getSelectedIdentity(state)

  if (!identity) {
    return null
  }

  const simpleAddress = stripHexPrefix(identity.address).toLowerCase()
  const keyring = state.metamask.keyrings.find((kr) => {
    return (
      kr.accounts.includes(simpleAddress) ||
      kr.accounts.includes(identity.address)
    )
  })
  return keyring
}
export function isEIP1559Account(state) {
  // Trezor does not support 1559 at this time
  const currentKeyring = getCurrentKeyring(state)
  return currentKeyring && currentKeyring.type !== KEYRING_TYPES.TREZOR
}
export function checkNetworkAndAccountSupports1559(state) {
  const networkSupports1559 = isEIP1559Network(state)
  const accountSupports1559 = isEIP1559Account(state)
  return networkSupports1559 && accountSupports1559
}
/**
 * Checks if the current wallet is a hardware wallet.
 * @param {Object} state
 * @returns {Boolean}
 */

export function isHardwareWallet(state) {
  const keyring = getCurrentKeyring(state)
  return keyring.type.includes('Hardware')
}
/**
 * Get a HW wallet type, e.g. "Ledger Hardware"
 * @param {Object} state
 * @returns {String|undefined}
 */

export function getHardwareWalletType(state) {
  const keyring = getCurrentKeyring(state)
  return keyring.type.includes('Hardware') ? keyring.type : undefined
}
export function getAccountType(state) {
  const currentKeyring = getCurrentKeyring(state)
  const type = currentKeyring && currentKeyring.type

  switch (type) {
    case 'Trezor Hardware':
    case 'Ledger Hardware':
      return 'hardware'

    case 'Simple Key Pair':
      return 'imported'

    default:
      return 'default'
  }
}
/**
 * get the currently selected networkId which will be 'loading' when the
 * network changes. The network id should not be used in most cases,
 * instead use chainId in most situations. There are a limited number of
 * use cases to use this method still, such as when comparing transaction
 * metadata that predates the switch to using chainId.
 * @deprecated - use getCurrentChainId instead
 * @param {Object} state - redux state object
 */

export function deprecatedGetCurrentNetworkId(state) {
  return state.metamask.network
}
export const getDexMaskAccounts = createSelector(
  getDexMaskAccountsRaw,
  getMetaMaskCachedBalances,
  (currentAccounts, cachedBalances) =>
    Object.entries(currentAccounts).reduce(
      (selectedAccounts, [accountID, account]) => {
        if (account.balance === null || account.balance === undefined) {
          return {
            ...selectedAccounts,
            [accountID]: {
              ...account,
              balance: cachedBalances && cachedBalances[accountID],
            },
          }
        }

        return { ...selectedAccounts, [accountID]: account }
      },
      {},
    ),
)
export function getSelectedAddress(state) {
  return state.metamask.selectedAddress
}
export function getSelectedIdentity(state) {
  const selectedAddress = getSelectedAddress(state)
  const { identities } = state.metamask
  return identities[selectedAddress]
}
export function getNumberOfAccounts(state) {
  return Object.keys(state.metamask.accounts).length
}
export function getNumberOfTokens(state) {
  const { tokens } = state.metamask
  return tokens ? tokens.length : 0
}
export function getMetaMaskKeyrings(state) {
  return state.metamask.keyrings
}
export function getMetaMaskIdentities(state) {
  return state.metamask.identities
}
export function getDexMaskAccountsRaw(state) {
  return state.metamask.accounts
}
export function getMetaMaskCachedBalances(state) {
  const chainId = getCurrentChainId(state) // Fallback to fetching cached balances from network id
  // this can eventually be removed

  const network = deprecatedGetCurrentNetworkId(state)
  return (
    state.metamask.cachedBalances[chainId] ??
    state.metamask.cachedBalances[network]
  )
}
/**
 * Get ordered (by keyrings) accounts with identity and balance
 */

export const getDexMaskAccountsOrdered = createSelector(
  getMetaMaskKeyrings,
  getMetaMaskIdentities,
  getDexMaskAccounts,
  (keyrings, identities, accounts) =>
    keyrings
      .reduce((list, keyring) => list.concat(keyring.accounts), [])
      .filter((address) => Boolean(identities[address]))
      .map((address) => ({ ...identities[address], ...accounts[address] })),
)
export const getDexMaskAccountsConnected = createSelector(
  getDexMaskAccountsOrdered,
  (connectedAccounts) =>
    connectedAccounts.map(({ address }) => address.toLowerCase()),
)
export function isBalanceCached(state) {
  const selectedAccountBalance =
    state.metamask.accounts[getSelectedAddress(state)].balance
  const cachedBalance = getSelectedAccountCachedBalance(state)
  return Boolean(!selectedAccountBalance && cachedBalance)
}
export function getSelectedAccountCachedBalance(state) {
  const cachedBalances = getMetaMaskCachedBalances(state)
  const selectedAddress = getSelectedAddress(state)
  return cachedBalances && cachedBalances[selectedAddress]
}
export function getSelectedAccount(state) {
  const accounts = getDexMaskAccounts(state)
  const selectedAddress = getSelectedAddress(state)
  return accounts[selectedAddress]
}
export function getTargetAccount(state, targetAddress) {
  const accounts = getDexMaskAccounts(state)
  return accounts[targetAddress]
}
export const getTokenExchangeRates = (state) =>
  state.metamask.contractExchangeRates
export function getAssetImages(state) {
  const assetImages = state.metamask.assetImages || {}
  return assetImages
}
export function getAddressBook(state) {
  const chainId = getCurrentChainId(state)

  if (!state.metamask.addressBook[chainId]) {
    return []
  }

  return Object.values(state.metamask.addressBook[chainId])
}
export function getAddressBookEntry(state, address) {
  const addressBook = getAddressBook(state)
  const entry = addressBook.find(
    (contact) => contact.address === toChecksumHexAddress(address),
  )
  return entry
}
export function getAddressBookEntryName(state, address) {
  const entry =
    getAddressBookEntry(state, address) || state.metamask.identities[address]
  return entry && entry.name !== '' ? entry.name : shortenAddress(address)
}
export function accountsWithSendEtherInfoSelector(state) {
  const accounts = getDexMaskAccounts(state)
  const identities = getMetaMaskIdentities(state)
  const accountsWithSendEtherInfo = Object.entries(identities).map(
    ([key, identity]) => {
      return { ...identity, ...accounts[key] }
    },
  )
  return accountsWithSendEtherInfo
}
export function getAccountsWithLabels(state) {
  return getDexMaskAccountsOrdered(state).map(({ address, name, balance }) => ({
    address,
    addressLabel: `${name} (...${address.slice(address.length - 4)})`,
    addressSliced: `(...${address.slice(address.length - 4)})`,
    label: name,
    balance,
  }))
}
export function getCurrentAccountWithSendEtherInfo(state) {
  const currentAddress = getSelectedAddress(state)
  const accounts = accountsWithSendEtherInfoSelector(state)
  return getAccountByAddress(accounts, currentAddress)
}
export function getTargetAccountWithSendEtherInfo(state, targetAddress) {
  const accounts = accountsWithSendEtherInfoSelector(state)
  return getAccountByAddress(accounts, targetAddress)
}
export function getCurrentEthBalance(state) {
  return getCurrentAccountWithSendEtherInfo(state).balance
}
export function getGasIsLoading(state) {
  return state.appState.gasIsLoading
}
export function getCurrentCurrency(state) {
  return state.metamask.currentCurrency
}
export function getTotalUnapprovedCount(state) {
  const {
    unapprovedMsgCount = 0,
    unapprovedPersonalMsgCount = 0,
    unapprovedDecryptMsgCount = 0,
    unapprovedEncryptionPublicKeyMsgCount = 0,
    unapprovedTypedMessagesCount = 0,
    pendingApprovalCount = 0,
  } = state.metamask
  return (
    unapprovedMsgCount +
    unapprovedPersonalMsgCount +
    unapprovedDecryptMsgCount +
    unapprovedEncryptionPublicKeyMsgCount +
    unapprovedTypedMessagesCount +
    getUnapprovedTxCount(state) +
    pendingApprovalCount +
    getSuggestedTokenCount(state)
  )
}

function getUnapprovedTxCount(state) {
  const { unapprovedTxs = {} } = state.metamask
  return Object.keys(unapprovedTxs).length
}

export function getUnapprovedConfirmations(state) {
  const { pendingApprovals } = state.metamask
  return Object.values(pendingApprovals)
}
export function getUnapprovedTemplatedConfirmations(state) {
  const unapprovedConfirmations = getUnapprovedConfirmations(state)
  return unapprovedConfirmations.filter((approval) =>
    TEMPLATED_CONFIRMATION_MESSAGE_TYPES.includes(approval.type),
  )
}

function getSuggestedTokenCount(state) {
  const { suggestedTokens = {} } = state.metamask
  return Object.keys(suggestedTokens).length
}

export function getIsMainnet(state) {
  const chainId = getCurrentChainId(state)
  return chainId === MAINNET_CHAIN_ID
}
export function getIsTestnet(state) {
  const chainId = getCurrentChainId(state)
  return TEST_CHAINS.includes(chainId)
}
export function getIsNonStandardEthChain(state) {
  return !(getIsMainnet(state) || getIsTestnet(state) || process.env.IN_TEST)
}
export function getPreferences({ metamask }) {
  return metamask.preferences
}
export function getShouldShowFiat(state) {
  return true
  const isMainNet = getIsMainnet(state)
  const conversionRate = getConversionRate(state)
  const { showFiatInTestnets } = getPreferences(state)
  return Boolean((isMainNet || showFiatInTestnets) && conversionRate)
}
export function getShouldHideZeroBalanceTokens(state) {
  const { hideZeroBalanceTokens } = getPreferences(state)
  return hideZeroBalanceTokens
}
export function getTokenDisplayOrdersType(state, autoPick = true) {
  const { tokenDisplayOrdersType } = getPreferences(state)
  return TOKEN_DISPLAY_ORDER_TYPES.DEFAULT
}
export function getTokenDisplayOrders(state, autoPick = true) {
  const { tokenDisplayOrders } = getPreferences(state)
  const selectedAddress = getSelectedAddress(state)
  const chainId = getCurrentChainId(state)
  let ordersInfo = {}

  try {
    ordersInfo = JSON.parse(tokenDisplayOrders)
  } catch (e) {
    ordersInfo = {}
  }

  return autoPick ? ordersInfo[chainId]?.[selectedAddress] ?? [] : ordersInfo
}
export function getAdvancedInlineGasShown(state) {
  return Boolean(state.metamask.featureFlags.advancedInlineGas)
}
export function getUseNonceField(state) {
  return Boolean(state.metamask.useNonceField)
}
export function getCustomNonceValue(state) {
  return String(state.metamask.customNonceValue)
}
export function getDomainMetadata(state) {
  return state.metamask.domainMetadata
}
export function getRpcPrefsForCurrentProvider(state) {
  const { frequentRpcListDetail, provider } = state.metamask
  const selectRpcInfo = frequentRpcListDetail.find(
    (rpcInfo) => rpcInfo.rpcUrl === provider.rpcUrl,
  )
  const { rpcPrefs = {} } = selectRpcInfo || {}
  return rpcPrefs
}
export function getKnownMethodData(state, data) {
  if (!data) {
    return null
  }

  const prefixedData = addHexPrefix(data)
  const fourBytePrefix = prefixedData.slice(0, 10)
  const { knownMethodData } = state.metamask
  return knownMethodData && knownMethodData[fourBytePrefix]
}
export function getFeatureFlags(state) {
  return state.metamask.featureFlags
}
export function getOriginOfCurrentTab(state) {
  return state.activeTab.origin
}
export function getIpfsGateway(state) {
  return state.metamask.ipfsGateway
}
export function getInfuraBlocked(state) {
  return Boolean(state.metamask.infuraBlocked)
}
export function getUSDConversionRate(state) {
  return state.metamask.usdConversionRate
}
export function getWeb3ShimUsageStateForOrigin(state, origin) {
  return state.metamask.web3ShimUsageOrigins[origin]
}
/**
 * @typedef {Object} SwapsEthToken
 * @property {string} symbol - The symbol for ETH, namely "ETH"
 * @property {string} name - The name of the ETH currency, "Ether"
 * @property {string} address - A substitute address for the metaswap-api to
 * recognize the ETH token
 * @property {string} decimals - The number of ETH decimals, i.e. 18
 * @property {string} balance - The user's ETH balance in decimal wei, with a
 * precision of 4 decimal places
 * @property {string} string - The user's ETH balance in decimal ETH
 */

/**
 * Swaps related code uses token objects for various purposes. These objects
 * always have the following properties: `symbol`, `name`, `address`, and
 * `decimals`.
 *
 * When available for the current account, the objects can have `balance` and
 * `string` properties.
 * `balance` is the users token balance in decimal values, denominated in the
 * minimal token units (according to its decimals).
 * `string` is the token balance in a readable format, ready for rendering.
 *
 * Swaps treats the selected chain's currency as a token, and we use the token constants
 * in the SWAPS_CHAINID_DEFAULT_TOKEN_MAP to set the standard properties for
 * the token. The getSwapsDefaultToken selector extends that object with
 * `balance` and `string` values of the same type as in regular ERC-20 token
 * objects, per the above description.
 *
 * @param {object} state - the redux state object
 * @returns {SwapsEthToken} The token object representation of the currently
 * selected account's ETH balance, as expected by the Swaps API.
 */

export function getSwapsDefaultToken(state) {
  const selectedAccount = getSelectedAccount(state)
  const { balance } = selectedAccount
  const chainId = getCurrentChainId(state)
  const defaultTokenObject = SWAPS_CHAINID_DEFAULT_TOKEN_MAP[chainId]
  return {
    ...defaultTokenObject,
    balance: hexToDecimal(balance),
    string: getValueFromWeiHex({
      value: balance,
      numberOfDecimals: 4,
      toDenomination: 'ETH',
    }),
  }
}
export function getIsSwapsChain(state) {
  const chainId = getCurrentChainId(state)
  return ALLOWED_SWAPS_CHAIN_IDS[chainId]
}
export function getNativeCurrencyImage(state) {
  const nativeCurrency = getNativeCurrency(state).toUpperCase()
  return NATIVE_CURRENCY_TOKEN_IMAGE_MAP[nativeCurrency]
}
export function getNextSuggestedNonce(state) {
  return Number(state.metamask.nextNonce)
}
export function getShowWhatsNewPopup(state) {
  return state.appState.showWhatsNewPopup
}
/**
 * Get an object of notification IDs and if they are allowed or not.
 * @param {Object} state
 * @returns {Object}
 */

function getAllowedNotificationIds(state) {
  return {
    1: true,
    2: true,
    3: true,
    4: getCurrentChainId(state) === BSC_CHAIN_ID,
    5: true,
    6: true,
  }
}
/**
 * @typedef {Object} Notification
 * @property {number} id - A unique identifier for the notification
 * @property {string} date - A date in YYYY-MM-DD format, identifying when the notification was first committed
 */

/**
 * Notifications are managed by the notification controller and referenced by
 * `state.metamask.notifications`. This function returns a list of notifications
 * the can be shown to the user. This list includes all notifications that do not
 * have a truthy `isShown` property.
 *
 * The returned notifications are sorted by date.
 *
 * @param {Object} state - the redux state object
 * @returns {Notification[]} An array of notifications that can be shown to the user
 */

export function getSortedNotificationsToShow(state) {
  const notifications = Object.values(state.metamask.notifications)
  const allowedNotificationIds = getAllowedNotificationIds(state)
  const notificationsToShow = notifications.filter(
    (notification) =>
      !notification.isShown && allowedNotificationIds[notification.id],
  )
  const notificationsSortedByDate = notificationsToShow.sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  )
  return notificationsSortedByDate
}
export function getShowRecoveryPhraseReminder(state) {
  const {
    recoveryPhraseReminderLastShown,
    recoveryPhraseReminderHasBeenShown,
  } = state.metamask
  const currentTime = new Date().getTime()
  const frequency = recoveryPhraseReminderHasBeenShown ? DAY * 90 : DAY * 2
  return currentTime - recoveryPhraseReminderLastShown >= frequency
}
export function getAppState(state) {
  return state.appState
}
export const getDBTokenOrders = createAsyncSelector(
  {
    async: async (chainId, accountAddress) => {
      const transactionsCount = {}
      const transactionsTime = {}
      const dbInstance = await dexMaskDataBase.getDBInstance()
      const result = await dbInstance.getAll('transactions')
      const transactions = result.filter(
        ({ fromAddress, chainId: transactionChainId }) =>
          fromAddress === accountAddress && transactionChainId == chainId,
      )
      const countDescTrans = []
      const timeDescTrans = []
      let timeDesc
      let countDesc
      transactions.forEach((transaction) => {
        transactionsCount[transaction.tokenAddress] = transactionsCount[
          transaction.tokenAddress
        ]
          ? transactionsCount[transaction.tokenAddress] + 1
          : 1
        transactionsTime[transaction.tokenAddress] = transactionsTime[
          transaction.tokenAddress
        ]
          ? transactionsTime[transaction.tokenAddress] < transaction.timestamp
            ? transaction.timestamp
            : transactionsTime[transaction.tokenAddress]
          : transaction.timestamp
      })

      for (const tokenAddress in transactionsCount) {
        countDescTrans.push([tokenAddress, transactionsCount[tokenAddress]])
      }

      for (const tokenAddress in transactionsTime) {
        timeDescTrans.push([tokenAddress, transactionsTime[tokenAddress]])
      }

      countDesc = countDescTrans
        .sort((t1, t2) => t2[1] - t1[1])
        .map((t) => t[0])
      timeDesc = timeDescTrans.sort((t1, t2) => t2[1] - t1[1]).map((t) => t[0])
      return {
        timeDesc,
        countDesc,
      }
    },
  },
  [getCurrentChainId, getSelectedAddress],
)
