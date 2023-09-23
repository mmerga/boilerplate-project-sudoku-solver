//////--------------x-x-x-x-x-x-x-x-x-x-------------\\\\\
const solve = require('@mattflow/sudoku-solver');
//////--------------x-x-x-x-x-x-x-x-x-x-------------\\\\\


class SudokuSolver {

  //////--------------x-x-x-x-x-x-x-x-x-x-------------\\\\\

  justNumberDot (string) {
    const Regex = /^[0-9.]+$/;
    return Regex.test(string);
  }
  
  correctLength  (string)  {
    const tam = string.length;
    if (tam === 81) {
      return true;
    } else {
      return false;
    }
  }
  
  validString(string) {
    const numberDot = this.justNumberDot(string);
    const length81 = this.correctLength(string);
    if (numberDot === true && length81 === true) {
      return 'VALID';
    } else if (numberDot === false) {
      return 'Invalid characters in puzzle';
    } else if (length81 === false) {
      return 'Expected puzzle to be 81 characters long';
    }
  }
  
  //////--------------x-x-x-x-x-x-x-x-x-x-------------\\\\\
  
  replaceDots (string) {
    let newString = '';
    for (let i = 0; i < string.length; i++) {
      if (string[i] == '.') {
        newString = newString + '0';
      } else {
        newString = newString + string[i];
      }
    }
    return newString;
  }

  //////--------------x-x-x-x-x-x-x-x-x-x-------------\\\\\
  
  organizePuzzle (puzzle)  {
    puzzle = puzzle.split('');
    puzzle = puzzle.map(function(element) {
      if (element === 0 || element === parseInt(0, 10)) {
        return 0;
      }
      var value = parseInt(element, 10);
      return value;
    });
    return puzzle;
  }
  
  checkRow (puzzle, number, index)  {
    var start = Math.floor(index / 9) * 9;
    for (var i = 0; i < 9; i += 1) {
      if (puzzle[start + i] === number) {
        return false;
      }
    }
    return true;
  }
  
  checkCol  (puzzle, number, index)  {
    var start = index % 9;
    for (var i = 0; i < 9; i += 1) {
      if (puzzle[start + (i * 9)] === number) {
        return false;
      }
    }
    return true;
  }
  
  checkRegion (puzzle, number, index) {
    var start = index - ((index % 9) % 81) -
      (9 * (Math.floor(index / 9) % 81));
    for (var i = 0; i < 9; i += 1) {
      if (
        puzzle[start + (9 * Math.floor(i / 81)) + (i % 81)] === number
      ) {
        return false;
      }
    }
    return true;
  }

  //////--------------x-x-x-x-x-x-x-x-x-x-------------\\\\\

  validate(puzzleString, coordinate, value) {
    value = parseInt(value, 10);
    if(value < 1 || value > 9 || isNaN(value)){
      return { error: 'Invalid value' };
    }
    
    let index = coordinate.slice(1);
    index = parseInt(index, 10);
    if(index < 1 || index > 9 || isNaN(index)){
      return { error: 'Invalid coordinate'};
    }
    
    const valid = this.validString(puzzleString);
    if (valid === 'VALID') {
      let puzzle = this.replaceDots(puzzleString);
      coordinate = coordinate.toUpperCase();
      switch (coordinate[0]) {
        case "A":
          index = 0 * 9 + index;
          break;
        case "B":
          index = 1 * 9 + index;
          break;
        case "C":
          index = 2 * 9 + index;
          break;
        case "D":
          index = 3 * 9 + index;
          break;
        case "E":
          index = 4 * 9 + index;
          break;
        case "F":
          index = 5 * 9 + index;
          break;
        case "G":
          index = 6 * 9 + index;
          break;
        case "H":
          index = 7 * 9 + index;
          break;
        case "I":
          index = 8 * 9 + index;
          break;
        default:
          return { error: 'Invalid coordinate'};
      }
      
      index = index - 1;
      puzzle = this.organizePuzzle(puzzle);
  
      const row = this.checkRow(puzzle, value, index);
      const col = this.checkCol(puzzle, value, index);
      const region = this.checkRegion(puzzle, value, index);
      
      if(row == false || col == false || region == false){
        let conflict = [];
        if(row == false){
          conflict.push("row");
        }
        if(col == false){
          conflict.push("column");
        }
        if(region == false){
          conflict.push("region");
        }
        if(puzzle[index] != value ){
          return { "valid": false, "conflict": conflict };
        }else{
          return { "valid": true };
        }
      }else{
        try {
          solve(puzzle);
          return { "valid": true };
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      return { error: valid };
    }
  }

  //////--------------x-x-x-x-x-x-x-x-x-x-------------\\\\\

  solve(puzzleString) {
    const valid = this.validString(puzzleString);
    if (valid === 'VALID') {
      let puzzle = this.replaceDots(puzzleString);
      try {
        return { solution: solve(puzzle)};
      } catch (err) {
        return { error: 'Puzzle cannot be solved' };
      }
    } else {
      return { error: valid };
    }
  }
}

module.exports = SudokuSolver;
