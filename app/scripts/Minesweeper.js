import Board from './Board.js';

export default class Minesweeper {
  constructor(options) {
    this.board = new Board(options);

  }
}