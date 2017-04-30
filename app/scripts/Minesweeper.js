import Board from './Board.js';

export default class Minesweeper {
  constructor(options) {
    this.board = new Board(options);
    this.isGameOver = false;
    this.gameStatus = 'playing';
    this.markedFields = 0;
    this.numberOfMines = this.getNumberOfMines()
    this.availableHints = 3;
    this.availableLives = 1;
    this.timescore = 0;
    this.timer = setInterval(() => {
        this.timescore++;
      }, 1000);
}

    // startTimer() {
    //   setInterval(() => {
    //     this.timescore++;
    //   }, 1000);
    // }

    getNumberOfMines() {
      let numberOfMines = 0;
      let grid = this.board.grid;
      for (let i = 0; i < grid.length; i++) {
        let row = grid[i];
        for (let j = 0; j < row.length; j++) {
          var field = row[j];
          if (field.value === 'bomb')
            numberOfMines++;
        }
      }
      return numberOfMines;
    }

    openField(x, y) {
      let field = this.board.grid[x][y];
      field.isOpened = true;
      if (field.value === 'bomb') {
        if (this.availableLives > 0)
          this.availableLives--;
        else {
          this.isGameOver = true;
          this.gameStatus = 'defeated';
        }
      }
      this.checkVictory();
      return field.value;
    };
    toggleMarkField(x, y) {
      let field = this.board.grid[x][y];
      if (field.isOpened)
        return null;
      if (field.isMarked) {
        this.markedFields--
        field.isMarked = false;
      }
      else {
        this.markedFields++
        field.isMarked = true;
      }
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
          if (field.isOpened)
            this.getNeighbourNonBombFields({x:i, y:j}, nonBombFields);
          // if ((field.value != 'bomb') && (!field.isMarked && !field.isOpened))
          // nonBombFields.push({ x: i, y: j });
        }
      }
      return nonBombFields[Math.floor(Math.random() * nonBombFields.length)];
    }

    getNeighbourNonBombFields(position, nonBombFields) {
      let x = position.x - 1;
      let y = position.y - 1;
      if (this.potentialHint({x,y})) {
        nonBombFields.push({x,y});
      }

      x = position.x - 1;
      y = position.y;
      if (this.potentialHint({x,y})) {
        nonBombFields.push({x,y});
      }

      x = position.x - 1;
      y = position.y + 1;
      if (this.potentialHint({x,y})) {
        nonBombFields.push({x,y});
      }

      x = position.x;
      y = position.y - 1;
      if (this.potentialHint({x,y})) {
        nonBombFields.push({x,y});
      }

      x = position.x;
      y = position.y + 1;
      if (this.potentialHint({x,y})) {
        nonBombFields.push({x,y});
      }

      x = position.x + 1 ;
      y = position.y - 1;
      if (this.potentialHint({x,y})) {
        nonBombFields.push({x,y});
      }

      x = position.x + 1 ;
      y = position.y;
      if (this.potentialHint({x,y})) {
        nonBombFields.push({x,y});
      }

      x = position.x + 1 ;
      y = position.y + 1;
      if (this.potentialHint({x,y})) {
        nonBombFields.push({x,y});
      }
    }

    potentialHint(position) {
      let grid = this.board.grid;
      let x = position.x;
      let y = position.y;

      if (!grid[x] || !grid[x][y])
        return false;
      if (grid[x][y].isMarked || grid[x][y].isOpened)
        return false;
      if (grid[x][y].value !== 'bomb' && Number.isInteger(grid[x][y].value))
        return true
      return false
    }

    minesLeft() {
      return this.numberOfMines - this.markedFields;
    }

    checkVictory() {
      let nonBombFields = [];
      let grid = this.board.grid;
      for (let i = 0; i < grid.length; i++) {
        let row = grid[i];
        for (let j = 0; j < row.length; j++) {
          let field = row[j];
          if (field.value !== 'bomb')
            nonBombFields.push(field);
        }
      }
      let victory = nonBombFields.every(f => f.isOpened);
      if (victory)
        this.gameStatus = 'victory';
    }

}