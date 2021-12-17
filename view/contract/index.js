import { abi as FACTORY_ABI } from './abi-json/factory.json';
import { abi as ROUTER_ABI } from './abi-json/router.json';
import { ZSWAP_FACTORY_ADDRESS, ZSWAP_ROUTE_ADDRESS } from './address';
export const getRouterContract = () => global.eth.contract(ROUTER_ABI).at(ZSWAP_ROUTE_ADDRESS);
export const getFactotyContract = () => global.eth.contract(FACTORY_ABI).at(ZSWAP_FACTORY_ADDRESS);