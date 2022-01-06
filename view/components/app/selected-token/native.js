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
import { ethers } from 'ethers'
import { I18nContext } from '@view/contexts/i18n'
import LongLetter from '@c/ui/long-letter'
import TokenImage from '@c/ui/token-image'
import Tooltip from '@c/ui/tooltip'
import { SECOND } from '@shared/constants/time'
import { toChecksumHexAddress } from '@shared/modules/hexstring-utils'
import { shortenAddress } from '@view/helpers/utils'
import { getNativeCurrency } from '@reducer/dexmask/dexmask'
import { PRIMARY, SECONDARY } from '@view/helpers/constants/common'
import { useUserPreferencedCurrency } from '@view/hooks/useUserPreferencedCurrency'
import { useCurrencyDisplay } from '@view/hooks/useCurrencyDisplay'
import { getSelectedAccount, getSelectedIdentity } from '@view/selectors'
import AccountSwitcher from './account-switcher'
export default function SelectedNativeToken() {
  const t = useContext(I18nContext)
  const selectedIdentity = useSelector(getSelectedIdentity)
  const selectedAccount = useSelector(getSelectedAccount)
  const nativeCurrency = useSelector(getNativeCurrency)
  const [state, setState] = useState({
    copied: false,
  })
  const copyTimeout = useRef(null)
  const { balance } = selectedAccount
  const {
    currency: primaryCurrency,
    numberOfDecimals: primaryNumberOfDecimals,
  } = useUserPreferencedCurrency(PRIMARY, {
    ethNumberOfDecimals: 2,
  })
  const {
    currency: secondaryCurrency,
    numberOfDecimals: secondaryNumberOfDecimals,
  } = useUserPreferencedCurrency(SECONDARY, {
    ethNumberOfDecimals: 2,
  })
  const [, primaryCurrencyProperties] = useCurrencyDisplay(balance, {
    numberOfDecimals: primaryNumberOfDecimals,
    currency: primaryCurrency,
  })
  const [
    secondaryCurrencyDisplay,
    secondaryCurrencyProperties,
  ] = useCurrencyDisplay(balance, {
    numberOfDecimals: secondaryNumberOfDecimals,
    currency: secondaryCurrency,
  })
  const checksummedAddress = useMemo(
    () => toChecksumHexAddress(selectedIdentity.address),
    [selectedIdentity.address],
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
                text={primaryCurrencyProperties.value}
                length={12}
              />
            </div>
            <div className='token-usd'>
              <LongLetter
                text={secondaryCurrencyProperties.value}
                subfix={` ${secondaryCurrencyProperties.suffix}`}
                length={10}
              />
            </div>
          </div>
          <TokenImage
            symbol={nativeCurrency}
            address={ethers.constants.AddressZero}
            size={48}
          />
        </div>
      </div>
    </>
  )
}
