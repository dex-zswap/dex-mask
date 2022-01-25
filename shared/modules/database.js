class DexMaskDataBase {
  async initDB() {
    const db = await global.idb.openDB('dex-mask-database', 2, {
      upgrade(db) {
        const store = db.createObjectStore('transactions', {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('tokenAddress', 'tokenAddress');
        store.createIndex('chainId', 'chainId');
        store.createIndex('fromAddress', 'fromAddress');
        store.createIndex('toAddress', 'toAddress');
        store.createIndex('timestamp', 'timestamp');
      }
    });

    this.db = db;
    return db;
  }

  async getDBInstance() {
    return this.db ?? await this.initDB();
  }
}

export default new DexMaskDataBase
