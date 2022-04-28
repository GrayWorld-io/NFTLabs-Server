var async = require("async");

var userDB = require("../models/user");
var tokenDB = require("../models/token");
var marketPlaceDB = require("../models/marketplace");

var hedera = require("../hedera/hedera");
var logger = require("../utils/logger");
const { token } = require("morgan");
require("dotenv").config();

exports.createToken = function (req, finalCallback) {
  const tx = Object.values(req.tx);
  const fileId = req.fileId;
  async.waterfall(
    [
      function (callback) {
        return hedera.sendTransaction(tx, callback);
      },
      function (res, callback) {
        console.log(res);
        if (res.status._code == 22) {
          let token = {
            tokenId: res.tokenId,
            fileId: fileId,
            owner: req.owner
          };
          return tokenDB.updateTokenId(token, callback);
        }
        return callback(new Error("create token error"));
      }
    ],
    function (err, res) {
      if (err) {
        logger.error(err);
        return finalCallback(err);
      }
      return finalCallback(null);
    }
  );
};

exports.updateAdRegisterStatus = function (req, finalCallback) {
  let token = {
    tokenId: req.tokenId
  };
  async.waterfall(
    [
      function (callback) {
        return tokenDB.updateTokenAdRegisterStatus(token, callback);
      },
      function (callback) {
        return tokenDB.selectTokenByTokenId(token, callback);
      },
      function (res, callback) {
        let result = {
          initialOwnerEmail: res[0].initialOwnerUserEmail
        };
        return callback(null, result);
      }
    ],
    function (err, res) {
      if (err) {
        logger.error(err);
        return finalCallback(err);
      }
      return finalCallback(null, res);
    }
  );
};
exports.sellToken = function (req, finalCallback) {
  const transferTokenToMarketPlaceTx = Object.values(req.tx);
  async.waterfall(
    [
      function (callback) {
        const tokenId = req.tokenId;
        const marketPlaceAccountId = process.env.HBAR_MARKETPLACE_ID;
        const marketPlaceKey = process.env.HBAR_MARKETPLACE_KEY;
        return hedera.associateToken(
          marketPlaceAccountId,
          marketPlaceKey,
          tokenId,
          callback
        );
      },
      function (res, callback) {
        // if (res.status._code == 22) {
          let token = {
            tokenId: req.tokenId,
            price: req.price,
            sellAccount: req.accountId
          };
          return marketPlaceDB.insertToken(token, callback);
        // }
        return callback(new Error("associate token error"));
      },
      function (callback) {
        return hedera.sendTransaction(transferTokenToMarketPlaceTx, callback);
      },
      function (res, callback) {
        console.log(res);
        if (res.status._code == 22) {
          return callback(null);
        }
        return callback(new Error("create token error"));
      },
    ],
    function (err, res) {
      if (err) {
        logger.error(err);
        return finalCallback(err);
      }
      return finalCallback(null);
    }
  );
};

exports.purchaseToken = function (req, finalCallback) {
  const associateTx = Object.values(req.tx);
  const transferHbarTx = Object.values(req.transferHbarTx);
  const tokenId = req.tokenId;
  const buyerId = req.accountId;
  async.waterfall(
    [
      function (callback) {
        // associate to token buyer
        hedera.sendTransaction(associateTx, callback);
      },
      function (res, callback) {
        if (res.status._code == 22) {
          // transfer hbar marketplace account to buyer account
          const marketPlaceAccountId = process.env.HBAR_MARKETPLACE_ID;
          const marketPlaceKey = process.env.HBAR_MARKETPLACE_KEY;
          return hedera.transferToken(
            marketPlaceAccountId,
            buyerId,
            tokenId,
            marketPlaceKey,
            callback
          );
        }
        return callback(new Error("associate token error"));
      },
      function (res, callback) {
        if (res.status._code == 22) {
          return hedera.sendTransaction(transferHbarTx, callback);
        }
        return callback(new Error("transfer token error"));
      },
      function (res, callback) {
        if (res.status._code == 22) {
          return callback(null);
        }
        return callback(new Error("transfer hbar error"));
      },
    ],
    function (err, res) {
      if (err) {
        logger.error(err);
        return finalCallback(err);
      }
      return finalCallback(null);
    }
  );
};

