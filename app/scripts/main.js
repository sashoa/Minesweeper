import Minesweeper from './Minesweeper.js';
import options from './optionsUI.js';

let game = {
  getLocalScores: getLocalScores,
  minesweeperApp: document.getElementById('minesweeperApp'),
  gameHome: document.getElementById('gameHome'),
  scoreBoard: document.getElementById('scoreBoard')
};
addScoresToTable();


// Navigation
let homeNavBtn = document.getElementById('homeNavBtn');
let gameNavBtn = document.getElementById('gameNavBtn');
let scoreBoardNavBtn = document.getElementById('scoreBoardNavBtn');
homeNavBtn.addEventListener('click', function(event) {
  game.minesweeperApp.innerHTML = '';
  game.minesweeperApp.appendChild(game.gameHome);
  game.minesweeperApp.classList.remove('hidden');
  homeNavBtn.classList.add('active');
  game.scoreBoard.classList.add('hidden');
  scoreBoardNavBtn.classList.remove('active');
  gameNavBtn.classList.remove('active');
})
gameNavBtn.addEventListener('click', function(event) {
  game.minesweeperApp.classList.remove('hidden');
  gameNavBtn.classList.add('active');
  game.scoreBoard.classList.add('hidden');
  scoreBoardNavBtn.classList.remove('active');
  homeNavBtn.classList.remove('active');
})
scoreBoardNavBtn.addEventListener('click', function(event) {
  game.minesweeperApp.classList.add('hidden');
  homeNavBtn.classList.remove('active');
  gameNavBtn.classList.remove('active');
  game.scoreBoard.classList.remove('hidden');
  scoreBoardNavBtn.classList.add('active');
  addScoresToTable();
})


let playButton = document.getElementById('play');
playButton.addEventListener('click', () => {
  createGame();
  gameNavBtn.click();
})

function createGame() {
  showOptions();
  let createGameBtn = document.getElementById('createGame');
  createGameBtn.addEventListener('click', function(event) {
    event.preventDefault();
    let options = getOptions();
    newGame(options);
  })
}

function showOptions() {
  game.minesweeperApp = document.getElementById('minesweeperApp');
  game.minesweeperApp.innerHTML = '';
  game.minesweeperApp.appendChild(options())
  let customOptions = document.getElementById('customOptions');
  let difficulty = document.getElementById('difficulty');
  difficulty.addEventListener('change', function(event) {
    let clicked = difficulty.value;
    console.log(clicked);
    if (clicked == 'custom' && customOptions.classList.contains('hidden')) {
      customOptions.classList.remove('hidden');
    }
    else {
      customOptions.classList.add('hidden');
    }
  })
}

function getOptions() {
  let options = {};
  options.difficulty = document.getElementById('difficulty').value;
  if (options.difficulty == 'custom') {
    options.numberOfRows = document.getElementById('numberOfRows').value;
    options.numberOfColumns = document.getElementById('numberOfColumns').value;
    options.numberOfBombs = document.getElementById('numberOfMines').value;
  }
  options.seedKey = document.getElementById('seedKey').value;
  game.options = options;
  return options;
}

function getLocalScores() {
  if (localStorage.getItem('localScores') == null) {
    localStorage.setItem('localScores', JSON.stringify([]))
  }
  return JSON.parse(localStorage.getItem('localScores'));
}

function addScoresToTable() {
  let tableBody = document.querySelector('.scoreboard tbody');
  tableBody.innerHTML = '';
  let scores = game.getLocalScores();
  scores.sort(sortScores);
  for (let i = 0; i < scores.length; i++) {
    let score = scores[i];
    let tr = document.createElement('tr');
    tr.innerHTML =  `<tr>
                      <th scope="row">${i+1}</th>
                      <td>${score.name}</td>
                      <td>${score.gameKey}</td>
                      <td>${score.difficulty}</td>
                      <td>${formatTime(score.time)}</td>
                    </tr>`
    tableBody.appendChild(tr);
  }

}

