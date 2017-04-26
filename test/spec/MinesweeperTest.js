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
  it('Can mark a board field', function () {
    let options = {
      difficulty: 'medium',
      seedKey: 'sashe'
    };
    let minesweeper = new Minesweeper(options)
    expect(minesweeper).to.have.property('toggleMarkField');

    expect(minesweeper.board.grid[0][5].isMarked).to.be.false;
    let operationResult = minesweeper.toggleMarkField(0,5);
    expect(minesweeper.board.grid[0][5].isMarked).to.be.true;
    expect(operationResult).to.be.true;
    operationResult = minesweeper.openField(0,4);
    operationResult = minesweeper.toggleMarkField(0,4);
    expect(operationResult).to.be.null;
    // operationResult = minesweeper.openField(0,2);
    // expect(operationResult).to.equal(3);
  });
  it('Can unmark a board field', function () {
    let options = {
      difficulty: 'medium',
      seedKey: 'sashe'
    };
    let minesweeper = new Minesweeper(options)
    expect(minesweeper).to.have.property('toggleMarkField');

    expect(minesweeper.board.grid[0][5].isMarked).to.be.false;
    let operationResult = minesweeper.toggleMarkField(0,5);
    expect(minesweeper.board.grid[0][5].isMarked).to.be.true;
    expect(operationResult).to.be.true;
    operationResult = minesweeper.toggleMarkField(0,5);
    expect(minesweeper.board.grid[0][5].isMarked).to.be.false;
    expect(operationResult).to.be.false;
    operationResult = minesweeper.openField(0,4);
    operationResult = minesweeper.toggleMarkField(0,4);
    expect(operationResult).to.be.null;
    // operationResult = minesweeper.openField(0,2);
    // expect(operationResult).to.equal(3);
  });
  it('Can provide hints (revealing a non-mine field)', function () {
    let options = {
      difficulty: 'medium',
      seedKey: 'sashe'
    };
    let minesweeper = new Minesweeper(options);
    expect(minesweeper).to.have.property('getHint');
    let hint = minesweeper.getHint(); 
    let field = minesweeper.board.grid[hint.x][hint.y];
    expect(field.value).to.not.equal('bomb');
  });
  it('Can not provide more than 3 hints', function () {
    let options = {
      difficulty: 'medium',
      seedKey: 'sashe'
    };
    let minesweeper = new Minesweeper(options);
    expect(minesweeper).to.have.property('getHint');
    let hint, field;
    for (var i = 0; i < 3; i++) {
      hint = minesweeper.getHint(); 
      field = minesweeper.board.grid[hint.x][hint.y];
      expect(field.value).to.not.equal('bomb');
    }
    hint = minesweeper.getHint(); 
    expect(hint).to.be.null;
  });
});