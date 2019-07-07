const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');
const RequestObject = require('./RequestObject');
const ValidRequest = require('./ValidRequest');

const TimeoutRequestsWindowTime = 5*60*1000;
const TimeoutMempoolValidWindowTime = 30*60*1000;

class Mempool {
  constructor() {
    this.mempool = [];
    this.timeoutRequests = [];
    this.mempoolValid= [];
    this.timeoutMempoolValid = [];
  }

  async removeValidationRequest(walletAddress) {
    try {
      // console.log('removeValidationRequest walletAddress: ', walletAddress)
      delete this.mempool[walletAddress];
      delete this.timeoutRequests[walletAddress];
    } catch(err) {
      throw new Error(err);
    }
  }

  async removeValidRequest(walletAddress) {
    try {
      delete this.mempoolValid[walletAddress];
      delete this.timeoutMempoolValid[walletAddress];
    } catch(err) {
      throw new Error(err);
    }
  }

  async findRequestByWalletAddress(walletAddress) {
  // console.log(this.mempool.length);
    return new Promise((resolve, reject) => {
      // Find mempoolObject in leveldb            
      this.mempool.forEach((mempoolObject) => {
        if(mempoolObject.walletAddress === walletAddress){
          let timeElapse = (new Date().getTime().toString().slice(0,-3)) - mempoolObject.requestTimeStamp;
          let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
          mempoolObject.validationWindow = timeLeft;        
            resolve(mempoolObject);
        }
      });
      resolve(null);
    });
  }

  async findValidRequestByWalletAddress(walletAddress) {
    try {
      // console.log(this.mempoolValid.length);
      return new Promise((resolve, reject) => {
        // Find mempoolValidObject in leveldb            
        this.mempoolValid.forEach((mempoolValidObject) => {
          if(mempoolValidObject.status.address === walletAddress){
            let timeElapse = (new Date().getTime().toString().slice(0,-3)) - mempoolValidObject.status.requestTimeStamp;
            let timeLeft = (TimeoutMempoolValidWindowTime/1000) - timeElapse;
            mempoolValidObject.status.validationWindow = timeLeft;        
            resolve(mempoolValidObject);
          }
        });
        resolve(null);
      });
    } catch(err) {
      throw new Error(err);
    }
  }

  // Add requestValidation 
  async addRequestValidation(RequestObject) {
    try {
      this.mempool.push(RequestObject);
      let result = await this.findRequestByWalletAddress(RequestObject.walletAddress);
      
      if(result) {
        return result;
      } else {
        this.mempool[RequestObject.walletAddress] = RequestObject;
        this.timeoutRequests[RequestObject.walletAddress] = setTimeout(function() {
          this.removeValidationRequest(RequestObject.walletAddress)
        }, TimeoutRequestsWindowTime);

        return RequestObject;
      }
    } catch(err) {
      throw new Error(err);
    }
  }

  // validateRequestByWallet
  async validateRequestByWallet(requestObject, signature) {
    try {
      // console.log('valedateReqeustByWallet requestObject', requestObject);
      // console.log(requestObject.message, requestObject.walletAddress, signature);
      // verify the siganture
      let isValid = await bitcoinMessage.verify(requestObject.message, requestObject.walletAddress, signature);
      // console.log('isValis', isValid)
      if(isValid) {
        let validRequest = new ValidRequest(requestObject, isValid);

        let timeElapse = (new Date().getTime().toString().slice(0,-3)) - validRequest.status.requestTimeStamp;
        let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
        validRequest.status.validationWindow = timeLeft;

        // console.log('this.mempooValid.length: ', this.mempoolValid.length);
        
        // save it into the `mempoolValid` array
        this.mempoolValid.push(validRequest);
        console.log('this.mempoolValid', this.mempoolValid);
        console.log('request', requestObject, requestObject.walletAddress)
        // removeTimeout
        this.mempoolValid[requestObject.walletAddress] = requestObject;
        this.timeoutMempoolValid[requestObject.walletAddress] = setTimeout(function() {
          this.removeValidRequest(requestObject.walletAddress)
        }, TimeoutMempoolValidWindowTime);

        this.removeValidationRequest(requestObject.walletAddress);

        console.log(validRequest)
        return validRequest;

      } else {
        console.log('failed!!!!');
        return null;
      }
      
    } catch(err) {
      throw new Error(err);
    }
  }

}

module.exports = Mempool;