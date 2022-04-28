const request = require("supertest");
const should = require("should");

const constant = require("./test_constant");

const point = require("../app");

describe("sign all", function() {
  this.timeout(6000);

  describe.skip("POST /getMintTx", function() {
    it("[hedera][freshman] should create mint transaction correctly", function(done) {
      request(point)
        .post("/mint/getTx")
        .type("json")
        .send(JSON.stringify(constant.mintHederaFreshMan()))
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          console.log(res.body);
          // should.exist(res.body.result);
          // res.body.result.should.equal(1);
          done();
        });
    });
  });

  describe("POST /claim", function() {
    it("[hedera][freshman] should create claim transaction correctly", function(done) {
      request(point)
        .post("/mint/claim")
        .type("json")
        .send(JSON.stringify(constant.mintHederaFreshMan()))
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          console.log(res.body);
          // should.exist(res.body.result);
          // res.body.result.should.equal(1);
          done();
        });
    });

  });
});
