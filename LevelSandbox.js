/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';
const hex2ascii = require('hex2ascii');

class LevelSandbox {

    constructor() {
        this.db = level(chainDB);
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key){
        let self = this;
        return new Promise((resolve, reject) => {
            // Add your code here, remember in Promises you need to resolve() or reject()
            self.db.get(key, (err, value) => {
                if (err) {
                  if(err.type == 'Not FoundError') {
                      resolve(undefined);
                  } else {
                      console.log('Block ' + key + ' get failed', err);
                      reject(err);
                  }
                } else {
                    resolve(value);
                }
              });
        });
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        let self = this;
        return new Promise((resolve, reject) => {
            // Add your code here, remember in Promises you need to resolve() or reject() 
            self.db.put(key, value, (err) => {
                if (err) {
                  console.log('Block ' + key + ' submission failed', err);
                  reject(err);
                }
                console.log("Added Block # ", key);
                resolve(value);
              });
        });
    }


    // Method that return the height
    getBlocksCount() {
        let self = this;
        return new Promise((resolve, reject) => {
            // Add your code here, remember in Promises you need to resolve() or reject()
            let count = -1;
            self.db.createReadStream()
            .on('data', (data) => {
                count++;
            })
            .on('error', (err) => {
                reject(err);
            })
            .on('close', () => {
                resolve(count);
            });
        });
    }

    // Get data from levelDB with hash (Promise) 
    getBlockByHash(hash) {
        let self = this;
        let block = null;
        console.log('hash', hash);
        return new Promise((resolve, reject) => {
        self.db.createReadStream()
            .on('data', (data) => {
                if(JSON.parse(data.value).hash === hash) {
                    block = JSON.parse(data.value);
                    // block.body.star.storyDecoded = hex2ascii(block.body.star.story)
                }
            })
            .on('error', (err) => {
                reject(err);
            })
            .on('close', () => {
                resolve(block);
            })
        })
    }

    // Get data from levelDB with WalletAddress (Promise)
    getBlockByWalletAddress(address) {
        let self = this;
        let blocks = [];
        // console.log('address', address);
        return new Promise((resolve, reject) => {
        self.db.createReadStream()
            .on('data', (data) => {
                if(JSON.parse(data.value).body.address === address) {
                    let block = JSON.parse(data.value);
                    block.body.star.storyDecoded = hex2ascii(block.body.star.story)
                    blocks.push(block);
                }
            })
            .on('error', (err) => {
                reject(err);
            })
            .on('close', () => {
                resolve(blocks);
            })
        })
    }

}

module.exports.LevelSandbox = LevelSandbox;
