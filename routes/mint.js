var express = require("express");
var router = express.Router();

var mintController = require("../controllers/mint");
var response = require("../utils/response");
var logger = require("../utils/logger");

router.post("/getTx", async (req, res) => {
  console.log(req.url + " post body: " + JSON.stringify(req.body));
  try {
    let response = await mintController.getMintTx(req.body);
    res.send({
      tx: response
    })
  } catch (e) {
    console.log(e);
    logger.error(e);
  }
});

router.post("/sendTx", async (req, res) => {
  try {
    let response = await mintController.sendMintTx(req.body);
    console.log(response)
    res.send({
      result: response
    })
  } catch (e) {
    console.log(e);
    logger.error(e);
  }
});

router.post("/checkMintable", async (req, res) => {
  console.log(req.url + " post body: " + JSON.stringify(req.body));
  try {
    let response = await mintController.checkMintable(req.body);
    console.log(response)
    res.send({
      result: response
    })
  } catch (e) {
    console.log(e);
    logger.error(e);
  }
});

router.post("/claim", async (req, res) => {
  console.log(req.url + " post body: " + JSON.stringify(req.body));
  try {
    let response = await mintController.claimNFT(req.body);
    console.log(response)
    res.send({
      tx: response
    })
  } catch (e) {
    console.log(e);
    logger.error(e);
  }
});

router.post("/claim/status", async (req, res) => {
  console.log(req.url + " post body: " + JSON.stringify(req.body));
  try {
    let response = await mintController.updateClaimNFTStatus(req.body);
    console.log(response)
    res.send({
      result: response
    })
  } catch (e) {
    console.log(e);
    logger.error(e);
  }
});

module.exports = router;
