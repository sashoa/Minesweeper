import Board from './Board.js';

export default class Minesweeper {
  constructor(options) {
    this.board = new Board(options);
  }
    openField(x, y) {
      let field = this.board.grid[x][y];
      field.isOpened = true;
      return field.value;
    };
}