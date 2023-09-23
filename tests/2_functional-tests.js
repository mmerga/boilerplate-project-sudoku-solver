const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const VALID_PUZZLE = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
const INVALID_CARACTER = 'DEG..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
const INCORRECT_LENGTH = '..9..5.1.85.4....2432.4545.......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
const CANT_SOLVE = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.9';


suite('Functional Tests', function()  {

  suite('POST /api/solve ', function() {
    //#1
    test('Solve a puzzle with valid puzzle string', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({
          "puzzle": VALID_PUZZLE
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.isNotNull(res.body.solution)
          done();
        });
    });
    //#2
    test('Solve a puzzle with missing puzzle string', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'Required field missing');
          done();
        });
    });
    //#3
    test('Solve a puzzle with invalid characters', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({
          "puzzle": INVALID_CARACTER
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error,'Invalid characters in puzzle')
          done();
        });
    });
    //#4
    test('Solve a puzzle with incorrect length', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({
          "puzzle": INCORRECT_LENGTH
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error,'Expected puzzle to be 81 characters long');
          done();
        });
    });
    //#5
    test('Solve a puzzle that cannot be solved', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({
          "puzzle": CANT_SOLVE
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error,'Puzzle cannot be solved');
          done();
        });
    });
  })
  suite('POST /api/check ', function() {
    //#6
    test('Check a puzzle placement with all fields', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          "puzzle": VALID_PUZZLE,
          "coordinate": 'A1',
          "value": '7'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.isTrue(res.body.valid);
          done();
        });
    });
    //#7
    test('Check a puzzle placement with single placement conflict' , function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          "puzzle": VALID_PUZZLE,
          "coordinate": 'I1',
          "value": '1'
        })  
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.isFalse(res.body.valid);
          assert.isArray(res.body.conflict);
          assert.equal(res.body.conflict[0], 'column');
          done();
        });
    });
    //#8
    test('Check a puzzle placement with multiple placement conflicts' , function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          "puzzle": VALID_PUZZLE,
          "coordinate": 'A1',
          "value": '8'
        })  
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');  
          assert.isFalse(res.body.valid);
          assert.isArray(res.body.conflict);
          assert.equal(res.body.conflict[0], 'column');
          done();
        });
    });
    //#9
    test('Check a puzzle placement with all placement conflicts' , function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          "puzzle": VALID_PUZZLE,
          "coordinate": 'A1',
          "value": '5'
        })  
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');  
          assert.isFalse(res.body.valid);
          assert.isArray(res.body.conflict);
          assert.equal(res.body.conflict[0], 'row');
          assert.equal(res.body.conflict[1], 'column');
          assert.equal(res.body.conflict[2], 'region');
          done();
        });
    });
    //#10
    test('Check a puzzle placement with missing required fields' , function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          "puzzle": VALID_PUZZLE,
          "coordinate": 'A1',
        })  
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');  
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
    });
    //#11
    test('Check a puzzle placement with invalid characters' , function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          "puzzle": INVALID_CARACTER,
          "coordinate": 'A1',
          "value": '5'
        })  
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');  
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });
    //#12
    test('Check a puzzle placement with incorrect length' , function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          "puzzle": INCORRECT_LENGTH,
          "coordinate": 'A1',
          "value": '5'
        })  
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');  
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });
    //#13
    test('Check a puzzle placement with invalid placement coordinate' , function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          "puzzle": VALID_PUZZLE,
          "coordinate": 'K1',
          "value": '5'
        })  
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');  
          assert.equal(res.body.error, 'Invalid coordinate');
          done();
        });
    });
    //#14
    test('Check a puzzle placement with invalid placement value' , function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          "puzzle": VALID_PUZZLE,
          "coordinate": 'A1',
          "value": '59'
        })  
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');  
          assert.equal(res.body.error, 'Invalid value');
          done();
        });
    });
    
  });
});





