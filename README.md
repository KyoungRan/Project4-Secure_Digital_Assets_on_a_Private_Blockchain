# Project #4 Build a Private Blockchain Notary Service

This is Project 4, you will build a Star Registry Service that allows users to claim ownerhip of their favorite star in the night sky.  
  
The API project will require two endpoints:  
  
* GET block
* POST block

## Setup project for Review.

To setup the project for review do the following:

1. Download the project.
2. Run command __npm install__ to install the project dependencies.
3. Run command __node app.js__ in the root directory.

## Endpoints

### POST Block Endpoint

#### Validate Request by address

* URL  
  `http://localhost:8000/requestValidation`

* Method  
  `POST`

* Required Params  
  `address` parameter
  
  * The request should contain:
    `{ "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL" }`

* Success Response
  * Status Code  
    `200`

  * Example POST Response  
    For URL, `http://localhost:8000/requestValidataion`

  The response should contain: `walletAddress`, `requestTimeStamp`, `message` and `validationWindow`. It must be returned in a JSON format:  

  ```javascript
  {
    "status":200,
    "message":"Success Response",
    "json": {
      "walletAddress": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
      "requestTimeStamp": "1544451269",
      "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1544451269:starRegistry",
      "validationWindow": 300
    }
  }
  ```

* Error
  * Status Code  
    `404`

  * Error Response

  ```javascript
  {
    "status": 404,
    "message": "Please write the address!!"
  }
  ```

#### Validates message signature by address and signature

* URL  
  `http://localhost:8000/message-signature/validate`

* Method  
  `POST`

* Required Params  
  `address` parameter
  
  * The request should contain:
    `{ "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL", "signature":"H8K4+1MvyJo9tcr2YN2KejwvX1oqneyCH+fsUL1z1WBdWmswB9bijeFfOfMqK68kQ5RO6ZxhomoXQG3fkLaBl+Q=" }`

* Success Response
  * Status Code  
    `200`

  * Example POST Response  
    For URL, `http://localhost:8000/message-signature/validate`

  ```javascript
  {
    "registerStar": true,
    "status": {
        "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
        "requestTimeStamp": "1544454641",
        "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1544454641:starRegistry",
        "validationWindow": 193,
        "messageSignature": true
    }
  }
  ```

* Error
  * Status Code  
    `404`

  * Error Response

  ```javascript
  {
    "status": 404,
    "message": "Please Write the address and signature!"
  }
  ```

#### submits the Star information to be saved in the Blockchain

* URL  
  `http://localhost:8000/block`

* Method  
  `POST`

* Required Params  
  `body` parameter

  * The request should contain:

  ```javascript
  {
    "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
    "star": {
      "dec": "68° 52' 56.9",
      "ra": "16h 29m 1.0s",
      "story": "Found star using https://www.google.com/sky/"
    }
  }
  ```

* Success Response
  * Status Code  
    `200`

  * Example POST Response  
    For URL, http://localhost:8000/block

  ```javascript
  {
    "status":200,
    "message":"Success Response",
    "json": {
      "hash": "8098c1d7f44f4513ba1e7e8ba9965e013520e3652e2db5a7d88e51d7b99c3cc8",
      "height": 1,
      "body": {
        "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
        "star": {
          "ra": "16h 29m 1.0s",
          "dec": "68° 52' 56.9",
          "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
      }
    },
    "time": "1544455399",
    "previousBlockHash": "639f8e4c4519759f489fc7da607054f50b212b7d8171e7717df244da2f7f2394"
    }
  }
  ```

* Error
  * Status Code  
    `404`

  * Error Response

  ```javascript
  {
    "status": 404,
    "message": "Valid request not found!"
  }
  ```

### GET Block Endpoint

#### Get Star block by hash

* URL
`http://localhost:8000/stars/hash:[HASH]`  

* Method  
  `GET`

* Success Response
  * Status Code  
    `200`

  * Example GET Response  
    For URL, http://localhost:8000/stars/hash:a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f  

  ```javascript
  {
    "status": 200,
    "message": "Success Response",
    "json": {
      "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
      "height": 1,
      "body": {
        "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
        "star": {
        "ra": "16h 29m 1.0s",
        "dec": "-26° 29' 24.9",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https://www.google.com/sky/"
      }
    },
    "time": "1532296234",
    "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
    }
  }
  ```

* Error
  * Status Code  
    `404`
  * Error Response  

  ```javascript
  {
    "status": 404,
    "message": "Hash does not exist!"
  }
  ```

#### Get Star block by wallet address

* URL
`http://localhost:8000/stars/address:[ADDRESS]`  

* Method  
  `GET`

* Success Response
  * Status Code  
    `200`

  * Example GET Response  
    For URL, http://localhost:8000/stars/address:142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ  

  ```javascript
  {
    "status": 200,
    "message": "Success Response",
    "json": [{
      "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
      "height": 1,
      "body": {
        "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
        "star": {
          "ra": "16h 29m 1.0s",
          "dec": "-26° 29' 24.9",
          "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
          "storyDecoded": "Found star using https://www.google.com/sky/"
        }
      },
      "time": "1532296234",
      "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
      },
      {
      "hash": "6ef99fc533b9725bf194c18bdf79065d64a971fa41b25f098ff4dff29ee531d0",
      "height": 2,
      "body": {
        "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
        "star": {
          "ra": "17h 22m 13.1s",
          "dec": "-27° 14' 8.2",
          "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
          "storyDecoded": "Found star using https://www.google.com/sky/"
        }
      },
      "time": "1532330848",
      "previousBlockHash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f"
    }]
  }
  ```

* Error
  * Status Code  
    `404`
  * Error Response  

  ```javascript
  {
    "status": 404,
    "message": "Address does not exist!"
  }
  ```

#### Get Block by star block height

* URL

`http://localhost:8000/block/[blockheight]`  
  
* Method  
  `GET`

* Success Response
  * Status Code  
    `200`

  * Example GET Response  
    For URL, http://localhost:8000/block/1  

  ```javascript
  {
    "status": 200,
    "message": "Success Response",
    "json": {
      "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
      "height": 1,
      "body": {
        "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
        "star": {
          "ra": "16h 29m 1.0s",
          "dec": "-26° 29' 24.9",
          "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
          "storyDecoded": "Found star using https://www.google.com/sky/"
        }
      },
      "time": "1532296234",
      "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
    }
  }
  ```

* Error
  * Status Code  
    `404`
  * Error Response  

  ```javascript
  {
    "status": 404,
    "message": "Block does not exist!"
  }
  ```

## Testing Endpoints Tools

When we are developing a RESTful API, we need to test our endpoints. To do that, we are going to introduce 2 powerful tools - Postman and Curl.

* [Postman](https://www.getpostman.com) is a powerful tool used to test web services. It was developed for sending HTTP requests in a simple and quick way.  
* [CURL](https://curl.haxx.se/) is a command-line tool used to deliver requests supporting a variety of protocols like HTTP, HTTPS, FTP, FTPS, SFTP, and many more.