var async = require("async");

var userDB = require("../models/user");
var tokenDB = require("../models/token");
var marketPlaceDB = require("../models/marketplace");

var hedera = require("../hedera/hedera");
var logger = require("../utils/logger");

exports.signup = function (req, finalCallback) {
  let account = {};
  async.waterfall(
    [
      function (callback) {
        return hedera.createAccount(callback);
      },
      function (res, callback) {
        account = res;
        let user = {
          email: req.email,
          password: req.password,
          publicKey: res.publicKey,
          accountId: res.hederaAccount,
        };
        return userDB.insertUser(user, callback);
      },
    ],
    function (err, res) {
      if (err) {
        logger.error(err);
        return finalCallback(err);
      }
      console.log(account);
      return finalCallback(null, account);
    }
  );
};

exports.login = function (req, finalCallback) {
  async.waterfall(
    [
      function (callback) {
        return userDB.selectUserByAuth(req, callback);
      },
      function (res, callback) {
        if (res.length === 0) {
          return finalCallback(new Error("계정 정보가 잘못되었습니다."));
        }
        return callback(null, res[0]);
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

exports.getAssets = function (req, finalCallback) {
  let balances = {};
  async.waterfall(
    [
      function (callback) {
        hedera.getBalance(req.accountId, callback);
      },
      function (res, callback) {
        balances.hbar = res.hbar;
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
            console.log(token);
            let tokenObject = {};
            async.waterfall(
              [
                function (cb2) {
                  tokenObject.tokenId = token.tokenId;
                  return tokenDB.selectTokenByTokenId(tokenObject, cb2);
                },
                function (res, cb2) {
                  tokenObject.metadata = res[0];
                  return marketPlaceDB.selectTokenByTokenId(tokenObject, cb2);
                },
                function (res, cb2) {
                  if (token.balance === '0') {
                    if (res.length === 1) {
                      if (req.accountId == tokenObject.metadata.owner) {
                        tokenObject.status = "selling";
                      } else {
                        tokenObject.status = "sold";
                      }
                    } else {
                      tokenObject.status = "sold";
                    }
                  } else {
                    tokenObject.status = "own";
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