exports.updateTokenTreasury = function (req, finalCallback) {
  const updateTx = Object.values(req.tx);
  let token = {
    tokenId: req.tokenId,
    owner: req.accountId,
  };
  async.waterfall(
    [
      function (callback) {
        return hedera.sendTransaction(updateTx, callback);
      },
      function (res, callback) {
        if (res.status._code == 22) {
          return tokenDB.updateTokenOwner(token, callback);
        }
        return callback(new Error("update token error"));
      },
    ],
    function (err, res) {
      if (err) {
        logger.error(err);
        return finalCallback(err);
      }
      return finalCallback(null);
    }
  );
};

exports.createTokenMetadata = function (req, finalCallback) {
  let fileId = "";
  async.waterfall(
    [
      function (callback) {
        return hedera.createFile(req, callback);
      },
      function (res, callback) {
        if (res.status._code == 22) {
          fileId = res.fileId.toString();
          return callback(null);
        }
        return callback(new Error("create token metadata file error"));
      },
      function (callback) {
        return userDB.selectUserByAccountId(req, callback);
      },
      function (res, callback) {
        let token = req;
        token.fileId = fileId;
        token.confirm = false;
        token.ad_register = false;
        token.initialOwnerEmail = res[0].email;
        console.log(token);
        return tokenDB.insertTokenMetadata(token, callback);
      },
    ],
    function (err, res) {
      if (err) {
        logger.error(err);
        return finalCallback(err);
      }
      return finalCallback(null, fileId);
    }
  );
};

exports.getTokenMetadata = function (req, finalCallback) {
  async.waterfall(
    [
      function (callback) {
        return hedera.getFile(req.fileId, callback);
      },
      function (res, callback) {
        const fileDataString = new TextDecoder().decode(res);
        const tokenProperties = JSON.parse(fileDataString);
        return callback(null, tokenProperties);
      },
    ],
    function (err, res) {
      if (err) {
        logger.error(err);
        return finalCallback(err);
      }
      return finalCallback(null, res);
    }
  );
};

exports.getTokenInfoByOwnerOnDB = function (req, finalCallback) {
  async.waterfall([
    function (callback) {
      return tokenDB.selectTokenByTokenId(token, callback);
    },
  ]);
};

exports.getMarketPlaceTokenList = function (req, finalCallback) {
  const marketPlaceAccountId = process.env.HBAR_MARKETPLACE_ID;
  let balances = {};
  async.waterfall(
    [
      function (callback) {
        hedera.getBalance(marketPlaceAccountId, callback);
      },
      function (res, callback) {
        let tokenList = [];
        Object.entries(res.tokens).forEach(([key, value]) => {
          let token = {
            tokenId: key,
            balance: value,
          };
          tokenList.push(token);
        });
        return callback(null, tokenList);
      },
      function (res, callback) {
        balances.tokens = [];
        async.map(
          res,
          function (token, cb) {
            let tokenObject = {};
            async.waterfall(
              [
                function (cb2) {
                  tokenObject.tokenId = token.tokenId;
                  return tokenDB.selectTokenByTokenId(tokenObject, cb2);
                },
                function (res, cb2) {
                  tokenObject.metadata = res[0];
                  return cb2(null);
                },
                function (cb2) {
                  return marketPlaceDB.selectTokenByTokenId(tokenObject, cb2);
                },
                function (res, cb2) {
                  if (res.length === 0) {
                    tokenObject.price = 'sold out';  
                  } else {
                    tokenObject.price = res[0].price;
                  }
                  
                  return cb2(null);
                },
                function (cb2) {
                  if (token.balance === '0') {
                    tokenObject.status = "sold";
                  } else {
                    tokenObject.status = "selling";
                  }
                  balances.tokens.push(tokenObject);
                  return cb2(null);
                },
              ],
              function (err) {
                if (err) {
                  console.log(err);
                  return cb(err);
                }
                return cb(null);
              }
            );
          },
          function (err, res) {
            if (err) {
              return callback(err);
            }
            return callback(null);
          }
        );
      },
    ],
    function (err, res) {
      if (err) {
        logger.error(err);
        return finalCallback(err);
      }
      console.log(balances);
      return finalCallback(null, balances);
    }
  );
};

exports.getTokenPrice = function (req, finalCallback) {
  let tokens = [];
  async.waterfall(
    [
      function (callback) {
        return marketPlaceDB.selectTokenByTokenId(req, callback);
      },
      function (res, callback) {
        return callback(null, res);
      },
    ],
    function (err, res) {
      if (err) {
        logger.error(err);
        return finalCallback(err);
      }
      return finalCallback(null, res);
    }
  );
};
