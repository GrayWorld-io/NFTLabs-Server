const hederaTokenController = require('./hedera/token');

exports.myNFTList = (req) => {
    const network = req.network;
    if (network == 'hedera') {
        return hederaTokenController.getNFTList(req);
    } else if (network == 'klaytn') {

    }
}
