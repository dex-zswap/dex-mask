import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import { ethers } from 'ethers';
import { Menu, MenuItem } from '@c/ui/menu';
import TokenImage from '@c/ui/token-image';
import { getNativeCurrency } from '@reducer/dexmask/dexmask';
import { getAllSupportBridge } from '@view/helpers/cross-chain-api';
import { toBnString } from '@view/helpers/utils/conversions.util';
import { CHAIN_ID_NAME_LETTER_MAP } from './constants';
const chainIdKeys = Object.keys(CHAIN_ID_NAME_LETTER_MAP);

const CurrentCoinCross = ({
  coinAddress,
  coinSymbol,
  currentChainId,
  children,
  diameter,
  useOut = false,
  selectable = false,
  onChange = token => {}
}) => {
  const [tokens, setToken] = useState([]);
  const nativeCurrency = useSelector(getNativeCurrency);
  const [tokenMenu, setTokenMenu] = useState(false);
  const anchorElement = useRef(null);
  const toggleTokenMenu = useCallback(() => setTokenMenu(!tokenMenu), [tokenMenu]);
  const selectToken = useCallback(token => {
    onChange(token);
    toggleTokenMenu();
  }, [onChange, toggleTokenMenu]);
  const currencyName = useMemo(() => {
    if (useOut) {
      return coinSymbol;
    }

    if (coinAddress === ethers.constants.AddressZero || !coinAddress) {
      return nativeCurrency;
    }

    const token = tokens.find(({
      token_address
    }) => token_address.toLowerCase() === coinAddress.toLowerCase());

    if (token) {
      return token.token;
    }

    return 'UNKOWN';
  }, [tokens, nativeCurrency, coinSymbol, coinAddress, useOut]);
  useEffect(() => {
    getAllSupportBridge({
      offset: 0,
      limit: 1000000
    }).then(res => res.json()).then(res => {
      if (res.c === 200) {
        const supportTokens = res.d.filter(({
          meta_chain_id
        }) => toBnString(meta_chain_id) === toBnString(currentChainId));
        setToken(supportTokens);
      }
    });
  }, [currentChainId]);
  return <div className="cross-chain__current-token">
      <div className="cross-chain__current-token-image">
        <TokenImage symbol={coinSymbol ?? currencyName} address={coinAddress} size={diameter ?? 50} chainId={currentChainId} showLetter />
      </div>
      <div className="cross-chain__current-token-name">
        <div className="cross-chain__current-token-name-text">
          {currencyName}
          {selectable && <>
              <div className="cross-chain__token-switcher-trigger" ref={el => anchorElement.current = el} onClick={toggleTokenMenu}></div>
              {tokenMenu && <Menu className="cross-chain__token-menu" anchorElement={anchorElement.current} onHide={toggleTokenMenu}>
                  {tokens.map(token => <MenuItem key={token.token_address} className={classnames(['token-item', coinAddress === token.token_address && 'active'])} onClick={() => selectToken(token)}>
                      <TokenImage symbol={token.token} address={token.token_address} size={26} chainId={currentChainId} />
                      <div className="token-name">{token.token}</div>
                    </MenuItem>)}
                </Menu>}
            </>}
        </div>
        {children}
      </div>
    </div>;
};

export default CurrentCoinCross;