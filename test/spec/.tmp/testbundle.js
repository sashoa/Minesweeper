(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Field = require('./Field.js');

var _Field2 = _interopRequireDefault(_Field);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gen = require('random-seed');

var Board = function Board(options) {
  _classCallCheck(this, Board);

  options = configure(options);
  this.grid = makeGrid(options);

  function configure(options) {
    var configuredOptions = {};
    configuredOptions.seedKey = options.hasOwnProperty('seedKey') ? options.seedKey : null;
    switch (options.difficulty) {
      case 'custom':
        if (options.hasOwnProperty('numberOfRows') && options.hasOwnProperty('numberOfColumns') && options.hasOwnProperty('numberOfBombs')) {
          var numOfRows = options.numberOfRows;
          var numOfColumns = options.numberOfColumns;
          var numOfBombs = options.numberOfBombs;
          var maxNumOfBombs = Math.round(numOfRows * numOfColumns * 0.6);

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
            console.log('The maximum number of columns allowed is ' + maxNumOfBombs);
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
        } else {
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
    var rows = options.numberOfRows;
    var columns = options.numberOfColumns;

    var numberOfAllFields = rows * columns;

    var allFields = [];
    for (var _i = 0; _i < numberOfAllFields; _i++) {
      allFields[_i] = new _Field2.default();
    }

    addBombs(allFields, options);

    var grid = [];
    for (var i = 0; i < rows; i++) {
      var row = [];
      for (var j = 0; j < columns; j++) {
        row.push(allFields.shift());
      }
      grid.push(row);
    }

    addNumbers(grid, options);

    console.log('THE GRID');
    console.log(grid);
    return grid;
  }

  function addBombs(allFields, options) {
    var rand = options.seedKey ? gen.create(options.seedKey) : gen.create();
    var numberOfAllFields = options.numberOfRows * options.numberOfColumns;
    var arr = [];
    for (var i = 0; i < numberOfAllFields; i++) {
      arr[i] = i;
    }
    arr.sort(function () {
      return rand.floatBetween(-0.5, 0.5);
    });

    var bombFields = arr.slice(0, options.numberOfBombs);
    console.log('BOMB FIELDS: ' + bombFields);

    for (var _i2 = 0; _i2 < allFields.length; _i2++) {
      if (bombFields.indexOf(_i2) !== -1) {
        allFields[_i2].value = 'bomb';
      }
    }
  }

  function addNumbers(grid, options) {
    for (var i = 0; i < grid.length; i++) {
      var column = grid[i];
      for (var j = 0; j < column.length; j++) {
        if (grid[i][j].value !== 'bomb') {
          grid[i][j].value = getNumberOfNeighborBombs(grid, i, j);
        }
      }
    }
  }

  function getNumberOfNeighborBombs(grid, row, col) {
    var counter = 0;
    var currentCheckField = void 0;

    if (grid[row - 1]) {
      currentCheckField = grid[row - 1][col - 1];
      if (isBomb(currentCheckField)) counter++;
      currentCheckField = grid[row - 1][col];
      if (isBomb(currentCheckField)) counter++;
      currentCheckField = grid[row - 1][col + 1];
      if (isBomb(currentCheckField)) counter++;
    }

    currentCheckField = grid[row][col - 1];
    if (isBomb(currentCheckField)) counter++;
    currentCheckField = grid[row][col + 1];
    if (isBomb(currentCheckField)) counter++;

    if (grid[row + 1]) {
      currentCheckField = grid[row + 1][col - 1];
      if (isBomb(currentCheckField)) counter++;
      currentCheckField = grid[row + 1][col];
      if (isBomb(currentCheckField)) counter++;
      currentCheckField = grid[row + 1][col + 1];
      if (isBomb(currentCheckField)) counter++;
    }

    if (counter === 0) return null;else return counter;
  }

  function isBomb(field) {
    return field !== undefined && field.value === 'bomb';
  }
};

exports.default = Board;

},{"./Field.js":2,"random-seed":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Field = function Field() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  _classCallCheck(this, Field);

  this.isOpened = false;
  this.isMarked = false;
  this.value = value;
};

exports.default = Field;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Board = require('./Board.js');

var _Board2 = _interopRequireDefault(_Board);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Minesweeper = function () {
  function Minesweeper(options) {
    var _this = this;

    _classCallCheck(this, Minesweeper);

    this.board = new _Board2.default(options);
    this.isGameOver = false;
    this.gameStatus = 'playing';
    this.markedFields = 0;
    this.openedFields = 0;
    this.numberOfMines = this.getNumberOfMines();
    this.availableHints = 3;
    this.availableLives = 1;
    this.timescore = 0;
    this.timer = setInterval(function () {
      _this.timescore++;
    }, 1000);
  }

  // startTimer() {
  //   setInterval(() => {
  //     this.timescore++;
  //   }, 1000);
  // }

  _createClass(Minesweeper, [{
    key: 'getNumberOfMines',
    value: function getNumberOfMines() {
      var numberOfMines = 0;
      var grid = this.board.grid;
      for (var i = 0; i < grid.length; i++) {
        var row = grid[i];
        for (var j = 0; j < row.length; j++) {
          var field = row[j];
          if (field.value === 'bomb') numberOfMines++;
        }
      }
      return numberOfMines;
    }
  }, {
    key: 'openField',
    value: function openField(x, y) {
      var field = this.board.grid[x][y];
      field.isOpened = true;
      if (field.value === 'bomb') {
        if (this.availableLives > 0) this.availableLives--;else {
          this.isGameOver = true;
          this.gameStatus = 'defeated';
        }
      }
      this.checkVictory();
      this.openedFields++;
      return field.value;
    }
  }, {
    key: 'toggleMarkField',
    value: function toggleMarkField(x, y) {
      var field = this.board.grid[x][y];
      if (field.isOpened) return null;
      if (field.isMarked) {
        this.markedFields--;
        field.isMarked = false;
      } else {
        this.markedFields++;
        field.isMarked = true;
      }
      return field.isMarked;
    }
  }, {
    key: 'getHint',
    value: function getHint() {
      if (this.availableHints === 0) return null;
      var nonBombFields = [];
      var board = this.board.grid;
      // If there are some opened fields on the board
      if (this.openedFields > 0) {
        this.availableHints--;
        for (var i = 0; i < board.length; i++) {
          var row = board[i];
          for (var j = 0; j < row.length; j++) {
            var field = row[j];
            if (field.isOpened) this.getNeighbourNonBombFields({ x: i, y: j }, nonBombFields);
          }
        }
      }
      // If none of the fields is opened
      else {
          this.availableHints--;
          for (var _i = 0; _i < board.length; _i++) {
            var _row = board[_i];
            for (var _j = 0; _j < _row.length; _j++) {
              var _field = _row[_j];
              if (_field.value != 'bomb') nonBombFields.push({ x: _i, y: _j });
            }
          }
        }
      return nonBombFields[Math.floor(Math.random() * nonBombFields.length)];
    }
  }, {
    key: 'getNeighbourNonBombFields',
    value: function getNeighbourNonBombFields(position, nonBombFields) {
      var x = position.x - 1;
      var y = position.y - 1;
      if (this.potentialHint({ x: x, y: y })) {
        nonBombFields.push({ x: x, y: y });
      }

      x = position.x - 1;
      y = position.y;
      if (this.potentialHint({ x: x, y: y })) {
        nonBombFields.push({ x: x, y: y });
      }

      x = position.x - 1;
      y = position.y + 1;
      if (this.potentialHint({ x: x, y: y })) {
        nonBombFields.push({ x: x, y: y });
      }

      x = position.x;
      y = position.y - 1;
      if (this.potentialHint({ x: x, y: y })) {
        nonBombFields.push({ x: x, y: y });
      }

      x = position.x;
      y = position.y + 1;
      if (this.potentialHint({ x: x, y: y })) {
        nonBombFields.push({ x: x, y: y });
      }

      x = position.x + 1;
      y = position.y - 1;
      if (this.potentialHint({ x: x, y: y })) {
        nonBombFields.push({ x: x, y: y });
      }

      x = position.x + 1;
      y = position.y;
      if (this.potentialHint({ x: x, y: y })) {
        nonBombFields.push({ x: x, y: y });
      }

      x = position.x + 1;
      y = position.y + 1;
      if (this.potentialHint({ x: x, y: y })) {
        nonBombFields.push({ x: x, y: y });
      }
    }
  }, {
    key: 'potentialHint',
    value: function potentialHint(position) {
      var grid = this.board.grid;
      var x = position.x;
      var y = position.y;

      if (!grid[x] || !grid[x][y]) return false;
      if (grid[x][y].isMarked || grid[x][y].isOpened) return false;
      if (grid[x][y].value !== 'bomb' && Number.isInteger(grid[x][y].value)) return true;
      return false;
    }
  }, {
    key: 'minesLeft',
    value: function minesLeft() {
      return this.numberOfMines - this.markedFields;
    }
  }, {
    key: 'checkVictory',
    value: function checkVictory() {
      var nonBombFields = [];
      var grid = this.board.grid;
      for (var i = 0; i < grid.length; i++) {
        var row = grid[i];
        for (var j = 0; j < row.length; j++) {
          var field = row[j];
          if (field.value !== 'bomb') nonBombFields.push(field);
        }
      }
      var victory = nonBombFields.every(function (f) {
        return f.isOpened;
      });
      if (victory) this.gameStatus = 'victory';
    }
  }]);

  return Minesweeper;
}();

exports.default = Minesweeper;

},{"./Board.js":1}],4:[function(require,module,exports){
exports = module.exports = stringify
exports.getSerialize = serializer

function stringify(obj, replacer, spaces, cycleReplacer) {
  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
}

function serializer(replacer, cycleReplacer) {
  var stack = [], keys = []

  if (cycleReplacer == null) cycleReplacer = function(key, value) {
    if (stack[0] === value) return "[Circular ~]"
    return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
  }

  return function(key, value) {
    if (stack.length > 0) {
      var thisPos = stack.indexOf(this)
      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
      if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
    }
    else stack.push(value)

    return replacer == null ? value : replacer.call(this, key, value)
  }
}

},{}],5:[function(require,module,exports){
/*
 * random-seed
 * https://github.com/skratchdot/random-seed
 *
 * This code was originally written by Steve Gibson and can be found here:
 *
 * https://www.grc.com/otg/uheprng.htm
 *
 * It was slightly modified for use in node, to pass jshint, and a few additional
 * helper functions were added.
 *
 * Copyright (c) 2013 skratchdot
 * Dual Licensed under the MIT license and the original GRC copyright/license
 * included below.
 */
/*	============================================================================
									Gibson Research Corporation
				UHEPRNG - Ultra High Entropy Pseudo-Random Number Generator
	============================================================================
	LICENSE AND COPYRIGHT:  THIS CODE IS HEREBY RELEASED INTO THE PUBLIC DOMAIN
	Gibson Research Corporation releases and disclaims ALL RIGHTS AND TITLE IN
	THIS CODE OR ANY DERIVATIVES. Anyone may be freely use it for any purpose.
	============================================================================
	This is GRC's cryptographically strong PRNG (pseudo-random number generator)
	for JavaScript. It is driven by 1536 bits of entropy, stored in an array of
	48, 32-bit JavaScript variables.  Since many applications of this generator,
	including ours with the "Off The Grid" Latin Square generator, may require
	the deteriministic re-generation of a sequence of PRNs, this PRNG's initial
	entropic state can be read and written as a static whole, and incrementally
	evolved by pouring new source entropy into the generator's internal state.
	----------------------------------------------------------------------------
	ENDLESS THANKS are due Johannes Baagoe for his careful development of highly
	robust JavaScript implementations of JS PRNGs.  This work was based upon his
	JavaScript "Alea" PRNG which is based upon the extremely robust Multiply-
	With-Carry (MWC) PRNG invented by George Marsaglia. MWC Algorithm References:
	http://www.GRC.com/otg/Marsaglia_PRNGs.pdf
	http://www.GRC.com/otg/Marsaglia_MWC_Generators.pdf
	----------------------------------------------------------------------------
	The quality of this algorithm's pseudo-random numbers have been verified by
	multiple independent researchers. It handily passes the fermilab.ch tests as
	well as the "diehard" and "dieharder" test suites.  For individuals wishing
	to further verify the quality of this algorithm's pseudo-random numbers, a
	256-megabyte file of this algorithm's output may be downloaded from GRC.com,
	and a Microsoft Windows scripting host (WSH) version of this algorithm may be
	downloaded and run from the Windows command prompt to generate unique files
	of any size:
	The Fermilab "ENT" tests: http://fourmilab.ch/random/
	The 256-megabyte sample PRN file at GRC: https://www.GRC.com/otg/uheprng.bin
	The Windows scripting host version: https://www.GRC.com/otg/wsh-uheprng.js
	----------------------------------------------------------------------------
	Qualifying MWC multipliers are: 187884, 686118, 898134, 1104375, 1250205,
	1460910 and 1768863. (We use the largest one that's < 2^21)
	============================================================================ */
'use strict';
var stringify = require('json-stringify-safe');

/*	============================================================================
This is based upon Johannes Baagoe's carefully designed and efficient hash
function for use with JavaScript.  It has a proven "avalanche" effect such
that every bit of the input affects every bit of the output 50% of the time,
which is good.	See: http://baagoe.com/en/RandomMusings/hash/avalanche.xhtml
============================================================================
*/
var Mash = function () {
	var n = 0xefc8249d;
	var mash = function (data) {
		if (data) {
			data = data.toString();
			for (var i = 0; i < data.length; i++) {
				n += data.charCodeAt(i);
				var h = 0.02519603282416938 * n;
				n = h >>> 0;
				h -= n;
				h *= n;
				n = h >>> 0;
				h -= n;
				n += h * 0x100000000; // 2^32
			}
			return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
		} else {
			n = 0xefc8249d;
		}
	};
	return mash;
};

var uheprng = function (seed) {
	return (function () {
		var o = 48; // set the 'order' number of ENTROPY-holding 32-bit values
		var c = 1; // init the 'carry' used by the multiply-with-carry (MWC) algorithm
		var p = o; // init the 'phase' (max-1) of the intermediate variable pointer
		var s = new Array(o); // declare our intermediate variables array
		var i; // general purpose local
		var j; // general purpose local
		var k = 0; // general purpose local

		// when our "uheprng" is initially invoked our PRNG state is initialized from the
		// browser's own local PRNG. This is okay since although its generator might not
		// be wonderful, it's useful for establishing large startup entropy for our usage.
		var mash = new Mash(); // get a pointer to our high-performance "Mash" hash

		// fill the array with initial mash hash values
		for (i = 0; i < o; i++) {
			s[i] = mash(Math.random());
		}

		// this PRIVATE (internal access only) function is the heart of the multiply-with-carry
		// (MWC) PRNG algorithm. When called it returns a pseudo-random number in the form of a
		// 32-bit JavaScript fraction (0.0 to <1.0) it is a PRIVATE function used by the default
		// [0-1] return function, and by the random 'string(n)' function which returns 'n'
		// characters from 33 to 126.
		var rawprng = function () {
			if (++p >= o) {
				p = 0;
			}
			var t = 1768863 * s[p] + c * 2.3283064365386963e-10; // 2^-32
			return s[p] = t - (c = t | 0);
		};

		// this EXPORTED function is the default function returned by this library.
		// The values returned are integers in the range from 0 to range-1. We first
		// obtain two 32-bit fractions (from rawprng) to synthesize a single high
		// resolution 53-bit prng (0 to <1), then we multiply this by the caller's
		// "range" param and take the "floor" to return a equally probable integer.
		var random = function (range) {
			return Math.floor(range * (rawprng() + (rawprng() * 0x200000 | 0) * 1.1102230246251565e-16)); // 2^-53
		};

		// this EXPORTED function 'string(n)' returns a pseudo-random string of
		// 'n' printable characters ranging from chr(33) to chr(126) inclusive.
		random.string = function (count) {
			var i;
			var s = '';
			for (i = 0; i < count; i++) {
				s += String.fromCharCode(33 + random(94));
			}
			return s;
		};

		// this PRIVATE "hash" function is used to evolve the generator's internal
		// entropy state. It is also called by the EXPORTED addEntropy() function
		// which is used to pour entropy into the PRNG.
		var hash = function () {
			var args = Array.prototype.slice.call(arguments);
			for (i = 0; i < args.length; i++) {
				for (j = 0; j < o; j++) {
					s[j] -= mash(args[i]);
					if (s[j] < 0) {
						s[j] += 1;
					}
				}
			}
		};

		// this EXPORTED "clean string" function removes leading and trailing spaces and non-printing
		// control characters, including any embedded carriage-return (CR) and line-feed (LF) characters,
		// from any string it is handed. this is also used by the 'hashstring' function (below) to help
		// users always obtain the same EFFECTIVE uheprng seeding key.
		random.cleanString = function (inStr) {
			inStr = inStr.replace(/(^\s*)|(\s*$)/gi, ''); // remove any/all leading spaces
			inStr = inStr.replace(/[\x00-\x1F]/gi, ''); // remove any/all control characters
			inStr = inStr.replace(/\n /, '\n'); // remove any/all trailing spaces
			return inStr; // return the cleaned up result
		};

		// this EXPORTED "hash string" function hashes the provided character string after first removing
		// any leading or trailing spaces and ignoring any embedded carriage returns (CR) or Line Feeds (LF)
		random.hashString = function (inStr) {
			inStr = random.cleanString(inStr);
			mash(inStr); // use the string to evolve the 'mash' state
			for (i = 0; i < inStr.length; i++) { // scan through the characters in our string
				k = inStr.charCodeAt(i); // get the character code at the location
				for (j = 0; j < o; j++) { //	"mash" it into the UHEPRNG state
					s[j] -= mash(k);
					if (s[j] < 0) {
						s[j] += 1;
					}
				}
			}
		};

		// this EXPORTED function allows you to seed the random generator.
		random.seed = function (seed) {
			if (typeof seed === 'undefined' || seed === null) {
				seed = Math.random();
			}
			if (typeof seed !== 'string') {
				seed = stringify(seed, function (key, value) {
					if (typeof value === 'function') {
						return (value).toString();
					}
					return value;
				});
			}
			random.initState();
			random.hashString(seed);
		};

		// this handy exported function is used to add entropy to our uheprng at any time
		random.addEntropy = function ( /* accept zero or more arguments */ ) {
			var args = [];
			for (i = 0; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
			hash((k++) + (new Date().getTime()) + args.join('') + Math.random());
		};

		// if we want to provide a deterministic startup context for our PRNG,
		// but without directly setting the internal state variables, this allows
		// us to initialize the mash hash and PRNG's internal state before providing
		// some hashing input
		random.initState = function () {
			mash(); // pass a null arg to force mash hash to init
			for (i = 0; i < o; i++) {
				s[i] = mash(' '); // fill the array with initial mash hash values
			}
			c = 1; // init our multiply-with-carry carry
			p = o; // init our phase
		};

		// we use this (optional) exported function to signal the JavaScript interpreter
		// that we're finished using the "Mash" hash function so that it can free up the
		// local "instance variables" is will have been maintaining.  It's not strictly
		// necessary, of course, but it's good JavaScript citizenship.
		random.done = function () {
			mash = null;
		};

		// if we called "uheprng" with a seed value, then execute random.seed() before returning
		if (typeof seed !== 'undefined') {
			random.seed(seed);
		}

		// Returns a random integer between 0 (inclusive) and range (exclusive)
		random.range = function (range) {
			return random(range);
		};

		// Returns a random float between 0 (inclusive) and 1 (exclusive)
		random.random = function () {
			return random(Number.MAX_VALUE - 1) / Number.MAX_VALUE;
		};

		// Returns a random float between min (inclusive) and max (exclusive)
		random.floatBetween = function (min, max) {
			return random.random() * (max - min) + min;
		};

		// Returns a random integer between min (inclusive) and max (inclusive)
		random.intBetween = function (min, max) {
			return Math.floor(random.random() * (max - min + 1)) + min;
		};

		// when our main outer "uheprng" function is called, after setting up our
		// initial variables and entropic state, we return an "instance pointer"
		// to the internal anonymous function which can then be used to access
		// the uheprng's various exported functions.  As with the ".done" function
		// above, we should set the returned value to 'null' once we're finished
		// using any of these functions.
		return random;
	}());
};

// Modification for use in node:
uheprng.create = function (seed) {
	return new uheprng(seed);
};
module.exports = uheprng;

},{"json-stringify-safe":4}],6:[function(require,module,exports){
'use strict';

var _Board = require('../../app/scripts/Board.js');

var _Board2 = _interopRequireDefault(_Board);

var _Field = require('../../app/scripts/Field.js');

var _Field2 = _interopRequireDefault(_Field);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = { difficulty: 'custom', numberOfBombs: 0, numberOfRows: 0, numberOfColumns: 0 };
describe('Board', function () {
  it('should have a grid', function () {
    options.numberOfRows = 9;
    options.numberOfColumns = 9;
    var board = new _Board2.default(options);
    // console.log(board.grid);
    expect(board).to.have.property('grid');
  });
  it('contains only fields of type Field', function () {
    options.numberOfRows = 9;
    options.numberOfColumns = 9;
    var board = new _Board2.default(options);
    // console.log(board.grid);
    for (var i = 0; i < board.grid.length; i++) {
      var row = board.grid[i];
      for (var i = 0; i < row.length; i++) {
        var field = row[i];
        expect(field).to.be.an.instanceof(_Field2.default);
      }
    }
  });
  it('should contain maximum 24 rows', function () {
    options.numberOfRows = 30;
    options.numberOfColumns = 30;
    var board = new _Board2.default(options);
    // console.log(board.grid);
    expect(board.grid).to.have.length.below(25);
  });
  it('should contain minimum 9 rows', function () {
    options.numberOfRows = 4;
    options.numberOfColumns = 30;
    var board = new _Board2.default(options);
    // console.log(board.grid);
    expect(board.grid).to.have.length.above(8);
  });
  it('should contain maximum 30 columns', function () {
    options.numberOfRows = 10;
    options.numberOfColumns = 31;
    var board = new _Board2.default(options);
    // console.log(board.grid);
    for (var i = 0; i < board.grid.length; i++) {
      var column = board.grid[i];
      expect(column).to.have.length.below(31);
    }
  });
  it('should contain minimum 9 columns', function () {
    options.numberOfRows = 10;
    options.numberOfColumns = 8;
    var board = new _Board2.default(options);
    // console.log(board.grid);
    for (var i = 0; i < board.grid.length; i++) {
      var column = board.grid[i];
      expect(column).to.have.length.above(8);
    }
  });
  it('should contain 81 fields for 9 x 9 grid (easy)', function () {
    options.difficulty = 'easy';
    var board = new _Board2.default(options);
    // console.log(board.grid);
    var numberOfFields = 0;
    for (var i = 0; i < board.grid.length; i++) {
      var column = board.grid[i];
      numberOfFields += column.length;
    }
    expect(numberOfFields).to.equal(81);
  });
  it('should contain 256 fields for 16 x 16 grid (medium)', function () {
    options.difficulty = 'medium';
    var board = new _Board2.default(options);
    // console.log(board.grid);
    var numberOfFields = 0;
    for (var i = 0; i < board.grid.length; i++) {
      var column = board.grid[i];
      numberOfFields += column.length;
    }
    expect(numberOfFields).to.equal(256);
  });
  it('should contain 720 fields for 24 x 30 grid (hard)', function () {
    options.difficulty = 'hard';
    var board = new _Board2.default(options);
    // console.log(board.grid);
    var numberOfFields = 0;
    for (var i = 0; i < board.grid.length; i++) {
      var column = board.grid[i];
      numberOfFields += column.length;
    }
    expect(numberOfFields).to.equal(720);
  });
  it('should contain minumum 10 bombs', function () {
    options.difficulty = 'custom';
    options.numberOfRows = 10;
    options.numberOfColumns = 15;
    options.numberOfBombs = 9;
    var board = new _Board2.default(options);
    // console.log(board.grid);
    var numberOfBombs = board.grid.reduce(function () {
      var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var b = arguments[1];
      return a.concat(b);
    }).filter(function (f) {
      return f.value == 'bomb';
    }).length;
    // console.log('here');
    // console.log(numberOfBombs);
    for (var i = 0; i < board.grid.length; i++) {
      var column = board.grid[i];
      for (var j = 0; j < column.length; j++) {
        var field = column[j];
        if (field == 'bomb') numberOfBombs++;
      }
    }
    expect(numberOfBombs).to.be.above(9);
  });
  it('should not contain more bombs than 60% of total number of fields', function () {
    options.difficulty = 'custom';
    options.numberOfRows = 10;
    options.numberOfColumns = 15;
    options.numberOfBombs = 100;
    var maximumBombs = Math.round(options.numberOfRows * options.numberOfColumns * 0.6);
    var board = new _Board2.default(options);
    // console.log(board.grid);
    var numberOfBombs = board.grid.reduce(function () {
      var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var b = arguments[1];
      return a.concat(b);
    }).filter(function (f) {
      return f.value == 'bomb';
    }).length;
    console.log('here');
    console.log(numberOfBombs);
    for (var i = 0; i < board.grid.length; i++) {
      var column = board.grid[i];
      for (var j = 0; j < column.length; j++) {
        var field = column[j];
        if (field == 'bomb') numberOfBombs++;
      }
    }
    console.log('number of bombs: ' + numberOfBombs + ', maximum bombs: ' + maximumBombs);
    expect(numberOfBombs).to.be.below(maximumBombs + 1);
  });
  it('It Can generate a specific grid multiple times based on a seed key', function () {
    options.difficulty = 'medium';
    options.seedKey = 'sashe';
    var boardOne = new _Board2.default(options);
    var boardTwo = new _Board2.default(options);
    // console.log(board.grid);

    var areEqual = true;
    if (boardOne.grid.length !== boardTwo.grid.length) areEqual = false;
    for (var i = 0; i < boardOne.grid.length; i++) {
      if (boardOne.grid[i].length !== boardTwo.grid[i].length) areEqual = false;
      for (var j = 0; j < boardOne.grid[i].length; j++) {
        var boardOneElement = boardOne.grid[i][j];
        var boardTwoElement = boardTwo.grid[i][j];
        console.log('Board One Element: ' + boardOneElement.value + ' -- Board Two Element: ' + boardTwoElement.value);
        if (boardOneElement.value != boardTwoElement.value) areEqual = false;
      }
    }
    expect(areEqual).to.be.true;
  });
});

},{"../../app/scripts/Board.js":1,"../../app/scripts/Field.js":2}],7:[function(require,module,exports){
'use strict';

var _Field = require('../../app/scripts/Field.js');

var _Field2 = _interopRequireDefault(_Field);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Field', function () {

  it('exists', function () {
    var field = new _Field2.default();
    expect(field).to.exist;
  });
  it('can be opened', function () {
    var field = new _Field2.default();
    expect(field).to.have.property('isOpened');
    field.isOpened = true;
    expect(field.isOpened).to.equal(true);
  });
  it('can be marked', function () {
    var field = new _Field2.default();
    expect(field).to.have.property('isMarked');
    field.isMarked = true;
    expect(field.isMarked).to.equal(true);
  });
  it('can be unmarked', function () {
    var field = new _Field2.default();
    expect(field).to.have.property('isMarked');
    field.isMarked = false;
    expect(field.isMarked).to.equal(false);
  });

  // We can have more its here
});

},{"../../app/scripts/Field.js":2}],8:[function(require,module,exports){
'use strict';

var _Minesweeper = require('../../app/scripts/Minesweeper.js');

var _Minesweeper2 = _interopRequireDefault(_Minesweeper);

var _Board = require('../../app/scripts/Board.js');

var _Board2 = _interopRequireDefault(_Board);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Minesweeper', function () {
  it('Initializes a board', function () {
    var options = {
      difficulty: 'medium',
      seedKey: 'sashe'
    };
    var minesweeper = new _Minesweeper2.default(options);
    minesweeper.should.have.property('board');

    var minesweeperGrid = minesweeper.board.grid;
    var boardGrid = new _Board2.default(options).grid;
    var areEqual = true;

    if (minesweeperGrid.length !== boardGrid.length) areEqual = false;
    for (var i = 0; i < minesweeperGrid.length; i++) {
      if (minesweeperGrid[i].length !== boardGrid[i].length) areEqual = false;
      for (var j = 0; j < minesweeperGrid[i].length; j++) {
        var minesweeperGridElement = minesweeperGrid[i][j];
        var boardGridElement = boardGrid[i][j];
        console.log('Board One Element: ' + minesweeperGridElement.value + ' -- Board Two Element: ' + boardGridElement.value);
        if (minesweeperGridElement.value != boardGridElement.value) areEqual = false;
      }
    }
    expect(areEqual).to.be.true;
  });
  it('Can open a board field', function () {
    var options = {
      difficulty: 'medium',
      seedKey: 'sashe'
    };
    var minesweeper = new _Minesweeper2.default(options);
    expect(minesweeper).to.have.property('openField');

    var operationResult = minesweeper.openField(0, 0);
    expect(minesweeper.board.grid[0][0].isOpened).to.be.true;
    expect(operationResult).to.be.null;
    operationResult = minesweeper.openField(0, 4);
    expect(operationResult).to.equal(2);
    operationResult = minesweeper.openField(0, 5);
    expect(operationResult).to.equal('bomb');
    // operationResult = minesweeper.openField(0,2);
    // expect(operationResult).to.equal(3);
  });
  it('Can mark a board field', function () {
    var options = {
      difficulty: 'medium',
      seedKey: 'sashe'
    };
    var minesweeper = new _Minesweeper2.default(options);
    expect(minesweeper).to.have.property('toggleMarkField');

    expect(minesweeper.board.grid[0][5].isMarked).to.be.false;
    var operationResult = minesweeper.toggleMarkField(0, 5);
    expect(minesweeper.board.grid[0][5].isMarked).to.be.true;
    expect(operationResult).to.be.true;
    operationResult = minesweeper.openField(0, 4);
    operationResult = minesweeper.toggleMarkField(0, 4);
    expect(operationResult).to.be.null;
    // operationResult = minesweeper.openField(0,2);
    // expect(operationResult).to.equal(3);
  });
  it('Can unmark a board field', function () {
    var options = {
      difficulty: 'medium',
      seedKey: 'sashe'
    };
    var minesweeper = new _Minesweeper2.default(options);
    expect(minesweeper).to.have.property('toggleMarkField');

    expect(minesweeper.board.grid[0][5].isMarked).to.be.false;
    var operationResult = minesweeper.toggleMarkField(0, 5);
    expect(minesweeper.board.grid[0][5].isMarked).to.be.true;
    expect(operationResult).to.be.true;
    operationResult = minesweeper.toggleMarkField(0, 5);
    expect(minesweeper.board.grid[0][5].isMarked).to.be.false;
    expect(operationResult).to.be.false;
    operationResult = minesweeper.openField(0, 4);
    operationResult = minesweeper.toggleMarkField(0, 4);
    expect(operationResult).to.be.null;
    // operationResult = minesweeper.openField(0,2);
    // expect(operationResult).to.equal(3);
  });
  it('Can provide hints (revealing a non-mine field)', function () {
    var options = {
      difficulty: 'medium',
      seedKey: 'sashe'
    };
    var minesweeper = new _Minesweeper2.default(options);
    expect(minesweeper).to.have.property('getHint');
    var hint = minesweeper.getHint();
    var field = minesweeper.board.grid[hint.x][hint.y];
    expect(field.value).to.not.equal('bomb');
  });
  it('Would not provide more than 3 hints', function () {
    var options = {
      difficulty: 'medium',
      seedKey: 'sashe'
    };
    var minesweeper = new _Minesweeper2.default(options);
    expect(minesweeper).to.have.property('getHint');
    var hint = void 0,
        field = void 0;
    for (var i = 0; i < 3; i++) {
      hint = minesweeper.getHint();
      field = minesweeper.board.grid[hint.x][hint.y];
      expect(field.value).to.not.equal('bomb');
    }
    hint = minesweeper.getHint();
    expect(hint).to.be.null;
  });
});

},{"../../app/scripts/Board.js":1,"../../app/scripts/Minesweeper.js":3}],9:[function(require,module,exports){
'use strict';

var _FieldTest = require('./FieldTest.js');

var _FieldTest2 = _interopRequireDefault(_FieldTest);

var _BoardTest = require('./BoardTest.js');

var _BoardTest2 = _interopRequireDefault(_BoardTest);

var _MinesweeperTest = require('./MinesweeperTest.js');

var _MinesweeperTest2 = _interopRequireDefault(_MinesweeperTest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./BoardTest.js":6,"./FieldTest.js":7,"./MinesweeperTest.js":8}]},{},[9]);
