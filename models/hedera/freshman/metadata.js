const logger = require("../../../utils/logger");
const dbConnect = require("../../../db/mysql-connector");

exports.selectHederaFreshmManMetadata = async (serial) => {
  let sql = `select cid from hedera_freshman_metadata where idx = '${serial}' `;
  logger.info(sql);

  let connection = await dbConnect.getDBCon();
  let [rows, fields] = await connection.query(sql);
  return rows;
};

exports.insertCid = async (storage, cid) => {
  let sql = `INSERT INTO hedera_freshman_metadata (storage, cid) VALUES ('${storage}', '${cid}') `;
  logger.info(sql);

  let connection = await dbConnect.getDBCon();
  await connection.query(sql);
  return true;
};