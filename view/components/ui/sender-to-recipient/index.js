import React, { useState, useMemo } from 'react'
import classnames from 'classnames'
import copyToClipboard from 'copy-to-clipboard'
import PropTypes from 'prop-types'
import AccountMismatchWarning from '@c/ui/account-mismatch-warning'
import Identicon from '@c/ui/identicon'
import Tooltip from '@c/ui/tooltip'
import { toChecksumHexAddress } from '@shared/modules/hexstring-utils'
import { shortenAddress } from '@view/helpers/utils'
import { useI18nContext } from '@view/hooks/useI18nContext'
import { CARDS_VARIANT, DEFAULT_VARIANT, FLAT_VARIANT } from './constants'
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
  const shortenedAddress = useMemo(() => shortenAddress(senderAddress, 9, -6), [
    senderAddress,
  ])
  let tooltipHtml = <p>{t('copiedExclamation')}</p>
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
        position='top'
        title={addressCopied ? t('copiedExclamation') : t('copyAddress')}
        wrapperClassName='sender-to-recipient__tooltip-wrapper'
        containerClassName='sender-to-recipient__tooltip-container'
        onHidden={() => setAddressCopied(false)}
      >
        <div className='sender-to-recipient__name'>
          {addressOnly ? (
            <span>{shortenedAddress}</span>
          ) : (
            <span>{`${t('from')}: ${senderName || shortenedAddress}`}</span>
          )}
        </div>
      </Tooltip>
      {warnUserOnAccountMismatch && (
        <AccountMismatchWarning address={senderAddress} />
      )}
    </div>
  )
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
  const shortenedAddress = useMemo(
    () => shortenAddress(checksummedRecipientAddress, 9, -6),
    [checksummedRecipientAddress],
  )
  const t = useI18nContext()
  const [addressCopied, setAddressCopied] = useState(false)
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
        position='top'
        title={addressCopied ? t('copiedExclamation') : t('copyAddress')}
        wrapperClassName='sender-to-recipient__tooltip-wrapper'
        containerClassName='sender-to-recipient__tooltip-container'
        onHidden={() => setAddressCopied(false)}
      >
        <div className='sender-to-recipient__name'>
          <span>{addressOnly ? '' : `${t('to')}: `}</span>
          {addressOnly
            ? recipientNickname || recipientEns || shortenedAddress
            : recipientNickname ||
              recipientEns ||
              recipientName ||
              t('newContract')}
        </div>
      </Tooltip>
    </div>
  )
}

export default function SenderToRecipient({
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
  const t = useI18nContext()
  const checksummedSenderAddress = toChecksumHexAddress(senderAddress)
  const checksummedRecipientAddress = toChecksumHexAddress(recipientAddress)
  return (
    <div
      className={classnames(
        'sender-to-recipient flex items-center',
        variantHash[variant],
      )}
    >
      <SenderAddress
        checksummedSenderAddress={checksummedSenderAddress}
        addressOnly={addressOnly}
        senderName={senderName}
        onSenderClick={onSenderClick}
        senderAddress={senderAddress}
        warnUserOnAccountMismatch={warnUserOnAccountMismatch}
      />
      <div className='to-direction-wrapper'>
        <div className='to-direction'></div>
      </div>
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
          <div className='sender-to-recipient__name'>{t('newContract')}</div>
        </div>
      )}
    </div>
  )
}