function saveScore(event) {
  let record = {};
  let scores = game.getLocalScores();
  record.name = document.getElementById('playerName').value;;
  record.gameKey = game.options.seedKey;
  record.difficulty = game.options.difficulty == 'custom' ? `custom (${game.options.numberOfRows} x ${game.options.numberOfColumns})` : game.options.difficulty;
  // record.difficulty = game.options.difficulty;
  record.time = game.minesweeper.timescore;
  if (scores.some(s => (s.name == record.name && s.difficulty == record.difficulty) && s.gameKey == record.gameKey)) {
    console.log('same name and difficulty');
    let oldRecord = scores.find(s => s.name == record.name);
    if (oldRecord.time > record.time) {
      oldRecord.time = record.time;
      localStorage.setItem('localScores', JSON.stringify(scores));
      return;
    }
    if (oldRecord.time < record.time) {
      return;
    }
  }
  scores.push(record);
  localStorage.setItem('localScores', JSON.stringify(scores));
}

// function configureGame() {
//   game.minesweeperApp = document.getElementById('minesweeperApp');
//   game.minesweeperApp.innerHTML = '';
// }

function newGame(options) {
  console.log('this is: ' + this);
  game.minesweeper = new Minesweeper(options)
  game.minesweeperApp = document.getElementById('minesweeperApp');
  game.indicators = indicatorsComponent(game.minesweeper);
  game.board = minesweeperBoardComponent(game.minesweeper);
  game.board.addEventListener('mousedown', onFieldClick);
  game.board.addEventListener('contextmenu', (event) => event.preventDefault());
  game.minesweeperApp.innerHTML = '';
  game.minesweeperApp.appendChild(game.indicators);
  game.minesweeperApp.appendChild(game.board);
  addModals();
  let div = document.createElement('DIV');
  let getHintBtn = document.createElement('BUTTON');
  getHintBtn.id = 'getHint';
  getHintBtn.className = 'btn btn-primary btn-sm';
  getHintBtn.innerText = 'Get Hint';
  getHintBtn.addEventListener('click', onGetHint);
  let backBtn = document.createElement('BUTTON');
  backBtn.className = 'btn btn-sm btn-secondary';
  backBtn.innerText = 'New Game';
  backBtn.addEventListener('click', function() {
    game.minesweeper.gameStatus = 'defeated';
    createGame();
  })
  div.appendChild(getHintBtn);
  div.appendChild(backBtn);
  minesweeperApp.appendChild(div)
  updateTime();
}

function addModals() {
  // Victory Modal
  game.victoryModal = createModal({modalId: 'victoryModal',
                              modalLabelId: 'victoryLabel',
                              closeBtnLabel: 'Back',
                              yesBtnLabel: 'Save Score',
                              modalTitle: 'Victory'});
  let modalBody = game.victoryModal.querySelector('.modal-body');
  let nameInput = document.createElement('DIV');
  nameInput.className = 'input-group';
  nameInput.innerHTML = `<span class="input-group-addon">Name</span>
                         <input type="text" id="playerName" class="form-control" placeholder="Your Name">`;
  console.log('NAMEINPUT');
  console.log(nameInput);
  modalBody.appendChild(nameInput);
  console.log('MODALBODY');
  console.log(modalBody);
  let saveScoreBtn = game.victoryModal.querySelector('#modalAnswerYes');
  saveScoreBtn.addEventListener('click', () => {
    saveScore();
    $('#victoryModal').modal('hide');
  });

  // Defeated Modal
  game.defeatedModal = createModal({modalId: 'defeatedModal',
                              modalLabelId: 'defeatedLabel',
                              closeBtnLabel: 'No',
                              yesBtnLabel: 'Yes',
                              modalTitle: 'Defeated'});
  let playAgainBtn = game.defeatedModal.querySelector('#modalAnswerYes');
  playAgainBtn.addEventListener('click', function() {
    $('#defeatedModal').modal('hide');
    createGame();
  });
  game.minesweeperApp.appendChild(game.victoryModal);
  game.minesweeperApp.appendChild(game.defeatedModal);

}

function updateTime() {
  let s = setInterval(() => {
    if (game.minesweeper.gameStatus == 'defeated')
    clearInterval(s);
    let timeIndicator = document.getElementById('timescore');
    timeIndicator.innerText = formatTime(game.minesweeper.timescore);
  }, 1000);
}

