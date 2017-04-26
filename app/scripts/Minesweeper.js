import Board from './Board.js';

export default class Minesweeper {
  constructor(options) {
    this.board = new Board(options);
    this.availableHints = 3;
  }
    openField(x, y) {
      let field = this.board.grid[x][y];
      field.isOpened = true;
      return field.value;
    };
    toggleMarkField(x, y) {
      let field = this.board.grid[x][y];
      if (field.isOpened)
        return null;
      field.isMarked = field.isMarked ? false : true;
      return field.isMarked;
    };
    getHint() {
      if (this.availableHints === 0) return null
      this.availableHints--;
      let nonBombFields = [];
      let board = this.board.grid;
      for (let i = 0; i < board.length; i++) {
        let row = board[i];
        for (let j = 0; j < row.length; j++) {
          let field = row[j];
          if ((field.value != 'bomb') && (!field.isMarked && !field.isOpened))
          nonBombFields.push({ x: i, y: j });
        }
      }
      return nonBombFields[Math.floor(Math.random() * nonBombFields.length)];
    }
}