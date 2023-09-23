'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

//////--------------x-x-x-x-x-x-x-x-x-x-------------\\\\\

module.exports = function(app) {

  let Sudoku = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      const coordinate = req.body.coordinate;
      const value = req.body.value;
      if(puzzle && coordinate && value ){
        res.json(Sudoku.validate(puzzle, coordinate, value));
      }else{
        res.json({ error: 'Required field(s) missing' });
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      if(puzzle){
        const aux = Sudoku.solve(puzzle);
        res.json(aux);
      }else{
         res.json({ error: 'Required field missing' });
      }
    });
};
