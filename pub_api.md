# 桥管理平台API

[TOC]

## 修订信息

| 版本  | 时间       | 修订人        | 修订内容                   |
|-------|------------|---------------|----------------------------|
| 0.9.0 | 2021-6-1 | lukamagic | 创建文档   |


### 1.前言：
测试链接   http://47.57.239.181:18526/ ，请求都以post链接

### 2.签名规则：
无

### 3.具体接口




#### 3.1 获取主网络参数  /getChainList  [post]  （例如 http://47.57.239.181:18526/getChainList）


**基础参数**


**请求参数**

| 参数名称                       | 类型   | 是否可空 | 描述                                          |
|--------------------------------|--------|----------|-----------------------------------------------|



**响应参数**

| 参数名称                       | 类型   | 是否可空 | 描述                                          |
|--------------------------------|--------|----------|----------------------------------------------|
| name         | string | 是       | 节点名                                    |
| symbol         | string | 否      | symbol    |
| gateway         | string | 是      | 节点地址  |
| chain_id         | string | 是      | 在桥中节点唯一ID （组建跨链交易所需参数）  |
| meta_chain_id         | string | 是      | 在metamask钱包中填写的chainID  |
| fee         | string | 是      | 所需手续费（组建跨链交易所需参数）  |
| bridge         | string | 是      | 桥合约地址（组建跨链交易所需参数）   |
| handler         | string | 是      | erc20 hander 合约地址（组建跨链交易所需参数）   |


请求实例
``` json 
{
  
}


```


返回实例
``` json 
{
    "c": 200,
    "d": [
        {
            "name": "Rinkeby_ETH",
            "symbol": "Rinkeby_ETH",
            "gateway": "https://rinkeby-light.eth.linkpool.io/",
            "chain_id": "0",
            "meta_chain_id": "4",
            "fee": "0.001",
            "bridge": "0x0a37cE3d058302986742349eA6D2b4EE3046dcBD",
            "handler": "0x9F200CDF58CE82FdD9903f93aE6894475bf5542E"
        },
        {
            "name": "Testnet_DEX",
            "symbol": "Testnet_DEX",
            "gateway": "https://rpc.testnet.dex.io/",
            "chain_id": "1",
            "meta_chain_id": "3603102",
            "fee": "0.001",
            "bridge": "0x9F200CDF58CE82FdD9903f93aE6894475bf5542E",
            "handler": "0xEBee5e2258Cd522BF45891fC3FA8e263c07f4553"
        },
        {
            "name": "Rinkeby_ETH_2",
            "symbol": "Rinkeby_ETH_2",
            "gateway": "https://rinkeby-light.eth.linkpool.io/",
            "chain_id": "2",
            "meta_chain_id": "4",
            "fee": "0.001",
            "bridge": "0xf8Afb179CAa145AE2a9D76241ED33Be9c919D493",
            "handler": "0x4aA2769C759b7cE187d159C46266B13Ebe6c0B16"
        },
        {
            "name": "Testnet_DEX_2",
            "symbol": "Testnet_DEX_2",
            "gateway": "https://rpc.testnet.dex.io/",
            "chain_id": "3",
            "meta_chain_id": "3603102",
            "fee": "0.001",
            "bridge": "0x107793A33C5094298d0eAab91215250b05506560",
            "handler": ""
        }
    ]
}


```




#### 3.2 获取主网的目标跨链以及对应支持的合约 /getChainTargetList  [post]


**基础参数**


**请求参数**

| 参数名称                       | 类型   | 是否可空 | 描述                                          |
|--------------------------------|--------|----------|-----------------------------------------------|
| chain_id         | string | 是      | 在桥中节点唯一ID （组建跨链交易所需参数）  |


**响应参数**

| 参数名称                       | 类型   | 是否可空 | 描述                                          |
|--------------------------------|--------|----------|----------------------------------------------|
| name         | string | 是       | 目标节点名                                    |
| symbol         | string | 否      | 目标symbol    |
| gateway         | string | 是      | 目标节点地址  |
| chain_id         | string | 是      | 目标在桥中节点唯一ID （组建跨链交易所需参数）  |
| meta_chain_id         | string | 是      | 目标在metamask钱包中填写的chainID  |
| fee         | string | 是      | 目标所需手续费（组建跨链交易所需参数）  |
| bridge         | string | 是      | 目标桥合约地址（组建跨链交易所需参数）   |
| handler         | string | 是      | 目标erc20 hander 合约地址（组建跨链交易所需参数）   |
| contract_list         | jsonarray | 是      | 具体支持的合约（对于本节点而言）  |
| --max         | string | 是      | 最大值  |
| --min         | string | 是      | 最小值  |
| --resource_id         | string | 是      | 合约对桥唯一资源ID  （组建跨链交易所需参数） |
| --contract         | json | 是      | 具体合约内容|
| ---- name         | string | 是      | 名称|
| ---- decimals         | int | 是      | 精度|
| ---- address         | int | 是      | 合约地址  （组建跨链交易所需参数） |
| ---- token         | int | 是        | 合约token标识 （组建跨链交易所需参数） |




