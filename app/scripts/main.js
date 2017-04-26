import Field from './Field.js';
import Board from './Board.js';

let testMinesweeper = document.getElementById('testMinesweeper');
let board = new Board({ numberOfRows: 15,
                        numberOfColumns: 20,
                        numberOfBombs: 50,
                        seedKey: 'sashe',
                        difficulty: 'medium'});

let domFields = document.createDocumentFragment();

console.log(board.grid[0][0].value + ', ' + board.grid[0][1].value, ', ' + board.grid[0][2].value)


for (var i = 0; i < board.grid.length; i++) {
  var row = board.grid[i];
  for (var j = 0; j < row.length; j++) {
    var field = row[j];
    // console.log('FIELD VALUE');
    // console.log(field.value);
    let domField = createDomField(field.value);
    if (j == 0) domField.classList.add('clear-left');
    domFields.appendChild(domField)
  }
}
testMinesweeper.appendChild(domFields);

console.log(testMinesweeper);

function createDomField(value) {
  if (value == 'bomb') value = '*';
  let field = document.createElement('DIV');
  field.classList.add('field');
  value = document.createTextNode(value || '');
  field.appendChild(value);
  // console.log(field.textContent);
  return field;
}

let sashe = createDomField('bomb');
console.log(sashe);