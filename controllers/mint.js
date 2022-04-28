const hederaMint = require('./hedera/mint');

exports.getMintTx = (req) => {
    const network = req.network;
    if (network == 'hedera') {
        return hederaMint.getMintTx(req);
    } else if (network == 'klaytn') {

    }
}

exports.sendMintTx = (req) => {
    const network = req.network;
    if (network == 'hedera') {
        return hederaMint.sendMintTx(req);
    } else if (network == 'klaytn') {

    }
}

exports.checkMintable = (req) => {
    const network = req.network;
    if (network == 'hedera') {
        return hederaMint.checkMintable(req);
    } else if (network == 'klaytn') {

    }
}

exports.claimNFT = (req) => {
    const network = req.network;
    if (network == 'hedera') {
        return hederaMint.claim(req);
    } else if (network == 'klaytn') {

    }
}

exports.updateClaimNFTStatus = (req) => {
    const network = req.network;
    if (network == 'hedera') {
        return hederaMint.updateClaimStatus(req);
    } else if (network == 'klaytn') {

    }
}