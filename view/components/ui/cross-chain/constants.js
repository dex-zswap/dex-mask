import {
  BSC_CHAIN_ID,
  AVAX_CHAIN_ID,
  GOERLI_CHAIN_ID,
  KOVAN_CHAIN_ID,
  MAINNET_CHAIN_ID,
  RINKEBY_CHAIN_ID,
  ROPSTEN_CHAIN_ID,
} from '@shared/constants/network';


export const CHAIN_ID_NAME_LETTER_MAP = {
  [MAINNET_CHAIN_ID]: 'E',
  [ROPSTEN_CHAIN_ID]: 'R',
  [RINKEBY_CHAIN_ID]: 'R',
  [GOERLI_CHAIN_ID]: 'G',
  [KOVAN_CHAIN_ID]: 'K',
  [BSC_CHAIN_ID]: 'B',
  [AVAX_CHAIN_ID]: 'A'
};

export const CHAIN_ID_NAME_MAP = {
  [MAINNET_CHAIN_ID]: 'ETH',
  [ROPSTEN_CHAIN_ID]: 'ROSTEN',
  [RINKEBY_CHAIN_ID]: 'RINKEBY',
  [GOERLI_CHAIN_ID]: 'GOERLI',
  [KOVAN_CHAIN_ID]: 'KOVAN',
  [BSC_CHAIN_ID]: 'BSC',
  [AVAX_CHAIN_ID]: 'AVAX'
};


export const CHAIN_ID_TYPE_MAP = {
  [MAINNET_CHAIN_ID]: 'mainnet',
  [ROPSTEN_CHAIN_ID]: 'ropsten',
  [RINKEBY_CHAIN_ID]: 'rinkeby',
  [GOERLI_CHAIN_ID]: 'goerli',
  [KOVAN_CHAIN_ID]: 'kovan',
  [BSC_CHAIN_ID]: 'bscMainnet',
  [AVAX_CHAIN_ID]: 'avaxMainnet'
};
