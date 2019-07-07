/* ========== ValidRequest Class ==================
|     Class with a constructor for ValidRequest		|
|  ==============================================*/

class ValidRequest {
	constructor(requestObject, validSignature) {
		// Add your ValidRequest properties
		// Example: this.hash = "";
		this.registerStar = true,
		this.status = {
      address: requestObject.walletAddress,
      requestTimeStamp: requestObject.requestTimeStamp,
      message: requestObject.message,
      validationWindow: requestObject.validationWindow,
      messageSignature: validSignature
    }
  }
}

module.exports = ValidRequest;
