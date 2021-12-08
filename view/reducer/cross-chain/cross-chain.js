import { ethers } from 'ethers';

import MINTABLE_ABI from '@shared/contract-abis/mintable';
import * as actionConstants from '@view/store/actionConstants';

import {
  displayWarning,
  showConfTxPage
} from '@view/store/actions';

export default function crossChainReducer(state = {}, action) {
  const crossChainState = {
    coinAddress: '',
    coinSymbol: '',
    from: '',
    dest: '',
    fromChain: '',
    destChain: '',
    userInputValue: '',
    supportChains: [],
    target: null,
    ...state,
  };

  switch (action.type) {
    case actionConstants.UPDATE_CROSS_CHAIN_STATE:
      return { ...crossChainState, ...action.value };

    default:
      return crossChainState;
  }
}