请求实例
``` json 
{
    "chain_id":"0"
}


```


返回实例
``` json 
{
    "c": 200,
    "d": [
        {
            "name": "Testnet_DEX",
            "symbol": "Testnet_DEX",
            "gateway": "https://rpc.testnet.dex.io/",
            "chain_id": "1",
            "meta_chain_id": "3603102",
            "fee": "0.001",
            "bridge": "0x9F200CDF58CE82FdD9903f93aE6894475bf5542E",
            "handler": "0xEBee5e2258Cd522BF45891fC3FA8e263c07f4553",
            "contract_list": [
                {
                    "max": "1000000",
                    "min": "1",
                    "resource_id": "0x000000000000000000000000000000c76ebe4a02bbc34786d860b355f5a5ce04",
                    "contract": {
                        "id": 1434571642058571776,
                        "chain_id": "0",
                        "contract_id": "7f++9MoecDfxKTJsz5b8ROps47WXWYYT1saDWpGj4iQ=",
                        "symbol": "RINK_ETH",
                        "icon": "",
                        "name": "ZB Token 2",
                        "decimals": 18,
                        "address": "0x8c7277b4b28e73dff7d09533a13f794b42d319be",
                        "token": "ZBT2",
                        "protocol": "erc20",
                        "ctime": 1630863507175,
                        "utime": 0,
                        "state": 1
                    }
                }
            ]
        }
    ]
}


```




#### 3.3 获取主网价格 /getPrice  [post]


**基础参数**


**请求参数**

| 参数名称                       | 类型   | 是否可空 | 描述                                          |
|--------------------------------|--------|----------|-----------------------------------------------|
| symbol         | string | 否      | 主币标识  |
| token_address  | string | 是      | 合约地址（可空，空时请求主币价格）  |
| meta_chain_id  | string | 是      | metamask的 chain_id  |


**响应参数**

| 参数名称                       | 类型   | 是否可空 | 描述                                          |
|--------------------------------|--------|----------|----------------------------------------------|
| price         | string | 否       | 价格                                    |





请求实例
``` json 
{
    "symbol":"ETH",
    "token_address":"0xdac17f958d2ee523a2206206994597c13d831ec7"
}


```


返回实例
``` json 
{
    "c": 200,
    "d": {
        "price": "1.00029339971969"
    }
}

```



#### 3.4 检测token是否可跨链 /checkTokenBridge  [post]


**基础参数**


**请求参数**

| 参数名称                        | 类型   | 是否可空 | 描述                                          |
|--------------------------------|--------|----------|-----------------------------------------------|
| token_address                  | string | 否      | 合约地址  |
| meta_chain_id                  | string | 否      | metamask的chainID  |


**响应参数**

| 参数名称                       | 类型   | 是否可空 | 描述                                          |
|--------------------------------|--------|----------|----------------------------------------------|
| chain_id         | string | 否       | 跨链确定节点唯一chainID                                    |
| max         | string | 否       | 可夸最大值                                    |
| min         | string | 否       | 可夸最小值                                    |
| resource_id         | string | 否       | 资源ID                                    |
| fee         | string | 否       | 跨链所需要的主币额外费用（非矿工费，组件交易添加value）                                    |
| bridge         | string | 否       |桥地址                                    |
| handler         | string | 否       |handler 地址                                    |
| target_symbol         | string | 否       |目标唯一标识                                    |
| target_token_address         | string | 否       |目标合约地址                                    |
| target_meta_chain_id         | string | 否       |目标metamaskchainID                                    |
| target_chain_id         | string | 否       |目标 跨链确定节点唯一chainID                                |





  

请求实例
``` json 
{
    "token_address":"0x8c7277b4b28e73dff7d09533a13f794b42d319be"
}


```


返回实例
``` json 
{
    "c": 200,
    "d": [
        {
            "chain_id": "0",
            "max": "1000000",
            "min": "1",
            "resource_id": "0x000000000000000000000000000000c76ebe4a02bbc34786d860b355f5a5ce04",
            "fee": "0.001",
            "bridge": "0x0a37cE3d058302986742349eA6D2b4EE3046dcBD",
            "handler": "0x9F200CDF58CE82FdD9903f93aE6894475bf5542E",
            "target_symbol": "DEX",
            "target_token_address": "0xE9Cd25DB293C248cFcD8cb41A314aDD335c39264",
            "target_meta_chain_id": "3603102",
            "target_chain_id": "1"
        }
    ]
}
```




#### 3.5 获取资产图标 /getIcon  [post]


**基础参数**


**请求参数**

