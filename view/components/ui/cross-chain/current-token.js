import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import { ethers } from 'ethers';
import { Menu, MenuItem } from '@c/ui/menu';
import TokenImage from '@c/ui/token-image';
import { getNativeCurrency, getTokens } from '@reducer/dexmask/dexmask';
import { CHAIN_ID_NAME_LETTER_MAP } from './constants';
const chainIdKeys = Object.keys(CHAIN_ID_NAME_LETTER_MAP);

const CurrentCoin = ({
  coinAddress,
  coinSymbol,
  currentChainId,
  children,
  diameter,
  useOut = false,
  selectable = false,
  onChange = (token) => {},
}) => {
  const nativeCurrency = useSelector(getNativeCurrency);
  const tokens = useSelector(getTokens);
  const [tokenMenu, setTokenMenu] = useState(false);
  const anchorElement = useRef(null);
  const toggleTokenMenu = useCallback(() => setTokenMenu(!tokenMenu), [
    tokenMenu,
  ]);
  const selectToken = useCallback(
    (token) => {
      onChange(token);
      toggleTokenMenu();
    },
    [onChange, toggleTokenMenu],
  );
  const currencyName = useMemo(() => {
    if (useOut) {
      return coinSymbol;
    }

    if (coinAddress === ethers.constants.AddressZero || !coinAddress) {
      return nativeCurrency;
    }

    const token = tokens.find(
      ({ address }) => address.toLowerCase() === coinAddress.toLowerCase(),
    );

    if (token) {
      return token.symbol;
    }

    if (coinSymbol) {
      return coinSymbol;
    }

    return 'UNKOWN';
  }, [tokens, nativeCurrency, coinSymbol, coinAddress, useOut]);
  const allTokens = useMemo(() => {
    return [
      {
        address: ethers.constants.AddressZero,
        symbol: nativeCurrency,
      },
    ].concat(tokens);
  }, [nativeCurrency, tokens]);
  return (
    <div className="cross-chain__current-token">
      <div className="cross-chain__current-token-image">
        <TokenImage
          symbol={coinSymbol ?? currencyName}
          address={coinAddress}
          size={diameter ?? 50}
          chainId={currentChainId}
          showLetter
        />
      </div>
      <div className="cross-chain__current-token-name">
        <div className="cross-chain__current-token-name-text">
          {currencyName}
          {selectable && (
            <>
              <div
                className="cross-chain__token-switcher-trigger"
                ref={(el) => (anchorElement.current = el)}
                onClick={toggleTokenMenu}
              ></div>
              {tokenMenu && (
                <Menu
                  className="cross-chain__token-menu"
                  anchorElement={anchorElement.current}
                  onHide={toggleTokenMenu}
                >
                  {allTokens.map((token) => (
                    <MenuItem
                      key={token.address}
                      className={classnames([
                        'token-item',
                        coinAddress === token.address && 'active',
                      ])}
                      onClick={() => selectToken(token)}
                    >
                      <TokenImage
                        symbol={token.symbol}
                        address={token.address}
                        size={26}
                        chainId={currentChainId}
                      />
                      <div className="token-name">{token.symbol}</div>
                    </MenuItem>
                  ))}
                </Menu>
              )}
            </>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default CurrentCoin;
