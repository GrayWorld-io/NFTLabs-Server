var async = require("async");

var hedera = require("../hedera/hedera");
var tokenDB = require("../models/token");
var marketPlaceDB = require("../models/marketplace");
var logger = require("../utils/logger");
require("dotenv").config();

exports.sudmitMsg = function (req, finalCallback) {
  const msgType = req.msgType;
  const tx = Object.values(req.tx);
  const token = {
    tokenId: req.tokenId
  };
  async.waterfall(
    [
      function (callback) {
        return hedera.sendTransaction(tx, callback);
      },
      function (res, callback) {
        if (res.status._code == 22) {
          if (msgType === 'confirm') {
            return tokenDB.updateTokenConfirmStatus(token, callback);
          }
          return callback(null);
        }
        return callback(new Error("submit message error"));
      },
      function (callback) {
        return marketPlaceDB.selectTokenByTokenId(token, callback);
      },
      function (res, callback) {
        const marketPlaceAccountId = process.env.HBAR_MARKETPLACE_ID;
        const marketPlaceKey = process.env.HBAR_MARKETPLACE_KEY;
        return hedera.transferHbar(
          marketPlaceAccountId,
          res[0].sellAccount,
          res[0].price,
          marketPlaceKey,
          callback
        );
      },
      function (res, callback) {
        console.log(res);
        if (res.status._code == 22) {
          return marketPlaceDB.deleteMarketPlaceToken(token, callback);
        }
        return callback(new Error("transfer hbar error"));
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