function formatTime(time) {
    let minutes = ('00' + (Math.floor(time / 60))).slice(-2);
    let seconds = ('00' + (time % 60)).slice(-2);
    return minutes + ':' + seconds;
}

function onFieldClick(event) {
  if (event.button == 0)
    onFieldOpen(event);
  if (event.button == 2)
    onFieldToggleMark(event);
  updateIndicators();
  gameStatus();
}

function gameStatus() {
  let status = game.minesweeper.gameStatus;

  switch (status) {
    case 'playing':
    return;
      break;
    case 'victory':
      victory();
      break;
    case 'defeated':
      gameOver();
      break;
  
    default:
      break;
  }
}

function onFieldOpen(event) {
  let element = event.target
  if (element.classList.contains('field')) {
    let x = parseInt(element.dataset.row);
    let y = parseInt(element.dataset.col);
    let field = game.minesweeper.board.grid[x][y];
    if (!field.isOpened && !field.isMarked) {
      let fieldValue = game.minesweeper.openField(x,y);
      console.log(fieldValue);
      if (fieldValue === 'bomb') {
        element.classList.add('opened');
        element.innerHTML = '&#128165;'
        // if (game.minesweeper.isGameOver)
        //   gameOver();
      }
      else if (fieldValue === null) {
        reveal([{x,y}]);
      }
      else {
        element.classList.add('opened');
        element.innerText = field.value;
      }
    }
  }
}

function onGetHint(event) {
  let hintPosition = game.minesweeper.getHint();
  if (hintPosition === null) return;
  let x = hintPosition.x;
  let y = hintPosition.y;
  let fieldElement = document.querySelector(`[data-row="${x}"][data-col="${y}"]`)
  fieldElement.classList.add('animated');
  fieldElement.classList.add('flash');
  // fieldElement.classList.add('hint');
  updateIndicators();
}

function revealField(position) {
  let grid = game.minesweeper.board.grid;
  let x = position.x;
  let y = position.y;
  let field = grid[x][y];
  game.minesweeper.openField(x,y);
  let fieldElement = document.querySelector(`[data-row="${x}"][data-col="${y}"]`);
  fieldElement.innerHTML = field.value || '';
  fieldElement.classList.add('opened');
}

function isEmptyField(position) {
  let grid = game.minesweeper.board.grid;
  let x = position.x;
  let y = position.y;
  if (!(grid[x] && grid[x][y])) return false;
  if (grid[x][y].isOpened === true) return false;
  if (grid[x][y].value === null) 
    return true;
  else 
    return false
}

function containsPosition(position, positions) {
  return positions.some(p => p.x == position.x && p.y == position.y)
}

function isNumberField(position) {
  let grid = game.minesweeper.board.grid;
  let x = position.x;
  let y = position.y;
  if (!(grid[x] && grid[x][y])) return false;
  if (grid[x][y].isOpened === true) return false;
  if (Number.isInteger(grid[x][y].value)) 
    return true;
  else 
    return false
}

function reveal(emptyFieldPositions) {
  if (emptyFieldPositions.length === 0) return
  let position = emptyFieldPositions.shift();
  // setTimeout(() => revealField(position));
  revealField(position);
  revealSurroundingNumbers(position);
  
  let x = position.x - 1;
  let y = position.y;
  if (isEmptyField({x,y}) && !containsPosition({x,y}, emptyFieldPositions)) {
    emptyFieldPositions.push({x,y});
    console.log('GOT IN first');
  }
  x = position.x;
  y = position.y + 1;
  if (isEmptyField({x,y}) && !containsPosition({x,y}, emptyFieldPositions)) {
    emptyFieldPositions.push({x,y});
    console.log('GOT IN second');
  }
  x = position.x + 1;
  y = position.y;
  if (isEmptyField({x,y}) && !containsPosition({x,y}, emptyFieldPositions)) {
    emptyFieldPositions.push({x,y});
    console.log('GOT IN third');
  }
  x = position.x;
  y = position.y - 1;
  if (isEmptyField({x,y}) && !containsPosition({x,y}, emptyFieldPositions)) {
    emptyFieldPositions.push({x,y});
    console.log('GOT IN fourth');
  }

  console.log(emptyFieldPositions.length);
  reveal(emptyFieldPositions);
}

