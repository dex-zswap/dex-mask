const { Dexie } = global

const dexMaskDataBase = new Dexie('dex-mask-database')

dexMaskDataBase.version(1).stores({
  transactions: '++id, tokenAddress, chainId, fromAddress, toAddress, timestamp'
})

export default dexMaskDataBase
