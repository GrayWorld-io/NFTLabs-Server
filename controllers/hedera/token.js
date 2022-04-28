var freshManMintDB = require("../../models/hedera/freshman/mint");
var freshManMetadataDB = require("../../models/hedera/freshman/metadata");
var hedera = require("../../hedera/hedera");
var logger = require("../../utils/logger");
var constants = require("../../lib/constants");

exports.tokenAssociate = async (req) => {
  let tokenId;
  let operatorPay;
  if (req.project == 'gray_seminar_1') {
    tokenId = constants.GRAY_SEMINAR_1_TOKEN_ID;
    operatorPay = true;
  }
  const tx = await hedera.getTokenAssociateTx(operatorPay, req.accountId, tokenId);
  return tx.toBytes();
}
