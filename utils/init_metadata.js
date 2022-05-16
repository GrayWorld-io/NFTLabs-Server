var graySeminarMetadataDB = require("../models/hedera/gray/seminar/metadata");
var grayFreshmanMetadataDB = require("../models/hedera/freshman/metadata");
var constants = require("../lib/constants/constants_token_info");

const GRAY_SEMINAR_SUPPLY_MAX = constants.GRAY_SEMINAR_SUPPLY_MAX;
const GRAY_SEMINAR_1_GOLD_SUPPLY_MAX = constants.GRAY_SEMINAR_1_GOLD_SUPPLY_MAX;
const GRAY_SEMINAR_1_SILVER_SUPPLY_MAX = constants.GRAY_SEMINAR_1_SILVER_SUPPLY_MAX;
const GRAY_SEMINAR_1_GOLD_METADATA_CID = constants.GRAY_SEMINAR_1_GOLD_METADATA_CID;
const GRAY_SEMINAR_1_SILVER_METADATA_CID = constants.GRAY_SEMINAR_1_SILVER_METADATA_CID;

const GRAY_SEMINAR_2_SUPPLY_MAX = constants.GRAY_SEMINAR_2_SUPPLY_MAX;
const GRAY_SEMINAR_2_GOLD_SUPPLY_MAX = constants.GRAY_SEMINAR_2_GOLD_SUPPLY_MAX;
const GRAY_SEMINAR_2_SILVER_SUPPLY_MAX = constants.GRAY_SEMINAR_2_SILVER_SUPPLY_MAX;
const GRAY_SEMINAR_2_GOLD_METADATA_CID = constants.GRAY_SEMINAR_2_GOLD_METADATA_CID;
const GRAY_SEMINAR_2_SILVER_METADATA_CID = constants.GRAY_SEMINAR_2_SILVER_METADATA_CID;

const GRAY_FRESHMAN_CID = constants.GRAY_FRESHMAN_CID;
const GRAY_FRESHMAN_SUPPLY_MAX = constants.GRAY_FRESHMAN_SUPPLY_MAX;

const GRAY_SEMINAR_METADATA_PROTOCOL = constants.GRAY_SEMINAR_METADATA_PROTOCOL;
shuffle = (array) => { array.sort(() => Math.random() - 0.5); }

insertGrayFreshmanMetadata = () => {
    let list = [];
    for (var i = 0; i < GRAY_FRESHMAN_SUPPLY_MAX; i++) {
        list.push(`${GRAY_FRESHMAN_CID}/${i}.json`);
    }

    shuffle(list);
    for (var i = 0; i < GRAY_FRESHMAN_SUPPLY_MAX; i++) {
        grayFreshmanMetadataDB.insertCid(GRAY_SEMINAR_METADATA_PROTOCOL, list[i]);
    }
     
}

insertGraySeminar1Metadata = () => {
    let list = [];
    for (var i = 0; i < GRAY_SEMINAR_1_GOLD_SUPPLY_MAX; i++) {
        list.push(GRAY_SEMINAR_1_GOLD_METADATA_CID);
    }
    for (var i = 0; i < GRAY_SEMINAR_1_SILVER_SUPPLY_MAX; i++) {
        list.push(GRAY_SEMINAR_1_SILVER_METADATA_CID);
    }

    shuffle(list);
    for (var i = 0; i < GRAY_SEMINAR_SUPPLY_MAX; i++) {
        graySeminarMetadataDB.insertCid(GRAY_SEMINAR_METADATA_PROTOCOL, list[i]);
    }
    
}

insertGraySeminar2Metadata = () => {
    let list = [];
    for (var i = 0; i < GRAY_SEMINAR_2_GOLD_SUPPLY_MAX; i++) {
        list.push(GRAY_SEMINAR_2_GOLD_METADATA_CID);
    }
    for (var i = 0; i < GRAY_SEMINAR_2_SILVER_SUPPLY_MAX; i++) {
        list.push(GRAY_SEMINAR_2_SILVER_METADATA_CID);
    }

    shuffle(list);
    for (var i = 0; i < GRAY_SEMINAR_2_SUPPLY_MAX; i++) {
        graySeminarMetadataDB.insertCid(GRAY_SEMINAR_METADATA_PROTOCOL, list[i]);
    }
    
}
// insertGraySeminar1Metadata();
// insertGraySeminar2Metadata();
insertGrayFreshmanMetadata();