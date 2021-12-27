import React from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import AddTokenButton from '@c/app/add-token-button'
import AssetListItem from '@c/app/asset-list-item'
import CrossChainButton from '@c/app/cross-chain'
import TokenList from '@c/app/token-list'
import LongLetter from '@c/ui/long-letter'
import { getNativeCurrency } from '@reducer/dexmask/dexmask'
import { NETWORK_TO_NAME_MAP } from '@shared/constants/network'
import { PRIMARY, SECONDARY } from '@view/helpers/constants/common'
import { ADD_TOKEN_ROUTE } from '@view/helpers/constants/routes'
import { useCurrencyDisplay } from '@view/hooks/useCurrencyDisplay'
import { useUserPreferencedCurrency } from '@view/hooks/useUserPreferencedCurrency'
import {
  getCurrentAccountWithSendEtherInfo,
  getNativeCurrencyImage,
  getShouldShowFiat,
} from '@view/selectors'

const AssetList = ({ onClickAsset }) => {
  const history = useHistory()
  const selectedAccountBalance = useSelector(
    (state) => getCurrentAccountWithSendEtherInfo(state).balance,
  )
  const nativeCurrency = useSelector(getNativeCurrency)
  const showFiat = useSelector(getShouldShowFiat)
  const provider = useSelector((state) => state.metamask.provider)
  const {
    currency: primaryCurrency,
    numberOfDecimals: primaryNumberOfDecimals,
  } = useUserPreferencedCurrency(PRIMARY, {
    ethNumberOfDecimals: 4,
  })
  const {
    currency: secondaryCurrency,
    numberOfDecimals: secondaryNumberOfDecimals,
  } = useUserPreferencedCurrency(SECONDARY, {
    ethNumberOfDecimals: 4,
  })
  const [, primaryCurrencyProperties] = useCurrencyDisplay(
    selectedAccountBalance,
    {
      numberOfDecimals: primaryNumberOfDecimals,
      currency: primaryCurrency,
    },
  )
  const [
    secondaryCurrencyDisplay,
    secondaryCurrencyProperties,
  ] = useCurrencyDisplay(selectedAccountBalance, {
    numberOfDecimals: secondaryNumberOfDecimals,
    currency: secondaryCurrency,
  })
  const primaryTokenImage = useSelector(getNativeCurrencyImage)
  const providerType = (
    NETWORK_TO_NAME_MAP[provider.type] ?? provider.type
  ).toUpperCase()
  return (
    <div className='assets-list-wrapper'>
      <AssetListItem
        hideSuffixSymbol={true}
        onClick={() => onClickAsset(nativeCurrency)}
        primary={
          <div className='token-detail'>
            {showFiat && (
              <div className='token-usd'>{secondaryCurrencyDisplay}</div>
            )}
            <div
              className='token-amount'
              title={`${primaryCurrencyProperties.value} ${primaryCurrencyProperties.suffix}`}
            >
              <LongLetter text={primaryCurrencyProperties.value} length={10} />
              &nbsp;&nbsp;
              {primaryCurrencyProperties.suffix}
            </div>
          </div>
        }
        tokenSymbol={primaryCurrencyProperties.suffix}
        tokenImage={primaryTokenImage}
      />
      <TokenList
        onTokenClick={(tokenAddress) => {
          onClickAsset(tokenAddress)
        }}
      />
      <AddTokenButton
        onClick={() => {
          history.push(ADD_TOKEN_ROUTE)
        }}
      />
      <CrossChainButton />
    </div>
  )
}

AssetList.propTypes = {
  onClickAsset: PropTypes.func.isRequired,
}
export default AssetList
