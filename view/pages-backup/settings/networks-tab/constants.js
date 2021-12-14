import {
  GOERLI,
  GOERLI_CHAIN_ID,
  GOERLI_RPC_URL,
  KOVAN,
  KOVAN_CHAIN_ID,
  KOVAN_RPC_URL,
  MAINNET,
  MAINNET_CHAIN_ID,
  MAINNET_RPC_URL,
  RINKEBY,
  RINKEBY_CHAIN_ID,
  RINKEBY_RPC_URL,
  ROPSTEN,
  ROPSTEN_CHAIN_ID,
  ROPSTEN_RPC_URL,
  BSC_MAINNET,
  BSC_CHAIN_ID,
  BSC_RPC_URL,
  DEX_MAINNET,
  DEX_CHAIN_ID,
  DEX_RPC_URL
} from '@shared/constants/network';

const defaultNetworksData = [
  {
    labelKey: MAINNET,
    iconColor: '#29B6AF',
    providerType: MAINNET,
    rpcUrl: MAINNET_RPC_URL,
    chainId: MAINNET_CHAIN_ID,
    ticker: 'ETH',
    blockExplorerUrl: 'https://etherscan.io',
  },
  {
    labelKey: BSC_MAINNET,
    iconColor: '#69e71b',
    providerType: BSC_MAINNET,
    rpcUrl: BSC_RPC_URL,
    chainId: BSC_CHAIN_ID,
    ticker: 'BNB',
    blockExplorerUrl: 'https://bscscan.com',
  },
  {
    labelKey: DEX_MAINNET,
    iconColor: '#69e71b',
    providerType: DEX_MAINNET,
    rpcUrl: DEX_RPC_URL,
    chainId: DEX_CHAIN_ID,
    ticker: 'DEX',
    blockExplorerUrl: 'https://explorer.testnet.dex.io',
  },
  {
    labelKey: ROPSTEN,
    iconColor: '#FF4A8D',
    providerType: ROPSTEN,
    rpcUrl: ROPSTEN_RPC_URL,
    chainId: ROPSTEN_CHAIN_ID,
    ticker: 'ETH',
    blockExplorerUrl: 'https://ropsten.etherscan.io',
  },
  {
    labelKey: RINKEBY,
    iconColor: '#F6C343',
    providerType: RINKEBY,
    rpcUrl: RINKEBY_RPC_URL,
    chainId: RINKEBY_CHAIN_ID,
    ticker: 'ETH',
    blockExplorerUrl: 'https://rinkeby.etherscan.io',
  },
  {
    labelKey: GOERLI,
    iconColor: '#3099f2',
    providerType: GOERLI,
    rpcUrl: GOERLI_RPC_URL,
    chainId: GOERLI_CHAIN_ID,
    ticker: 'ETH',
    blockExplorerUrl: 'https://goerli.etherscan.io',
  },
  {
    labelKey: KOVAN,
    iconColor: '#9064FF',
    providerType: KOVAN,
    rpcUrl: KOVAN_RPC_URL,
    chainId: KOVAN_CHAIN_ID,
    ticker: 'ETH',
    blockExplorerUrl: 'https://kovan.etherscan.io',
  },
];

export { defaultNetworksData };