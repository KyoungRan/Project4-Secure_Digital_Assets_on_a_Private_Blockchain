/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

  constructor() {
    this.bd = new LevelSandbox.LevelSandbox();
    // this.generateGenesisBlock();
  }

  // Helper method to create a Genesis Block (always with height= 0)
  // You have to options, because the method will always execute when you create your blockchain
  // you will need to set this up statically or instead you can verify if the height !== 0 then you
  // will not create the genesis block
  // generateGenesisBlock(){
  //   // Add your code here
  //   try {
  //     this.getBlockHeight().then((height) => {
  //       if(height === -1) {
  //         this.addBlock(new Block.Block('First block in the chain - Genesis block')).then((result) => {
  //           console.log(result);
  //           console.log('Genesis block added!')
  //         });
  //       }
  //     })
  //   } catch(err) {
  //     console.log(err);
  //   }
  // }

  // Get block height, it is a helper method that return the height of the blockchain
  async getBlockHeight() {
    // Add your code here
    try {
      // console.log('getBlockCount: ', await this.bd.getBlocksCount());
      return await this.bd.getBlocksCount();
    } catch(err) {
      throw new Error(err);
    }
  }

  // Add new block
  async addBlock(block) {
    // Add your code here
    try {
      const previousBlockHeight = await this.bd.getBlocksCount();
      // console.log('previousBlockHeight:   ', previousBlockHeight);
      block.height = previousBlockHeight + 1;
      // console.log('block.height: ', block.height);
      block.time = new Date().getTime().toString().slice(0, -3);

      if(block.height > 0) {
        let previousBlock = await this.getBlock(previousBlockHeight);
        block.previousBlockHash = previousBlock.hash;
        // console.log('block.previousBlockHash', block.previousBlockHash);
      }
        block.hash = SHA256(JSON.stringify(block)).toString();
        // console.log('block hash: ', SHA256(JSON.stringify(block.hash)).toString());
        // console.log('block height', block.height);
        // console.log('json', JSON.stringify(block).toString());
        return await this.bd.addLevelDBData(block.height, JSON.stringify(block).toString());
      } catch(err) {
        throw new Error(err);
      }
  }

  // Get Block By Height
  async getBlock(height) {
    // Add your code here
    try {
      // console.log(JSON.parse(await this.bd.getLevelDBData(height)));
      return JSON.parse(await this.bd.getLevelDBData(height));
    } catch(err) {
      throw new Error(err);
    }
  }

  // Validate if Block is being tampered by Block Height
  async validateBlock(height) {
    // Add your code here
    try {
      // get block object
      let block = await this.getBlock(height);
      // get block hash
      let blockHash = block.hash;
      // remove block hash to test block integrity
      block.hash = '';
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(block)).toString();
      // Compare
      return new Promise((reslove, reject) => {
        if(blockHash === validBlockHash) {
          reslove(true);
        } else {
          console.log('Block #' + height + ' invalid hash:\n' + blockHash + '<>' + validBlockHash);
          reslove(false);
        }
      })
    } catch(err) {
      throw new Error(err);
    }
  }

  // Get Block By Hash
  async getBlockByHash(hash) {
    try {
      // console.log('this.bd.getBlockByHah(hash);', await this.bd.getBlockByHash(hash));
      return await this.bd.getBlockByHash(hash);
    } catch(err) {
      throw new Error(err);
    }
  }

  // Get Block By WalletAddress
  async getBlockByWalletAddress(address) {
    try {
      // console.log('address', address);
      // console.log('JSON.parse(await this.bd.getBlockByWalletAddress(address));', await this.bd.getBlockByWalletAddress(address));
      return await this.bd.getBlockByWalletAddress(address);
      
    } catch(err) {
      throw new Error(err);
    }
  }

  // Validate Blockchain
  async validateChain() {
    // Add your code here
    try {
      let errorLog = [];
      const height = await this.bd.getBlocksCount();

      for (let i = 0; i < height; i++) {
        this.getBlock(i).then(async (block) => { 
          // validate block
          if(!this.validateBlock(block.height)) {
            errorLog.push(i);
          };
          // compare blocks hash link
          let blockHash = await this.bd.getLevelDBData(i).hash;
          let previousHash = await this.bd.getLevelDBData(i+1).previousBlockHash;
          if(blockHash !== previousHash) {
            errorLog.push(i);
          }
        })
      }
            
      if(errorLog.length > 0) {
        console.log('Block errors = ' + errorLog.length);
        console.log('Blocks: ' + errorLog);
      } else {
        console.log('No errors detected');
      }
    } catch(err) {
      throw new Error(err);
    }
        
  }

  // Utility Method to Tamper a Block for Test Validation
  // This method is for testing purpose
  _modifyBlock(height, block) {
    let self = this;
    return new Promise( (resolve, reject) => {
      self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
        resolve(blockModified);
      }).catch((err) => { console.log(err); reject(err)});
    });
  }
   
}

module.exports = Blockchain;
