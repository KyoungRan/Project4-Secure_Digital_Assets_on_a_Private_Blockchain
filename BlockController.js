const hex2ascii = require('hex2ascii');
const Blockchain = require('./BlockChain.js');
const Block = require('./Block.js');
// const Mempool = require('./Mempool.js');
const RequestObject = require('./RequestObject');
const ValidRequest = require('./ValidRequest');

const blockchain = new Blockchain();
// const mempool = new Mempool();

class BlockController {

  constructor(app, mempool) {
    this.app = app;
    this.mempool = mempool
    this.notFound();
    // this.initializeMockData();
    this.getBlockByIndex();
    this.postNewBlock();
    this.getBlockByHash();
    this.getBlockByWalletAddress();
  }

  // setTimeout = (() => {
  //   console.log("Waiting...")
  // }, 10000);

  notFound() {
    this.app.get('/', async (req, res) => {
      res.status(404).json({
        "status": 404,
        "message": "Page not found. GET: http://localhost:8000/block/{BLOCK_HEIGHT}, POST: http://localhost:8000/block"
      });
    });
  }
  
  /*
  ** GET Block Endpoint
  ** Configure a GET request using URL path with a block height parameter. 
  ** The response for the endpoint should provide block object is JSON format.
  ** URL: http://localhost:8000/block/[blockheight] 
  */
  getBlockByIndex() {
    this.app.get("/block/:blockheight", async (req, res, next) => {
      try {
        const block = await blockchain.getBlock(req.params.blockheight);
        if(block === undefined) {
          // res.setHeader("Content-Type", "application/json");
          res.status(404).json({
            "status": 404,
            "message": "Block does not exist!"
          });
        } else {
          // res.setHeader("Content-Type", "application/json");
          block.body.star.storyDecoded = hex2ascii(block.body.star.story)
          res.status(200).json({
            "status": 200,
            "message": "Success Response",
            "json": block
          });
        }
      } catch(err) {
        throw new Error(err);
      }
    });
  }

  /**
  ** POST Block Endpoint
  ** Post a new block with data payload option to add data to the block body. 
  ** The block body should support a string of text. 
  ** The response for the endpoint should provide block object in JSON format.
  ** URL: http://localhost:8000/block
  */
  postNewBlock() {
    this.app.post("/block", async (req, res, next) => {
    console.log(req.body);
      try {
        let address = req.body.address;
        let star = req.body.star;
        let RA = star.ra;
        let DEC = star.dec;
        let MAG = star.mag;
        let CEN = star.cen;
        // Check req Validation
        if(!req.body && !address && !RA && !DEC && !star.story) {
          res.status(404).json({
            "status": 404,
            "message": "Please fill the body parameter!!"
          })
        } else {
          let validRequest = await this.mempool.findValidRequestByWalletAddress(address);
          let body = {
            "address": address,
            "star": {
              ra: RA,
              dec: DEC,
              mag: MAG,
              cen: CEN,
              story: Buffer.from(star.story).toString('hex')
            }
          }
          let block = new Block.Block(body);
          if(validRequest) {
            await blockchain.addBlock(block).then(result => {
              if(result) {
                this.mempool.removeValidRequest(address);
                this.mempool.removeValidationRequest(address);
    
                const block = JSON.parse(result);

                block.body.star.storyDecoded = hex2ascii(block.body.star.story);
                // block.body.star.storyDecoded = Buffer(block.body.star.story, 'hex').toString();
                res.status(200).json({
                  "status": 200,
                  "message": "Success Response!",
                  "json": block
                })
              }
            })

          } else {
            res.status(404).json({
              "status": 404,
              "message": "Valid request not found!"
            })
          }
        }

      } catch(err) {
        throw new Error(err);
      }
    });
  }

  /*
  ** GET Block Endpoint
  ** Configure a GET request using URL path with a hash parameter. 
  ** The response for the endpoint should provide block object is JSON format.
  ** URL: http://localhost:8000/stars/hash::hash
  */
  getBlockByHash() {
    this.app.get("/stars/hash::hash", async (req, res, next) => {
      try {
        
        if(req.params.hash === undefined) {
          res.status(404).json({
            "status": 404,
            "message": "Hash does not exist!"
          })
        } else {
          const block = await blockchain.getBlockByHash(req.params.hash);
          block.body.star.storyDecoded = hex2ascii(block.body.star.story);
          console.log('getBlockByHash block', block)
          res.status(200).json({
            "Status": 200,
            "message": "Success Response",
            "json": block
          })
        }
      } catch(err) {
        throw new Error(err);
      }
    })
  }

  /*
  ** GET Block Endpoint
  ** Configure a GET request using URL path with an address parameter. 
  ** The response for the endpoint should provide block object is JSON format.
  ** URL: http://localhost:8000/stars/address::address
  */
  getBlockByWalletAddress() {
    this.app.get("/stars/address::address", async (req, res, next) => {
      try {
        if(req.params.address === undefined) {
          res.status(404).json({
            "status": 404,
            "message": "Address does not exist!"
          })
        } else {
          const block = await blockchain.getBlockByWalletAddress(req.params.address);
          // console.log('getBlockByWalletAddress block', block)
          res.status(200).json({
            "Status": 200,
            "message": "Success Response",
            "json": block
          })
        }
      } catch(err) {
        throw new Error(err);
      }
    })
  }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
    // initializeMockData() {
     
    //   setTimeout(async () => {
    //     console.log(await blockchain.getBlockHeight());
    //     if(await blockchain.getBlockHeight() === 0) {
    //       for (let i = 0; i < 10; i++) {
    //         let blockTest = new Block.Block("Test Block - " + (i + 1));
    //         await blockchain.addBlock(blockTest).then((result) => {
    //           console.log(result);
    //         })
    //       }
    //     }
    //   }, 10000);
    // }

}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app, mempool) => { return new BlockController(app, mempool);}