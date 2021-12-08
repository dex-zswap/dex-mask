import { getNativeCurrency } from '@reducer/dexmask/dexmask';
import { getCurrentChainId, getSelectedAccount } from '@selectors/selectors';
import { NETWORK_TO_NAME_MAP } from '@shared/constants/network';
import { CROSSCHAIN_ROUTE } from '@view/helpers/constants/routes';
import { checkTokenBridge } from '@view/helpers/cross-chain-api';
import { toBnString } from '@view/helpers/utils/conversions.util';
import { useFetch } from '@view/hooks/useFetch';
import { useI18nContext } from '@view/hooks/useI18nContext';
import { updateCrossChainState } from '@view/store/actions';
import { ethers } from 'ethers';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

export default function CrossChainBtn() {
  const t = useI18nContext();
  const history = useHistory();
  const dispatch = useDispatch();
  const chainId = useSelector(getCurrentChainId);
  const selectedAccount = useSelector(getSelectedAccount);
  const nativeCurrency = useSelector(getNativeCurrency);
  const provider = useSelector((state) => state.metamask.provider);

  const { loading, error, res } = useFetch(
    () =>
      checkTokenBridge({
        meta_chain_id: toBnString(chainId),
        token_address: ethers.constants.AddressZero,
      }),
    [chainId],
  );

  const supportCrossChain = useMemo(() => {
    if (loading || error || res?.c !== 200) {
      return false;
    }

    return res?.d?.length;
  }, [loading, error, res]);

  const defaultTargetChain = useMemo(
    () => (supportCrossChain ? res.d[0] : null),
    [supportCrossChain, res],
  );

  return (
    <>
      {supportCrossChain ? (
        <div className="cross-chain-transfer-button">
          <div
            className="cross-chain-transfer-button__button"
            onClick={() => {
              const destChain = ethers.BigNumber.from(
                defaultTargetChain.target_meta_chain_id,
              ).toHexString();
              dispatch(
                updateCrossChainState({
                  coinAddress: ethers.constants.AddressZero,
                  targetCoinAddress: defaultTargetChain.target_token_address,
                  coinSymbol: nativeCurrency,
                  targetCoinSymbol: defaultTargetChain.target_token,
                  from: selectedAccount.address,
                  fromChain: chainId,
                  target: defaultTargetChain,
                  destChain,
                  supportChains: [],
                  chainTokens: [],
                }),
              );
              history.push(CROSSCHAIN_ROUTE);
            }}
          >
            {t('InterBlockchain', [
              NETWORK_TO_NAME_MAP[provider.type] || provider.type,
            ])}
          </div>
        </div>
      ) : null}
    </>
  );
}