function revealSurroundingNumbers(position) {
  let x = position.x - 1;
  let y = position.y - 1;
  if (isNumberField({x,y})) {
    revealField({x,y})
    console.log('GOT IN first');
  }
  x = position.x - 1;
  y = position.y;
  if (isNumberField({x,y})) {
    revealField({x,y})
    console.log('GOT IN second');
  }
  x = position.x - 1;
  y = position.y + 1;
  if (isNumberField({x,y})) {
    revealField({x,y})
    console.log('GOT IN third');
  }
  x = position.x;
  y = position.y - 1;
  if (isNumberField({x,y})) {
    revealField({x,y})
    console.log('GOT IN fourth');
  }
  x = position.x;
  y = position.y + 1;
  if (isNumberField({x,y})) {
    revealField({x,y})
    console.log('GOT IN fourth');
  }
  x = position.x + 1;
  y = position.y - 1;
  if (isNumberField({x,y})) {
    revealField({x,y})
    console.log('GOT IN fourth');
  }
  x = position.x + 1;
  y = position.y;
  if (isNumberField({x,y})) {
    revealField({x,y})
    console.log('GOT IN fourth');
  }
  x = position.x + 1;
  y = position.y + 1;
  if (isNumberField({x,y})) {
    revealField({x,y})
    console.log('GOT IN fourth');
  }
}

function onFieldToggleMark(event) {
  let element = event.target;
  if (element.classList.contains('field')) {
    let x = element.dataset.row;
    let y = element.dataset.col;
    let field = game.minesweeper.board.grid[x][y];
    if (!field.isOpened) {
      let flag = game.minesweeper.toggleMarkField(x,y);

      if (flag) {
        element.classList.add('flag');
        element.innerHTML = '&#9873;'
      }
      if (flag === false)
        element.innerHTML = '';
    }
    console.log(game.minesweeper.minesLeft());
  }

}

function gameOver() {
  game.board.removeEventListener('mousedown', onFieldClick);
  let minesweeperApp = document.getElementById('minesweeperApp');
  let gameOver = document.createElement('P');
  gameOver.innerText = 'GAME OVER';
  gameOver.classList.add('game-over');
  minesweeperApp.appendChild(gameOver);
  clearInterval(game.minesweeper.timer);
  let defeatedMessage = game.defeatedModal.querySelector('#defeatedModal .modal-body');
  defeatedMessage.innerText = 'Defeated, Try again?'

  $('#defeatedModal').modal('show');
}

function victory() {
  game.board.removeEventListener('mousedown', onFieldClick);
  let minesweeperApp = document.getElementById('minesweeperApp');
  let victory = document.createElement('P');
  victory.innerText = 'VICTORY';
  victory.classList.add('victory');
  minesweeperApp.appendChild(victory);
  clearInterval(game.minesweeper.timer);
  let victoryMessage = game.victoryModal.querySelector('#victoryModal .modal-body');
  victoryMessage.innerText = `Victory, Your Time is: ${formatTime(game.minesweeper.timescore)}`
  let nameInput = document.createElement('DIV');
  nameInput.className = 'input-group';
  nameInput.innerHTML = `<span class="input-group-addon">Name</span>
                         <input type="text" id="playerName" class="form-control" placeholder="Your Name">`;
  victoryMessage.appendChild(nameInput);

  $('#victoryModal').modal('show');
}

function updateIndicators() {
  let hintsLeft = document.getElementById('hintsLeft');
  let livesLeft = document.getElementById('livesLeft');
  let minesLeft = document.getElementById('minesLeft');

  hintsLeft.innerText = game.minesweeper.availableHints;
  livesLeft.innerText = game.minesweeper.availableLives;
  minesLeft.innerText = game.minesweeper.minesLeft();

}

