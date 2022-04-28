const logger = require("../utils/logger");
const dbConnect = require("../db/mysql-connector");

dbConnect.getDBCon(function (err, con) {
  if (err) {
    logger.error("fail to get mysql connection");
  }
  con.query(
    "CREATE TABLE IF NOT EXISTS marketplace (" +
      "`idx` int NOT NULL AUTO_INCREMENT, " +
      "`tokenId` varchar(20), " +
      "`price` varchar(20), " +
      "`sellAccount` varchar(20), " +
      "PRIMARY KEY (`idx`) " +
      ")",
    function (err) {
      if (err) {
        console.log(err);
        logger.error("user - create error : ", err);
      }
    }
  );
});

exports.insertToken = function (token, callback) {
  let sql = `INSERT INTO marketplace (tokenId, price, sellAccount) VALUES ('${token.tokenId}', '${token.price}', '${token.sellAccount}') `;
  logger.info(sql);
  dbConnect.getDBCon(function (err, con) {
    if (err) {
      logger.error("fail to get mysql connection");
      return callback(err);
    }
    con.query(sql, function (err, result) {
      if (err) {
        logger.error(err);
        return callback(err);
      }
      return callback(null);
    });
  });
};

exports.selectTokenByTokenId = function (token, callback) {
  let sql = `select * from marketplace where tokenId = '${token.tokenId}' `;

  logger.info(sql);
  dbConnect.getDBCon(function (err, con) {
    if (err) {
      logger.error("fail to get mysql connection");
      return callback(err);
    }
    con.query(sql, function (err, result) {
      if (err) {
        logger.error(err);
        return callback(err);
      }
      return callback(null, result);
    });
  });
};

exports.deleteMarketPlaceToken = function (token, callback) {
  let sql = `delete from marketplace where tokenId = '${token.tokenId}' `;
  logger.info(sql);
  dbConnect.getDBCon(function (err, con) {
    if (err) {
      logger.error(id, "fail to get mysql connection");
      return callback(err);
    }
    con.query(sql, function (err, row) {
      if (err) {
        logger.error(err);
        return callback(err);
      }
      return callback(null);
    });
  });
};
