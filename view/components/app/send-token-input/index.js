import TokenListItem from '@c/app/send-token-input/token-list-item'
import UserPreferencedCurrencyDisplay from '@c/app/user-preferenced/currency-display'
import Identicon from '@c/ui/identicon'
import TokenBalance from '@c/ui/token-balance'
import TokenImage from '@c/ui/token-image'
import { getNativeCurrency, getTokens } from '@reducer/dexmask/dexmask'
// import { setMaxSendAmount } from '@reducer/send'
import { PRIMARY } from '@view/helpers/constants/common'
import { shortenAddress } from '@view/helpers/utils'
import {
  expandDecimals,
  hexToString,
} from '@view/helpers/utils/conversions.util'
import useDeepEffect from '@view/hooks/useDeepEffect'
import { useI18nContext } from '@view/hooks/useI18nContext'
import useNativeCurrencyDisplay from '@view/hooks/useNativeCurrencyDisplay'
import { useTokenFiatAmount } from '@view/hooks/useTokenFiatAmount'
import { useTokenTracker } from '@view/hooks/useTokenTracker'
import {
  getDexMaskAccountsOrdered,
  getSelectedAddress,
  getShouldHideZeroBalanceTokens,
} from '@view/selectors'
import { showAccountDetail } from '@view/store/actions'
import BigNumber from 'bignumber.js'
import classnames from 'classnames'
import { zeroAddress } from 'ethereumjs-util'
import { ethers } from 'ethers'
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'