function indicatorsComponent(minesweeper) {
  let indicators = document.createElement('ul');
  indicators.id = 'indicators';

  let timescore = document.createElement('li');
  timescore.innerHTML = 'Time: <span id="timescore">00:00</span>';
  indicators.appendChild(timescore);
  let lives = document.createElement('li');
  lives.innerHTML = `Lives left: <span id="livesLeft">${game.minesweeper.availableLives}</span>`;
  indicators.appendChild(lives);
  let hints = document.createElement('li');
  hints.innerHTML = `Hints left: <span id="hintsLeft">${game.minesweeper.availableHints}</span>`;
  indicators.appendChild(hints);
  let minesLeft = document.createElement('li');
  minesLeft.innerHTML = `Mines left: <span id="minesLeft">${game.minesweeper.minesLeft()}</span>`;
  indicators.appendChild(minesLeft);
  return indicators;
}

function minesweeperBoardComponent(minesweeper) {

  let gameBoard = document.createElement('DIV');
  gameBoard.id = 'gameBoard';

  let grid = minesweeper.board.grid;

  let domFields = document.createDocumentFragment();

  for (var i = 0; i < grid.length; i++) {
    var row = grid[i];
    for (var j = 0; j < row.length; j++) {
      var field = row[j];
      // console.log('FIELD VALUE');
      // console.log(field.value);
      let domField = createDomField(i,j);
      if (j == 0) domField.classList.add('clear-left');
      domFields.appendChild(domField)
    }
  }
  gameBoard.appendChild(domFields);
  return gameBoard;
}

function createDomField(x, y) {
  let field = document.createElement('DIV');
  field.classList.add('field');
  field.dataset.row = x;
  field.dataset.col = y;
  // console.log(field.textContent);
  return field;
}

function createModal(config) {
  let modal =  document.getElementById('myModal').cloneNode(true);
  modal.id = `${config.modalId}`
  modal.setAttribute('aria-labelledBy', config.modalLabelId)
  let title = modal.querySelector('#exampleModalLabel');
  title.id = `${config.modalLabel}`;
  title.innerText = config.modalTitle;
  let footer = modal.querySelector('.modal-footer');
  if (config.closeBtnLabel) {
    let closeBtn = document.createElement('BUTTON');
    closeBtn.className = 'btn btn-secondary';
    closeBtn.dataset['dismiss'] = 'modal';
    closeBtn.innerText = config.closeBtnLabel;
    footer.appendChild(closeBtn);
  }
  if (config.yesBtnLabel) {
    let yesBtn = document.createElement('BUTTON');
    yesBtn.id = 'modalAnswerYes';
    yesBtn.className = 'btn btn-primary';
    yesBtn.innerText = config.yesBtnLabel;
    footer.appendChild(yesBtn);
  }

  return modal;
}

function sortScores(a, b) {
    if (a.difficulty == 'hard') {
      if (b.difficulty == 'hard')
        return a.time - b.time;
      else return -1;
    }
    else if (b.difficulty == 'hard') {
      if (a.difficulty == 'hard')
        return a.time - b.time;
      else return 1;
    }
    else if (a.difficulty == 'medium') {
      if (b.difficulty == 'medium')
        return a.time - b.time;
      else return -1;
    }
    else if (b.difficulty == 'medium') {
      if (a.difficulty == 'medium')
        return a.time - b.time;
      else return 1;
    }
    else if (a.difficulty == 'easy') {
      if (b.difficulty == 'easy')
        return a.time - b.time;
      else return -1;
    }
    else if (b.difficulty == 'easy') {
      if (a.difficulty == 'easy')
        return a.time - b.time;
      else return 1;
    }
}

// let domFields = document.createDocumentFragment(); 
// console.log(board.grid[0][0].value + ', ' + board.grid[0][1].value, ', ' + board.grid[0][2].value)


// for (var i = 0; i < board.grid.length; i++) {
//   var row = board.grid[i];
//   for (var j = 0; j < row.length; j++) {
//     var field = row[j];
//     // console.log('FIELD VALUE');
//     // console.log(field.value);
//     let domField = createDomField(field.value);
//     if (j == 0) domField.classList.add('clear-left');
//     domFields.appendChild(domField)
//   }
// }
// testMinesweeper.appendChild(domFields);

// console.log(testMinesweeper);


// Sliders