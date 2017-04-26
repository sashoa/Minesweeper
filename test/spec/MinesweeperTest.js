import Minesweeper from '../../app/scripts/Minesweeper.js';
import Board from '../../app/scripts/Board.js';

describe('Minesweeper', function() {
  it('Initializes a board', function () {
    let options = {
      difficulty: 'medium',
      seedKey: 'sashe'
    };
    let minesweeper = new Minesweeper(options)
    minesweeper.should.have.property('board');

    let minesweeperGrid = minesweeper.board.grid;
    let boardGrid = new Board(options).grid;
    let areEqual = true;

    if (minesweeperGrid.length !== boardGrid.length)
      areEqual = false;
    for (var i = 0; i < minesweeperGrid.length; i++) {
      if (minesweeperGrid[i].length !== boardGrid[i].length)
        areEqual = false;
      for (var j = 0; j < minesweeperGrid[i].length; j++) {
        var minesweeperGridElement = minesweeperGrid[i][j];
        var boardGridElement = boardGrid[i][j];
        console.log(`Board One Element: ${minesweeperGridElement.value} -- Board Two Element: ${boardGridElement.value}`)
        if (minesweeperGridElement.value != boardGridElement.value)
          areEqual = false;
      }
    }
    expect(areEqual).to.be.true;

  });
  it('Can open a board field', function () {
    let options = {
      difficulty: 'medium',
      seedKey: 'sashe'
    };
    let minesweeper = new Minesweeper(options)
    expect(minesweeper).to.have.property('openField');

    console.log(minesweeper.board.grid);
    let operationResult = minesweeper.openField(0,0);
    expect(minesweeper.board.grid[0][0].isOpened).to.be.true;
    expect(operationResult).to.be.null;
    operationResult = minesweeper.openField(0,4);
    expect(operationResult).to.equal(2);
    operationResult = minesweeper.openField(0,5);
    expect(operationResult).to.equal('bomb');
    // operationResult = minesweeper.openField(0,2);
    // expect(operationResult).to.equal(3);
  });
});