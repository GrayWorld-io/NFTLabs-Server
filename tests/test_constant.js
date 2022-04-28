require("dotenv").config();

const marketPlaceAccountId = process.env.HBAR_MARKETPLACE_ID;
const aliceId = process.env.HBAR_ELICE_ID;
let tokenId = "0.0.298965";

exports.mintHederaFreshMan = function () {
  return {
    network: "hedera",
    project: "freshman",
    accountId: "0.0.28525122"
  };
};
