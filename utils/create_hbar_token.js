require("dotenv").config();

const {
    Client,
    AccountId,
    PrivateKey,
    TokenType,
    TokenSupplyType,
    TokenCreateTransaction,
} = require("@hashgraph/sdk");

const constants = require("../lib/constants/constants_token_info");

const GRAY_SEMINAR_SUPPLY_MAX = constants.GRAY_FRESHMAN_SUPPLY_MAX;

async function main() {

    let client;

    if (process.env.HEDERA_NETWORK != null) {
        switch (process.env.HEDERA_NETWORK) {
            case "previewnet":
                client = Client.forPreviewnet();    
                break;
            case "mainnet":
                client = Client.forMainnet();
                break;
            default:
                client = Client.forTestnet();
        }
    }
    if (process.env.HBAR_OPERATOR_KEY != null && process.env.HBAR_OPERATOR_ID != null) {
        const operatorKey = PrivateKey.fromString(process.env.HBAR_OPERATOR_KEY);
        const operatorId = AccountId.fromString(process.env.HBAR_OPERATOR_ID);
        client.setOperator(operatorId, operatorKey);
    }

    const TOKEN_MAX_SUPPLY = GRAY_SEMINAR_SUPPLY_MAX;
    let resp = await new TokenCreateTransaction()
        .setTokenType(TokenType.NonFungibleUnique)
        .setInitialSupply(0)
        .setSupplyType(TokenSupplyType.Finite)
        .setMaxSupply(TOKEN_MAX_SUPPLY)
        .setTokenName("GrayFreshMan")
        .setTokenSymbol("GFM")
        .setTreasuryAccountId(client.operatorAccountId)
        .setAdminKey(client.operatorPublicKey)
        .setFreezeKey(client.operatorPublicKey)
        .setWipeKey(client.operatorPublicKey)
        .setSupplyKey(client.operatorPublicKey)
        .setFreezeDefault(false)
        .setTransactionMemo("[GW] Initial Create GFM #1")
        .setTokenMemo("Gray FreshMan #1")
        .execute(client);

    const tokenId = (await resp.getReceipt(client)).tokenId;
    console.log(`token id = ${tokenId}`);
}

main();