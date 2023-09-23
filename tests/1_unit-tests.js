const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

const VALID_PUZZLE = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

const SOLUTION = {
  "solution": '769235418851496372432178956174569283395842761628713549283657194516924837947381625'
};

const INVALID_CARACTER = 'DEG..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

const INCORRECT_LENGTH = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6......';

suite("UnitTests", () => {

  suite("solver tests", function() {
    //#1
    test("Logic handles a valid puzzle string of 81 characters", function(done) {
      assert.isTrue(solver.correctLength(VALID_PUZZLE));
      done();
    });
    //#2
    test("Logic handles a puzzle string with invalid characters (not 1-9 or .", function(done) {
      assert.isFalse(solver.justNumberDot(INVALID_CARACTER));
      done();
    });
    //#3
    test("Logic handles a puzzle string that is not 81 characters in length", function(done) {
      assert.isFalse(solver.correctLength(INCORRECT_LENGTH));
      done();
    });
    //#4
    test("Logic handles a valid row placement", function(done) {
      let aux = solver.replaceDots(VALID_PUZZLE);
      aux = solver.organizePuzzle(VALID_PUZZLE);
      assert.isTrue(solver.checkRow(aux, 0, 7));
      done();
    });
    //#5
    test("Logic handles an invalid row placement", function(done) {
      let aux = solver.replaceDots(VALID_PUZZLE);
      aux = solver.organizePuzzle(VALID_PUZZLE);
      assert.isTrue(solver.checkRow(aux, 3, 5));
      done();
    });
    //#6
    test("Logic handles a valid column placement", function(done) {
      let aux = solver.replaceDots(VALID_PUZZLE);
      aux = solver.organizePuzzle(VALID_PUZZLE);
      assert.isTrue(solver.checkCol(aux, 0, 7));
      done();
    });
    //#7
    test("Logic handles a invalid column placement", function(done) {
      let aux = solver.replaceDots(VALID_PUZZLE);
      aux = solver.organizePuzzle(VALID_PUZZLE);
      assert.isTrue(solver.checkCol(aux, 1, 5));
      done();
    });
    //#8
    test("Logic handles a valid region (3x3 grid) placement", function(done) {
      let aux = solver.replaceDots(VALID_PUZZLE);
      aux = solver.organizePuzzle(VALID_PUZZLE);
      assert.isTrue(solver.checkRegion(aux, 0, 7));
      done();
    });
    //#9
    test("Logic handles an invalid region (3x3 grid) placement", function(done) {
      let aux = solver.replaceDots(VALID_PUZZLE);
      aux = solver.organizePuzzle(VALID_PUZZLE);
      assert.isFalse(solver.checkRegion(aux, 1, 2));
      done();
    });
    //#10
    test("Valid puzzle strings pass the solver", function(done) {
      let aux = solver.validate(VALID_PUZZLE, 'A1', '7');
      assert.isTrue(aux.valid);
      done();
    });
    //#11
    test("Invalid puzzle strings fail the solver", function(done) {
      let aux = solver.validate(VALID_PUZZLE, 'A2', '5');
      assert.isFalse(aux.valid);
      assert.equal(aux.conflict[0], "row");
      assert.equal(aux.conflict[1], "column");
      assert.equal(aux.conflict[2], "region");
      done();
    });
    //#12
    test("Solver returns the expected solution for an incomplete puzzle", function(done) {
      let aux = solver.solve(VALID_PUZZLE)
      assert.equal(aux.solution, SOLUTION.solution);
      done();
    });

  });
});

