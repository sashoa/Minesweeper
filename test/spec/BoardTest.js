import Board from '../../app/scripts/Board.js';
import Field from '../../app/scripts/Field.js'

let options = {difficulty: 'custom', numberOfBombs: 0, numberOfRows: 0, numberOfColumns: 0}
describe('Board', function () {
  it('should have a grid', function () {
    options.numberOfRows = 9;
    options.numberOfColumns = 9;
    let board = new Board(options);
    // console.log(board.grid);
    expect(board).to.have.property('grid');
  });
  it('contains only fields of type Field', function () {
    options.numberOfRows = 9;
    options.numberOfColumns = 9;
    let board = new Board(options);
    // console.log(board.grid);
    for (var i = 0; i < board.grid.length; i++) {
      var row = board.grid[i];
      for (var i = 0; i < row.length; i++) {
        var field = row[i];
        expect(field).to.be.an.instanceof(Field);
      }
    }
  });
  it('should contain maximum 24 rows', function () {
    options.numberOfRows = 30;
    options.numberOfColumns = 30;
    let board = new Board(options);
    // console.log(board.grid);
    expect(board.grid).to.have.length.below(25);
  });
  it('should contain minimum 9 rows', function () {
    options.numberOfRows = 4;
    options.numberOfColumns = 30;
    let board = new Board(options);
    // console.log(board.grid);
    expect(board.grid).to.have.length.above(8);
  });
  it('should contain maximum 30 columns', function () {
    options.numberOfRows = 10;
    options.numberOfColumns = 31;
    let board = new Board(options);
    // console.log(board.grid);
    for (var i = 0; i < board.grid.length; i++) {
      var column = board.grid[i];
      expect(column).to.have.length.below(31);
    }
  });
  it('should contain minimum 9 columns', function () {
    options.numberOfRows = 10;
    options.numberOfColumns = 8;
    let board = new Board(options);
    // console.log(board.grid);
    for (var i = 0; i < board.grid.length; i++) {
      var column = board.grid[i];
      expect(column).to.have.length.above(8);
    }
  });
  it('should contain 81 fields for 9 x 9 grid (easy)', function () {
    options.difficulty = 'easy';
    let board = new Board(options);
    // console.log(board.grid);
    let numberOfFields = 0;
    for (var i = 0; i < board.grid.length; i++) {
      var column = board.grid[i];
      numberOfFields += column.length;
    }
    expect(numberOfFields).to.equal(81);
  });
  it('should contain 256 fields for 16 x 16 grid (medium)', function () {
    options.difficulty = 'medium';
    let board = new Board(options);
    // console.log(board.grid);
    let numberOfFields = 0;
    for (var i = 0; i < board.grid.length; i++) {
      var column = board.grid[i];
      numberOfFields += column.length;
    }
    expect(numberOfFields).to.equal(256);
  });
  it('should contain 720 fields for 24 x 30 grid (hard)', function () {
    options.difficulty = 'hard';
    let board = new Board(options);
    // console.log(board.grid);
    let numberOfFields = 0;
    for (var i = 0; i < board.grid.length; i++) {
      var column = board.grid[i];
      numberOfFields += column.length;
    }
    expect(numberOfFields).to.equal(720);
  });
  it('should contain minumum 10 bombs', function () {
    options.difficulty = 'custom';
    options.numberOfRows = 10;
    options.numberOfColumns = 15;
    options.numberOfBombs = 9;
    let board = new Board(options);
    // console.log(board.grid);
    let numberOfBombs = board.grid.reduce((a = {}, b) => a.concat(b))
                                  .filter(f => f.value == 'bomb')
                                  .length;
    // console.log('here');
    // console.log(numberOfBombs);
    for (let i = 0; i < board.grid.length; i++) {
      var column = board.grid[i];
      for (let j = 0; j < column.length; j++) {
        let field = column[j];
        if (field == 'bomb')
          numberOfBombs++;
      }
    }
    expect(numberOfBombs).to.be.above(9);
  });
  it('should not contain more bombs than 60% of total number of fields', function () {
    options.difficulty = 'custom';
    options.numberOfRows = 10;
    options.numberOfColumns = 15;
    options.numberOfBombs = 100;
    let maximumBombs = Math.round((options.numberOfRows * options.numberOfColumns) * 0.6);
    let board = new Board(options);
    // console.log(board.grid);
    let numberOfBombs = board.grid.reduce((a = {}, b) => a.concat(b))
                                  .filter(f => f.value == 'bomb')
                                  .length;
    console.log('here');
    console.log(numberOfBombs);
    for (let i = 0; i < board.grid.length; i++) {
      var column = board.grid[i];
      for (let j = 0; j < column.length; j++) {
        let field = column[j];
        if (field == 'bomb')
          numberOfBombs++;
      }
    }
    console.log(`number of bombs: ${numberOfBombs}, maximum bombs: ${maximumBombs}`);
    expect(numberOfBombs).to.be.below(maximumBombs + 1);
  });
  it('It Can generate a specific grid multiple times based on a seed key', function () {
    options.difficulty = 'medium';
    options.seedKey = 'sashe';
    let boardOne = new Board(options);
    let boardTwo = new Board(options);
    // console.log(board.grid);

    let areEqual = true;
    if (boardOne.grid.length !== boardTwo.grid.length)
      areEqual = false;
    for (var i = 0; i < boardOne.grid.length; i++) {
      if (boardOne.grid[i].length !== boardTwo.grid[i].length)
        areEqual = false;
      for (var j = 0; j < boardOne.grid[i].length; j++) {
        var boardOneElement = boardOne.grid[i][j];
        var boardTwoElement = boardTwo.grid[i][j];
        console.log(`Board One Element: ${boardOneElement.value} -- Board Two Element: ${boardTwoElement.value}`)
        if (boardOneElement.value != boardTwoElement.value)
          areEqual = false;
      }
    }
    expect(areEqual).to.be.true
  });
});