// const SHA256 = require('crypto-js/sha256');
const Blockchain = require('./BlockChain.js');
const Block = require('./Block.js');
const RequestObject = require('./RequestObject');
const ValidRequest = require('./ValidRequest');

const blockchain = new Blockchain();

class StarNataryController {

  constructor(app, mempool) {
    this.app = app;
    this.mempool = mempool;
    this.postRequestValidation();
    this.postValidateMessageSignature();
  }

  /**
  ** API POST Endpoint to validate request with JSON response.
  ** Post a new Request Object with data payload option to add a wallet address to the Request Object array. 
  ** The response for the endpoint should provide request object in JSON format.
  ** URL: http://localhost:8000/requestValidation
  */
  async postRequestValidation() {
    this.app.post('/requestValidation', async(req, res, next) => {
      try {
        let walletAddress = req.body.address;
        // Check req Validation
        if(walletAddress === '' || walletAddress === undefined) {
          res.status(404).json({
            "status": 404,
            "message": "Please write the address!!"
          })
        } else {
          this.mempool.findRequestByWalletAddress(walletAddress).then(result => {
            if(result) {
              res.status(200).json(result);
            } else {
              this.mempool.addRequestValidation(walletAddress).then(result => {
                res.status(200).json(result);
              });
            }

          })
          // let result = await this.mempool.addRequestValidation(new RequestObject(walletAddress));
          // // console.log('postRequestValidation result',  result);
          // if(result) {
          //   res.status(200).json(result)
          // } else {
          //   res.status(404).json({
          //     "status": 404,
          //     "message": "it is wrong!"
          //   })
          // }
        }
      } catch(err) {
        throw new Error(err);;
      }
    })
  }

  /**
  ** API POST Endpoint validates message signature with JSON response
  ** Post a new Vaild Request with data payload option to add data to the Valid Request. 
  ** The response for the endpoint should provide object in JSON format.
  ** URL: http://localhost:8000/message-signature/validate
  */ 
  async postValidateMessageSignature() {

    this.app.post('/message-signature/validate', async(req, res, next) => {
      try {
        // Check req Validation
        let walletAddress = req.body.address;
        let signature = req.body.signature;

        if(walletAddress && signature) {
          
          this.mempool.findValidRequestByWalletAddress(walletAddress).then(validObj => {
            if(validObj) {
              // console.log('findrequestbywalletaddress memObj: ', validObj);
              res.status(200).json(validObj)
            } else {
              
              this.mempool.findRequestByWalletAddress(walletAddress).then(reqObj => {
                console.log('findRequestBywLLAETADDRESS requet obj:', reqObj);
                if(!reqObj) {
                  res.json({
                    "status": 404,
                    "message": "RequestObject not found!"
                  })
                } else {

                  this.mempool.validateRequestByWallet(reqObj, signature).then(result => {
                    // if(result) {
                      res.status(200).json(result) 
                  })
                }
              }) 
            }
          });

        } else {
          res.json({
            "status": 404,
            "message": "Please Write the address and signature!"
          })
        };

      } catch(err) {
        throw new Error(err);
      }
    })
  }

}


/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app, mempool) => { return new StarNataryController(app, mempool);}