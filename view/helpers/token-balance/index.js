import Decimal from 'decimal.js';
import { ethers } from 'ethers';
import Eth from 'ethjs';
import TOKEN_ABI from 'human-standard-token-abi';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { CHAIN_ID_TO_RPC_URL_MAP } from '@shared/constants/network';
import { toBnString } from '@view/helpers/utils/conversions.util';

export async function getTokenBalance({
  tokenAddress,
  wallet,
  isNativeAsset,
  chainId,
  fixed,
}) {
  const provider = CHAIN_ID_TO_RPC_URL_MAP[toBnString(chainId)];
  const web3Provider = new Web3.providers.HttpProvider(provider);

  if (isNativeAsset) {
    const ether = new ethers.providers.Web3Provider(web3Provider);
    const balance = await ether.getBalance(wallet);
    const num = await ethers.utils.formatEther(balance);
    const demical = new Decimal(num);
    return demical.toFixed(fixed);
  } else {
    const ethInstance = new Eth(web3Provider);
    const contract = ethInstance.contract(TOKEN_ABI).at(tokenAddress);
    const decimals = await contract.decimals();
    const result = await contract.balanceOf(wallet);
    const num = await ethers.utils.formatEther(
      result[0].toString(),
      decimals[0].toString(),
    );
    const demical = new Decimal(num);
    return demical.toFixed(fixed);
  }
}

export default function useTokenBalance({
  tokenAddress,
  wallet,
  isNativeAsset,
  chainId,
  fixed = 6,
}) {
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    setBalance('0');
    getTokenBalance({
      tokenAddress,
      wallet,
      isNativeAsset,
      chainId,
      fixed,
    }).then((res) => {
      setBalance(res);
    });
  }, [tokenAddress, wallet, isNativeAsset, chainId, fixed]);

  return balance;
}
