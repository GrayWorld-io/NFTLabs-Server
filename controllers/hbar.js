var async = require("async");

var tokenDB = require("../models/token");

var hedera = require("../hedera/hedera");
var logger = require("../utils/logger");
const { token } = require("morgan");
require("dotenv").config();

exports.transferHbar = function (req, finalCallback) {
  const tx = Object.values(req.tx);
  async.waterfall(
    [
      function (callback) {
        return hedera.sendTransaction(tx, callback);
      },
      function (res, callback) {
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
          };
          return tokenDB.updateTokenPrice(token, callback);
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
  const tokenId = req.tokenId;
  const buyerId = req.accountId;
  async.waterfall(
    [
      function (callback) {
        hedera.sendTransaction(associateTx, callback);
      },
      function (res, callback) {
        if (res.status._code == 22) {
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
          return callback(null);
        }
        return callback(new Error("transfer token error"));
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
  let tokenId = "";
  async.waterfall(
    [
      function (callback) {
        return hedera.createFile(req, callback);
      },
      function (res, callback) {
        if (res.status._code == 22) {
          fileId = res.fileId.toString();
          return callback(null, fileId);
        }
        return callback(new Error("create token metadata file error"));
      },
      function (res, callback) {
        let token = req;
        token.fileId = fileId;
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
