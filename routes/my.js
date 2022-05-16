var express = require("express");
var router = express.Router();

var myController = require("../controllers/my");
var whiteListController = require("../controllers/whitelist");
var response = require("../utils/response");
var logger = require("../utils/logger");


router.post("/nft", async (req, res) => {
  console.log(req.url + " post body: " + JSON.stringify(req.body));
  try {
    let response = await myController.myNFTList(req.body);
    res.send({
      result: response
    })
  } catch (e) {
    logger.error(e);
  }
});


module.exports = router;
