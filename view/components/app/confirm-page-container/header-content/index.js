import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import BigNumber from 'bignumber.js'
import classnames from 'classnames'
import copyToClipboard from 'copy-to-clipboard'
import { zeroAddress } from 'ethereumjs-util'
import PropTypes from 'prop-types'
import AccountMismatchWarning from '@c/ui/account-mismatch-warning'
import Identicon from '@c/ui/identicon'
import {
  CARDS_VARIANT,
  DEFAULT_VARIANT,
  FLAT_VARIANT,
} from '@c/ui/sender-to-recipient/constants'
import TokenImage from '@c/ui/token-image'
import Tooltip from '@c/ui/tooltip'
import { getNativeCurrency } from '@reducer/dexmask/dexmask'
import { toChecksumHexAddress } from '@shared/modules/hexstring-utils'
import { SECONDARY } from '@view/helpers/constants/common'
import { getPrice } from '@view/helpers/cross-chain-api'
import { shortenAddress } from '@view/helpers/utils'
import { useCurrencyDisplay } from '@view/hooks/useCurrencyDisplay'
import { useFetch } from '@view/hooks/useFetch'
import { useI18nContext } from '@view/hooks/useI18nContext'
import { useTokenFiatAmount } from '@view/hooks/useTokenFiatAmount'
import { useUserPreferencedCurrency } from '@view/hooks/useUserPreferencedCurrency'
const variantHash = {
  [DEFAULT_VARIANT]: 'sender-to-recipient--default',
  [CARDS_VARIANT]: 'sender-to-recipient--cards',
  [FLAT_VARIANT]: 'sender-to-recipient--flat',
}

function SenderAddress({
  addressOnly,
  checksummedSenderAddress,
  senderName,
  onSenderClick,
  senderAddress,
  warnUserOnAccountMismatch,
}) {
  const t = useI18nContext()
  const [addressCopied, setAddressCopied] = useState(false)
  let tooltipHtml = <p>{t('copiedExclamation')}</p>

  if (!addressCopied) {
    tooltipHtml = addressOnly ? (
      <p>{t('copyAddress')}</p>
    ) : (
      <p>
        {shortenAddress(checksummedSenderAddress)}
        <br />
        {t('copyAddress')}
      </p>
    )
  }

  return (
    <div
      className={classnames(
        'sender-to-recipient__party sender-to-recipient__party--sender',
      )}
      onClick={() => {
        setAddressCopied(true)
        copyToClipboard(checksummedSenderAddress)

        if (onSenderClick) {
          onSenderClick()
        }
      }}
    >
      {!addressOnly && (
        <div className='sender-to-recipient__sender-icon'>
          <Identicon
            address={toChecksumHexAddress(senderAddress)}
            diameter={24}
          />
        </div>
      )}
      <Tooltip
        position='bottom'
        html={tooltipHtml}
        wrapperClassName='sender-to-recipient__tooltip-wrapper'
        containerClassName='sender-to-recipient__tooltip-container'
        onHidden={() => setAddressCopied(false)}
      >
        <div className='sender-to-recipient__name'>
          {addressOnly ? (
            <span>
              {`${t('from')}: ${senderName || checksummedSenderAddress}`}
            </span>
          ) : (
            senderName
          )}
        </div>
      </Tooltip>
      {warnUserOnAccountMismatch && (
        <AccountMismatchWarning address={senderAddress} />
      )}
    </div>
  )
}

SenderAddress.propTypes = {
  senderName: PropTypes.string,
  checksummedSenderAddress: PropTypes.string,
  addressOnly: PropTypes.bool,
  senderAddress: PropTypes.string,
  onSenderClick: PropTypes.func,
  warnUserOnAccountMismatch: PropTypes.bool,
}

