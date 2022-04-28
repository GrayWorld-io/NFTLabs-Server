const logger = require("../../../../utils/logger");
const dbConnect = require("../../../../db/mysql-connector");

exports.getMintCount = async () => {
  let sql = `select count(*) as count from hedera_seminar_mint`;
  let connection = await dbConnect.getDBCon();
  let [rows, fields] = await connection.query(sql);
  return rows;
}
exports.insertHederaGraySeminarMint = async (mint) => {
  let sql = `INSERT INTO hedera_seminar_mint (tokenId, serial, mintAddress) VALUES ('${mint.tokenId}', '${mint.serial}', '${mint.mintAddress}') `;
  logger.info(sql);

  let connection = await dbConnect.getDBCon();
  await connection.query(sql);
  return true;
};

exports.selectHederaGraySeminarMintAddressBySerial = async (serial) => {
  let sql = `select mintAddress from hedera_seminar_mint where serial = '${serial}' `;
  logger.info(sql);

  let connection = await dbConnect.getDBCon();
  let [rows, fields] = await connection.query(sql);
  return rows;
};

exports.selectHederaGraySeminarMintAddress = async (mintAddress, claim) => {
  let sql;
  if (claim === null) {
    sql = `select serial, mintAddress, claim from hedera_seminar_mint where mintAddress = '${mintAddress}'`;
  } else {
    sql = `select serial, mintAddress, claim from hedera_seminar_mint where mintAddress = '${mintAddress}' and claim = ${claim}`;
  }
  
  logger.info(sql);
  let connection = await dbConnect.getDBCon();
  let [rows, fields] = await connection.query(sql);
  return rows;
};

exports.updateClaimByMintAddress = async (mintAddress, status) => {
  let sql = `UPDATE hedera_seminar_mint SET claim = '${status}', claimDate = CURRENT_TIMESTAMP where mintAddress = '${mintAddress}'`;
  logger.info(sql);

  let connection = await dbConnect.getDBCon();
  await connection.query(sql);
  return true;
};