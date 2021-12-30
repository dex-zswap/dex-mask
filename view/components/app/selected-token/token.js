import React, {
  useContext,
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react'
import { useSelector } from 'react-redux'
import copyToClipboard from 'copy-to-clipboard'
import { I18nContext } from '@view/contexts/i18n'
import LongLetter from '@c/ui/long-letter'
import TokenImage from '@c/ui/token-image'
import Tooltip from '@c/ui/tooltip'
import { SECOND } from '@shared/constants/time'
import { toChecksumHexAddress } from '@shared/modules/hexstring-utils'
import { shortenAddress } from '@view/helpers/utils'
import { getTokens } from '@reducer/dexmask/dexmask'
import { useTokenFiatAmount } from '@view/hooks/useTokenFiatAmount'
import { useTokenTracker } from '@view/hooks/useTokenTracker'
import {
  getShouldHideZeroBalanceTokens,
  getSelectedAccount,
  getSelectedIdentity,
} from '@view/selectors'
import AccountSwitcher from './account-switcher'
export default function SelectedToken({ token }) {
  const t = useContext(I18nContext)
  const selectedIdentity = useSelector(getSelectedIdentity)
  const selectedAccount = useSelector(getSelectedAccount)
  const [state, setState] = useState({
    copied: false,
  })
  const tokens = useSelector(getTokens)
  const shouldHideZeroBalanceTokens = useSelector(
    getShouldHideZeroBalanceTokens,
  )
  const { tokensWithBalancesLoading, tokensWithBalances } = useTokenTracker(
    tokens,
    true,
    shouldHideZeroBalanceTokens,
  )
  const copyTimeout = useRef(null)
  const checksummedAddress = useMemo(
    () => toChecksumHexAddress(selectedIdentity.address),
    [selectedIdentity.address],
  )
  const targetToken = useMemo(
    () => tokensWithBalances.find(({ address }) => address === token.address),
    [token, tokensWithBalances],
  )
  const tokenBalance = useMemo(() => {
    if (tokensWithBalancesLoading) {
      return `0.00`
    }

    return targetToken?.string ?? '0.00'
  }, [targetToken])
  const formattedFiat = useTokenFiatAmount(
    token?.address,
    targetToken?.string,
    token?.symbol,
    {
      showFiat: true,
    },
  )
  const copyAddress = useCallback(() => {
    setState((state) =>
      Object.assign({}, state, {
        copied: true,
      }),
    )
    copyTimeout.current = setTimeout(
      () =>
        setState((state) =>
          Object.assign({}, state, {
            copied: false,
          }),
        ),
      SECOND * 3,
    )
    copyToClipboard(checksummedAddress)
  }, [checksummedAddress, copyToClipboard, copyTimeout.current, state.copied])
  useEffect(() => {
    if (copyTimeout.current) {
      window.clearTimeout(copyTimeout.current)
    }
  }, [copyTimeout.current])
  return (
    <>
      <div className='selected-token base-width'>
        <div className='account-address flex space-between items-center'>
          <AccountSwitcher />
          <Tooltip
            wrapperClassName='selected-account__tooltip-wrapper'
            position='top'
            title={state.copied ? t('copiedExclamation') : t('copyToClipboard')}
          >
            <div className='address flex items-center' onClick={copyAddress}>
              {shortenAddress(checksummedAddress)}
              <div className='copy-icon'></div>
            </div>
          </Tooltip>
        </div>
        <div className='native-currency flex space-between items-center'>
          <div className='native-currency-balance'>
            <div className='token-balance'>
              <LongLetter
                text={tokenBalance}
                subfix={token.symbol}
                length={7}
              />
            </div>
            <div className='token-usd'>{formattedFiat}</div>
          </div>
          <TokenImage symbol={token.symbol} address={token.address} size={48} />
        </div>
      </div>
    </>
  )
}