function RecipientWithAddress({
  checksummedRecipientAddress,
  assetImage,
  onRecipientClick,
  addressOnly,
  recipientNickname,
  recipientEns,
  recipientName,
}) {
  const t = useI18nContext()
  const [addressCopied, setAddressCopied] = useState(false)
  let tooltipHtml = <p>{t('copiedExclamation')}</p>

  if (!addressCopied) {
    if (addressOnly && !recipientNickname && !recipientEns) {
      tooltipHtml = <p>{t('copyAddress')}</p>
    } else {
      tooltipHtml = (
        <p>
          {shortenAddress(checksummedRecipientAddress)}
          <br />
          {t('copyAddress')}
        </p>
      )
    }
  }

  return (
    <div
      className='sender-to-recipient__party sender-to-recipient__party--recipient sender-to-recipient__party--recipient-with-address'
      onClick={() => {
        setAddressCopied(true)
        copyToClipboard(checksummedRecipientAddress)

        if (onRecipientClick) {
          onRecipientClick()
        }
      }}
    >
      {!addressOnly && (
        <div className='sender-to-recipient__sender-icon'>
          <Identicon
            address={checksummedRecipientAddress}
            diameter={24}
            image={assetImage}
          />
        </div>
      )}
      <Tooltip
        position='bottom'
        html={tooltipHtml}
        offset={-10}
        wrapperClassName='sender-to-recipient__tooltip-wrapper'
        containerClassName='sender-to-recipient__tooltip-container'
        onHidden={() => setAddressCopied(false)}
      >
        <div className='sender-to-recipient__name'>
          <span>{addressOnly ? `${t('to')}: ` : ''}</span>
          {addressOnly
            ? recipientNickname || recipientEns || checksummedRecipientAddress
            : recipientNickname ||
              recipientEns ||
              recipientName ||
              t('newContract')}
        </div>
      </Tooltip>
    </div>
  )
}

RecipientWithAddress.propTypes = {
  checksummedRecipientAddress: PropTypes.string,
  recipientName: PropTypes.string,
  recipientEns: PropTypes.string,
  recipientNickname: PropTypes.string,
  addressOnly: PropTypes.bool,
  assetImage: PropTypes.string,
  onRecipientClick: PropTypes.func,
}

function Arrow({ variant }) {
  return variant === DEFAULT_VARIANT ? (
    <div className='sender-to-recipient__arrow-container'>
      <div className='sender-to-recipient__arrow-circle'>
        <img height='10' width='10' src='./images/arrow-right.svg' alt='' />
      </div>
    </div>
  ) : (
    <div className='sender-to-recipient__arrow-container'>
      <img height='20' src='./images/caret-right.svg' alt='' />
    </div>
  )
}

