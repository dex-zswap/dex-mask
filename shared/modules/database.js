const { Dexie } = global

const dexMaskDataBase = new Dexie('dex-token-transition')

dexMaskDataBase.version(1).store({
  transitions: '++id, token_address, date, chain_id, from_address, to_address'
})

export default dexMaskDataBase