| 参数名称                       | 类型   | 是否可空 | 描述                                          |
|--------------------------------|--------|----------|-----------------------------------------------|
| symbol         | string | 否                | 主币标识        |
| token_address  | string | 是                | 合约地址（可空，空时请求主币价格）         |


**响应参数**

| 参数名称                       | 类型   | 是否可空 | 描述                                          |
|--------------------------------|-----------------|----------|----------------------------------------------|
| icon                           | string          | 否       | icon url                                    |





请求实例
``` json 
{
    "symbol":"ETH",
    "token_address":"0xdac17f958d2ee523a2206206994597c13d831ec7"
}


```


返回实例
``` json 
{
    "c": 200,
    "d": {
        "icon": "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png"
    }
}
```





#### 3.6 获取合约组（同类） /getTokenGroup  [post]


**基础参数**


**请求参数**

| 参数名称                        | 类型   | 是否可空 | 描述                                          |
|--------------------------------|--------|----------|-----------------------------------------------|
| token_address                  | string | 否      | 合约地址  |
| meta_chain_id                  | string | 否      | metamaskid  |


**响应参数**

| 参数名称                       | 类型   | 是否可空 | 描述                                          |
|--------------------------------|--------|----------|----------------------------------------------|
| symbol         | string | 否       | 主链标识                                    |
| name         | string | 否       | 主链名                                    |
| meta_chain_id         | string | 否       | metamaskid                                    |
| chain_id         | string | 否       | 链唯一                                    |
| token         | string | 否       |合约标识                                    |
| token_address         | string | 否       |目标合约地址                                    |
| token_name         | string | 否       |合约名                                    |







#### 3.7 获取首页支持的资产 /getIndexAssets  [post]


**基础参数**


**请求参数**

| 参数名称                        | 类型   | 是否可空 | 描述                                          |
|--------------------------------|--------|----------|-----------------------------------------------|
| offset                  | int | 是      | 可空，默认0  |
| limit                  | int | 是     | 可空，默认1000（一般不会超过）  |


**响应参数**

| 参数名称                       | 类型   | 是否可空 | 描述                                          |
|--------------------------------|--------|----------|----------------------------------------------|
| symbol         | string | 否       | 主链标识                                    |
| name         | string | 否       | 主链名                                    |
| meta_chain_id         | string | 否       | metamaskid                                    |
| chain_id         | string | 否       | 链唯一                                    |
| token         | string | 否       |合约标识                                    |
| token_address         | string | 否       |目标合约地址                                    |
| token_name         | string | 否       |合约名                                    |
| decimals         | int | 否       |精度                                    |


响应实例


```json

{
    "c": 200,
    "d": [
        {
            "symbol": "DEX",
            "name": "",
            "meta_chain_id": "3603102",
            "token_address": "0xe9cd25db293c248cfcd8cb41a314add335c39264",
            "token_name": "ZB Token 2",
            "token": "ZBT2",
            "icon": "",
            "decimals": 18
        },
        {
            "symbol": "DEX",
            "name": "",
            "meta_chain_id": "3603102",
            "token_address": "0x4964b2e4397dce0308d2cdba6697152341a6af30",
            "token_name": "Dex ETH",
            "token": "DETH",
            "icon": "",
            "decimals": 18
        }
    ]
}


```






#### 3.8 获取支持的跨链资产 /getAllSupportBridge（0地址为主币） [post]


**基础参数**


**请求参数**

| 参数名称                        | 类型   | 是否可空 | 描述                                          |
|--------------------------------|--------|----------|-----------------------------------------------|
| offset                  | int | 是      | 可空，默认0  |
| limit                  | int | 是     | 可空，默认1000（一般不会超过）  |


**响应参数**

| 参数名称                       | 类型   | 是否可空 | 描述                                          |
|--------------------------------|--------|----------|----------------------------------------------|
| symbol         | string | 否       | 主链标识                                    |
| name         | string | 否       | 主链名                                    |
| meta_chain_id         | string | 否       | metamaskid                                    |
| chain_id         | string | 否       | 链唯一                                    |
| token         | string | 否       |合约标识                                    |
| token_address         | string | 否       |目标合约地址（0地址为主币）                                |
| token_name         | string | 否       |合约名                                    |
| decimals         | int | 否       |精度                                    |





响应实例


```json

{
    "c": 200,
    "d": [
        {
            "symbol": "DEX",
            "name": "",
            "meta_chain_id": "3603102",
            "token_address": "0xe9cd25db293c248cfcd8cb41a314add335c39264",
            "token_name": "ZB Token 2",
            "token": "ZBT2",
            "icon": "",
            "decimals": 18
        },
        {
            "symbol": "DEX",
            "name": "",
            "meta_chain_id": "3603102",
            "token_address": "0x4964b2e4397dce0308d2cdba6697152341a6af30",
            "token_name": "Dex ETH",
            "token": "DETH",
            "icon": "",
            "decimals": 18
        }
    ]
}


```