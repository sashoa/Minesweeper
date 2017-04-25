import Field from './Field.js';
export default class Board {
  constructor(options) {
    options = configure(options);
    this.grid = makeGrid(options)

  function configure(options) {
    let configuredOptions = {};
    switch (options.difficulty) {
      case 'custom':
        if (options.hasOwnProperty('numberOfRows')
            && options.hasOwnProperty('numberOfColumns')
            && options.hasOwnProperty('numberOfBombs')) {
          let numOfRows = options.numberOfRows;
          let numOfColumns = options.numberOfColumns;
          let numOfBombs = options.numberOfBombs;
          let maxNumOfBombs = Math.round((numOfRows * numOfColumns) * 0.6);

          if (numOfRows > 24) {
            console.log('The maximum number of rows allowed is 24');
            numOfRows = 24;
          }
          if (numOfRows < 9) {
            console.log('The minimum number of rows allowed is 9');
            numOfRows = 9;
          }
          if (numOfColumns > 30) {
            console.log('The maximum number of columns allowed is 30');
            numOfColumns = 30;
          }
          if (numOfColumns < 9) {
            console.log('The minimum number of colums allowed is 9');
            numOfColumns = 9;
          }
          if (numOfBombs > maxNumOfBombs) {
            console.log(`The maximum number of columns allowed is ${maxNumOfBombs}`);
            numOfBombs = maxNumOfBombs;
          }
          if (numOfBombs < 10) {
            console.log('The minimum number of colums allowed is 9');
            numOfBombs = 10;
          }
          configuredOptions.difficulty = 'custom';
          configuredOptions.numberOfRows = numOfRows;
          configuredOptions.numberOfColumns = numOfColumns;
          configuredOptions.numberOfBombs = numOfBombs;
        }
        else {
          throw new Error('Custom options must have numberOfRows, numberOfColumns and numberOfBombs');
          return;
        }
        break;
      case 'easy':
        configuredOptions.difficulty = 'easy';
        configuredOptions.numberOfRows = 9;
        configuredOptions.numberOfColumns = 9;
        configuredOptions.numberOfBombs = Math.round(81 * 15 / 100);
        break;
      case 'medium':
        configuredOptions.difficulty = 'medium';
        configuredOptions.numberOfRows = 16;
        configuredOptions.numberOfColumns = 16;
        configuredOptions.numberOfBombs = Math.round(256 * 18 / 100);
        break;
      case 'hard':
        configuredOptions.difficulty = 'hard';
        configuredOptions.numberOfRows = 24;
        configuredOptions.numberOfColumns = 30;
        configuredOptions.numberOfBombs = Math.round(720 * 25 / 100);
        break;
      default:
        throw new Error('Invalid difficulty value');
        break;
    }
    return configuredOptions;
  }

  function makeGrid(options) {
    let rows = options.numberOfRows;
    let columns = options.numberOfColumns;


    let numberOfAllFields = rows * columns

    let allFields = [];
    for (let i = 0; i < numberOfAllFields; i++) {
        allFields[i] = new Field();
    }

    addBombs(allFields, options);

    let grid = [];
    for (var i = 0; i < rows; i++) {
      let row = [];
      for (var j = 0; j < columns; j++) {
        row.push(allFields.shift())
      }
      grid.push(row);
    }

    addNumbers(grid, options);

    console.log('THE GRID');
    console.log(grid);
    return grid;
  }

  function addBombs(allFields, options) {
    let numberOfAllFields = options.numberOfRows * options.numberOfColumns
    let arr = [];
    for (let i = 0; i < numberOfAllFields; i++) {
      arr[i] = i;
    }
    arr.sort(() => Math.random() - 0.5);

    let bombFields = arr.slice(0, options.numberOfBombs);
    console.log('BOMB FIELDS: ' + bombFields);

    for (let i = 0; i < allFields.length; i++) {
      if (bombFields.indexOf(i) !== -1) {
        allFields[i].value = 'bomb';
      }
    }
  }

  function addNumbers(grid, options) {
    for (let i = 0; i < grid.length; i++) {
      let column = grid[i];
      for(let j = 0; j < column.length; j++) {
        if (grid[i][j].value !== 'bomb') {
          grid[i][j].value = getNumberOfNeighborBombs(grid, i, j);
        }
      }
    }
  }

  function getNumberOfNeighborBombs(grid, row, col) {
    let counter = 0;
    let currentCheckField;

    if (grid[row -1]) {
      currentCheckField = grid[row -1][col -1];
      if(isBomb(currentCheckField))
        counter++;
      currentCheckField = grid[row -1][col];
      if(isBomb(currentCheckField))
        counter++;
      currentCheckField = grid[row -1][col +1];
      if(isBomb(currentCheckField))
        counter++;
    }

    currentCheckField = grid[row][col -1];
    if (isBomb(currentCheckField))
      counter++;
    currentCheckField = grid[row][col +1];
    if (isBomb(currentCheckField))
      counter++;
      
    if (grid[row +1]) {
      currentCheckField = grid[row +1][col -1];
      if (isBomb(currentCheckField))
        counter++;
      currentCheckField = grid[row +1][col];
      if (isBomb(currentCheckField))
        counter++;
      currentCheckField = grid[row +1][col +1];
      if (isBomb(currentCheckField))
        counter++;
    }
    
    if (counter === 0)
      return null;
    else
      return counter;
  }

  function isBomb(field) {
    return field !== undefined && field.value === 'bomb';
  }

  }






}