function SendTokenInput(
  {
    accountAddress,
    tokenAddress,
    tokenList,
    maxSendAmount,
    nativeCurrencyAmount,
    changeAccount,
    changeToken,
    changeAmount,
    optionsDirection,
    reverseAble,
    onReverse,
    usedByCross = false,
    includesNativeCurrencyToken = true,
    showAmountWrap = true,
    gasLoading = false,
  },
  ref,
) {
  const t = useI18nContext()
  const dispatch = useDispatch()
  const nativeCurrency = useSelector(getNativeCurrency)
  const accounts = useSelector(getDexMaskAccountsOrdered)
  const selectedAddress = useSelector(getSelectedAddress)
  const accountTokens = useSelector(getTokens)
  const shouldHideZeroBalanceTokens = useSelector(
    getShouldHideZeroBalanceTokens,
  )
  const accountMenuStyle = useMemo(() => {
    if (optionsDirection !== 'top') {
      return {}
    }

    const bodyHeight = Math.min(accounts.length * 61, 182)
    return {
      top: `-${bodyHeight + 23}px`,
    }
  }, [optionsDirection, accounts])
  const [showSelectAccountMenu, setShowSelectAccountMenu] = useState(false)
  const [showSelectTokenMenu, setShowSelectTokenMenu] = useState(false)
  const [amount, setAmount] = useState('')
  const resetAmount = useCallback(() => {
    setAmount('')
  }, [])
  const toggleAccountMenu = useCallback(() => {
    setShowSelectAccountMenu((pre) => !pre)
  }, [])
  const toggleTokenMenu = useCallback(() => {
    setShowSelectTokenMenu((pre) => !pre)
  }, [])
  const onAccountChange = useCallback(
    (account) => {
      resetAmount()
      !accountAddress && dispatch(showAccountDetail(account.address))
      changeAccount && changeAccount(account)
    },
    [accountAddress, changeAccount],
  )
  const onTokenChange = useCallback(
    (asset) => {
      resetAmount()
      changeToken && changeToken(asset)
    },
    [changeToken],
  )
  const selectedAccount = useMemo(
    () =>
      accounts.find(
        (account) => (accountAddress || selectedAddress) === account.address,
      ) || {},
    [accountAddress, accounts, selectedAddress],
  )
  const {
    value: nativeCurrencyDisplayAmount,
    suffix: nativeCurrencyDisplayAmountUnit,
  } = useNativeCurrencyDisplay(nativeCurrencyAmount ?? selectedAccount?.balance)
  const nativeAsset = useMemo(() => {
    try {
      return {
        address: zeroAddress(),
        string: new BigNumber(
          hexToString(nativeCurrencyAmount ?? selectedAccount?.balance),
        ).toString(),
        symbol: nativeCurrency,
        isNativeCurrency: true,
        nativeCurrencyDisplayAmount,
        nativeCurrencyDisplayAmountUnit,
      }
    } catch (e) {
      return {
        address: zeroAddress(),
        string: '0',
        symbol: nativeCurrency,
        isNativeCurrency: true,
        nativeCurrencyDisplayAmount,
        nativeCurrencyDisplayAmountUnit,
      }
    }
  }, [
    nativeCurrencyAmount,
    selectedAccount,
    nativeCurrency,
    nativeCurrencyDisplayAmount,
    nativeCurrencyDisplayAmountUnit,
  ])
  const tokenData = useMemo(() => tokenList || accountTokens, [
    tokenList,
    accountTokens,
  ])
  const hasTokens = useMemo(() => !!tokenData.length, [tokenData])
  const { tokensWithBalances } = useTokenTracker(
    tokenData,
    true,
    shouldHideZeroBalanceTokens,
  )
  const selectedToken = useMemo(
    () => tokenData.find(({ address }) => address === tokenAddress),
    [tokenData, tokenAddress],
  )
  const selectedTokenAddress = useMemo(() => {
    if (selectedToken) {
      return selectedToken.address
    } else {
      return zeroAddress()
    }
  }, [selectedToken])
  const selectedTokenSymbol = useMemo(
    () => (selectedToken ? selectedToken.symbol : nativeCurrency),
    [selectedToken, nativeCurrency],
  )
  const assetList = useMemo(() => {
    const data = includesNativeCurrencyToken ? [nativeAsset] : []
    return [...data, ...tokensWithBalances]
  }, [includesNativeCurrencyToken, nativeAsset, tokensWithBalances])
  const hexAmount = useMemo(
    () => ethers.BigNumber.from(expandDecimals(amount || 0)).toHexString(),
    [amount],
  )
  const {
    value: nativeCurrencyInputDisplayAmount,
    suffix: nativeCurrencyInputDisplayAmountUnit,
  } = useNativeCurrencyDisplay(hexAmount)
  const tokenInputDisplayStr = useTokenFiatAmount(
    selectedTokenAddress,
    amount,
    selectedTokenSymbol,
    {
      showFiat: true,
    },
    false,
    null,
  )
  const tokenInputDisplayAmount = useMemo(
    () => tokenInputDisplayStr?.split(' ')[0],
    [tokenInputDisplayStr],
  )
  const tokenInputDisplayAmountUnit = useMemo(
    () => tokenInputDisplayStr?.split(' ')[1],
    [tokenInputDisplayStr],
  )
  const onAmountChange = useCallback(
    async ({ target }) => {
      let val = target.value.trim().replace(/\n/gu, '') || null

      if (!val || isNaN(Number(val)) || val < 0) {
        val = ''
      }

      if (new BigNumber(val || 0).gt(new BigNumber(maxSendAmount))) {
        val = maxSendAmount
      }

      setAmount(val)
      changeAmount && changeAmount(val)
    },
    [maxSendAmount, changeAmount],
  )
  const setAmountToMax = useCallback(() => {
    if (gasLoading) {
      return
    }

    setAmount(maxSendAmount)
    changeAmount && changeAmount(maxSendAmount)
  }, [maxSendAmount, changeAmount, gasLoading])
  const reverseAction = useCallback(() => {
    reverseAble && onReverse && onReverse()
  }, [onReverse, reverseAble])
  useDeepEffect(() => {
    if (!usedByCross && selectedTokenAddress === zeroAddress()) {
      onTokenChange(nativeAsset)
    }
  }, [selectedTokenAddress, nativeAsset, usedByCross])
  useImperativeHandle(ref, () => ({
    resetAmount,
  }))
  return (
    <div className='base-width'>
      <div className='send-token-input-wrap w-100'>
        <div className='send-token-account-wrap' onClick={toggleAccountMenu}>
          <Identicon address={selectedAccount?.address} diameter={28} />
          <div
            className='send-token-account-name'
            title={selectedAccount?.name || ''}
          >
            {selectedAccount?.name || ''}
          </div>
          <img width={8} src='images/icons/arrow-down.png' />
          {showSelectAccountMenu && (
            <>
              <div
                className='send-token-input-menu-mask'
                onClick={(e) => {
                  e.stopPropagation()
                  toggleAccountMenu()
                }}
              ></div>
              <div
                style={accountMenuStyle}
                className={classnames(
                  'send-token-account-menu send-token-input-menu',
                  optionsDirection,
                )}
              >
                {accounts.map((account) => (
                  <div
                    key={account.address}
                    className={
                      selectedAccount?.address === account.address
                        ? 'active'
                        : ''
                    }
                    onClick={() => onAccountChange(account)}
                  >
                    <div className='account-name-wrap'>
                      <Identicon address={account.address} diameter={28} />
                      <div className='account-name'>{account.name}</div>
                    </div>
                    <div className='account-address'>
                      {shortenAddress(account.address, 8, -6)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div>{shortenAddress(selectedAccount?.address, 8, -6)}</div>
      </div>
      {showAmountWrap && (
        <div className='send-token-bottom-wrap'>
          <div className='line-wrap'>
            <div onClick={reverseAction}>
              {reverseAble ? (
                <img
                  className='reverseable-icon'
                  width={12}
                  src='images/icons/reverse.png'
                />
              ) : (
                <img width={8} src='images/icons/arrow-down.png' />
              )}
            </div>
          </div>
          <div className='asset-label-wrap'>
            <div className='half-wrap'>{t('asset')}:</div>
            <div className='half-wrap'>{t('amount')}:</div>
          </div>
          <div className='asset-wrap'>
            <div
              className='send-token-input-wrap half-wrap w-100'
              onClick={toggleTokenMenu}
            >
              <div
                style={{
                  width: hasTokens ? 'calc(100% - 18px)' : '100%',
                  marginRight: hasTokens ? '10px' : 0,
                }}
              >
                <div>
                  <div className='token-symbol'>{selectedTokenSymbol}</div>
                  <TokenImage
                    address={selectedTokenAddress}
                    symbol={selectedTokenSymbol}
                    size={16}
                  />
                </div>
                <div>
                  <div
                    style={{
                      marginRight: '5px',
                    }}
                  >{`${t('balance')}:`}</div>
                  {selectedToken ? (
                    <TokenBalance
                      token={selectedToken}
                      accountAddress={selectedAddress}
                    />
                  ) : (
                    <UserPreferencedCurrencyDisplay
                      value={selectedAccount?.balance}
                      type={PRIMARY}
                    />
                  )}
                </div>
              </div>
              {hasTokens && (
                <>
                  <img width={8} src='images/icons/arrow-down.png' />
                  {showSelectTokenMenu && (
                    <>
                      <div
                        className='send-token-input-menu-mask'
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleTokenMenu()
                        }}
                      ></div>
                      <div className='choose-token-menu send-token-input-menu'>
                        {assetList.map((asset) => (
                          <TokenListItem
                            key={asset.address}
                            address={asset.address}
                            symbol={asset.symbol}
                            balance={asset.string}
                            isNativeCurrency={asset.isNativeCurrency || false}
                            nativeCurrencyDisplayAmount={
                              asset.nativeCurrencyDisplayAmount
                            }
                            nativeCurrencyDisplayAmountUnit={
                              asset.nativeCurrencyDisplayAmountUnit
                            }
                            active={
                              selectedToken
                                ? tokenAddress === asset.address
                                : asset.isNativeCurrency
                            }
                            onClick={() => onTokenChange(asset)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            <div className='send-token-input-wrap half-wrap w-100'>
              <div
                style={{
                  width: 'calc(100% - 40px)',
                }}
              >
                <div>
                  <div className='amount-input-wrap'>
                    <div>{amount}</div>
                    <input
                      type='text'
                      placeholder='0'
                      value={amount}
                      onChange={onAmountChange}
                    />
                  </div>
                  <div className='amount-input-token-label'>
                    {selectedTokenSymbol}
                  </div>
                </div>
                <div className='display-amount-wrap'>
                  <div>
                    {selectedToken
                      ? tokenInputDisplayAmount
                      : nativeCurrencyInputDisplayAmount}
                  </div>
                  <div>
                    {selectedToken
                      ? tokenInputDisplayAmountUnit
                      : nativeCurrencyInputDisplayAmountUnit}
                  </div>
                </div>
              </div>
              <div
                className={classnames(
                  'max-label',
                  gasLoading ? 'disabled' : '',
                )}
                onClick={setAmountToMax}
              >
                {t('maxUp')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default forwardRef(SendTokenInput)