Arrow.propTypes = {
  variant: PropTypes.oneOf([DEFAULT_VARIANT, CARDS_VARIANT, FLAT_VARIANT]),
}
export default function ConfirmPageContainerHeaderContent({
  tokenData,
  title,
  titleComponent,
  senderAddress,
  addressOnly,
  assetImage,
  senderName,
  recipientNickname,
  recipientName,
  recipientEns,
  onRecipientClick,
  onSenderClick,
  recipientAddress,
  variant,
  warnUserOnAccountMismatch,
}) {
  const nativeCurrency = useSelector(getNativeCurrency)
  const t = useI18nContext()
  const checksummedSenderAddress = toChecksumHexAddress(senderAddress)
  const checksummedRecipientAddress = toChecksumHexAddress(recipientAddress)
  const address = useMemo(() => tokenData?.address || zeroAddress(), [
    tokenData?.address,
  ])
  const isNativeCurrency = useMemo(() => address === zeroAddress(), [address])
  const amount = useMemo(
    () => titleComponent?.props?.value || title.split(' ')[0],
    [titleComponent, title],
  )
  const symbol = useMemo(() => tokenData?.symbol || nativeCurrency, [
    tokenData?.symbol,
    nativeCurrency,
  ])
  const {
    currency: secondaryCurrency,
    numberOfDecimals: secondaryNumberOfDecimals,
  } = useUserPreferencedCurrency(SECONDARY, {
    ethNumberOfDecimals: 4,
  })
  const [
    secondaryCurrencyDisplay,
    secondaryCurrencyProperties,
  ] = useCurrencyDisplay(amount, {
    numberOfDecimals: secondaryNumberOfDecimals,
    currency: secondaryCurrency,
  })
  const tokenUsdValue = useTokenFiatAmount(address, amount, symbol, {
    showFiat: true,
  })
  const { res, error, loading } = useFetch(
    () =>
      getPrice({
        token_address: address,
        symbol,
      }),
    [address, symbol],
  )
  const usdPrice = useMemo(() => {
    if (error || loading) {
      return 0
    }

    return new BigNumber(
      new BigNumber(res?.d?.price || 0).times(new BigNumber(amount)).toFixed(3),
    ).toFixed()
  }, [res, error, loading, amount])
  return (
    <div className='confirm-page-container-header-content-wrap'>
      <div>
        <div className='confirm-page-container-header-content-wrap_sender'>
          <TokenImage address={address} symbol={symbol} size={40} showLetter />
          {/* <img
          style={{ borderRadius: '50%' }}
          width="40px"
          height="40px"
          src={assetImage || nativeCurrencyImage}
          /> */}
          <div
            className='confirm-page-container-header-content-wrap_sender_title-wrap'
            style={{
              marginLeft: '6px',
            }}
          >
            <div
              className='confirm-page-container-header-content-wrap_sender_title'
              title={title ? title.split(' ')[1] : nativeCurrency}
            >
              {title ? title.split(' ')[1] : nativeCurrency}
            </div>
            <div title={senderName}>{senderName}</div>
          </div>
        </div>
        <div className='confirm-page-container-header-content-wrap_arrow'>
          <img src='images/dex/arrow_right.png' />
        </div>
        <div
          title={checksummedRecipientAddress}
          className='confirm-page-container-header-content-wrap_recipient'
        >
          {shortenAddress(checksummedRecipientAddress, 4, -3)}
        </div>
      </div>
      <div>
        <div className='confirm-header-value-wrap'>
          <div className='confirm-header-value'>
            {titleComponent || title.split(' ')[0]}
          </div>
          <span>{titleComponent ? nativeCurrency : title.split(' ')[1]}</span>
        </div>
        <div>
          ≈ {isNativeCurrency ? secondaryCurrencyDisplay : tokenUsdValue}
        </div>
      </div>
    </div>
  )
  return (
    <div className={classnames('sender-to-recipient', variantHash[variant])}>
      <SenderAddress
        checksummedSenderAddress={checksummedSenderAddress}
        addressOnly={addressOnly}
        senderName={senderName}
        onSenderClick={onSenderClick}
        senderAddress={senderAddress}
        warnUserOnAccountMismatch={warnUserOnAccountMismatch}
      />
      <Arrow variant={variant} />
      {recipientAddress ? (
        <RecipientWithAddress
          assetImage={assetImage}
          checksummedRecipientAddress={checksummedRecipientAddress}
          onRecipientClick={onRecipientClick}
          addressOnly={addressOnly}
          recipientNickname={recipientNickname}
          recipientEns={recipientEns}
          recipientName={recipientName}
        />
      ) : (
        <div className='sender-to-recipient__party sender-to-recipient__party--recipient'>
          {!addressOnly && <i className='fa fa-file-text-o' />}
          <div className='sender-to-recipient__name'>{t('newContract')}</div>
        </div>
      )}
    </div>
  )
}
ConfirmPageContainerHeaderContent.defaultProps = {
  variant: DEFAULT_VARIANT,
  warnUserOnAccountMismatch: true,
}
ConfirmPageContainerHeaderContent.propTypes = {
  senderName: PropTypes.string,
  senderAddress: PropTypes.string,
  recipientName: PropTypes.string,
  recipientEns: PropTypes.string,
  recipientAddress: PropTypes.string,
  recipientNickname: PropTypes.string,
  variant: PropTypes.oneOf([DEFAULT_VARIANT, CARDS_VARIANT, FLAT_VARIANT]),
  addressOnly: PropTypes.bool,
  assetImage: PropTypes.string,
  onRecipientClick: PropTypes.func,
  onSenderClick: PropTypes.func,
  warnUserOnAccountMismatch: PropTypes.bool,
}
