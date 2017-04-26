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
});