/* jshint node: true, esnext: true */

var newStore = require('./store');

module.exports = (dispatcher) => {

  var size;
  var ultimate;
  var turn;

  function getSize() {
    return size;
  }

  function generateRow(fn) {
    var a = new Array(size);
    for (var x = 0; x < size; x++) {
      a[x] = fn(x);
    }
    return a;
  }

  function generateGrid(fn) {
    return generateRow(y => generateRow(x => fn(x, y)));
  }

  function emptyGame() {
    return {
      canPlayIn : true,
      isWonBy : null,
      cells : generateGrid(() => null)
    };
  }

  function emptyUltimateGame() {
    return {
      games : generateGrid(emptyGame)
    };
  }

  function start(s) {
    size = s;
    ultimate = emptyUltimateGame();
    turn = 'X';
  }

  function isFull(game) {
    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size; j++) {
        if (!game.cells[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  function isWinning(game, expected, cellx, celly) {
    var i;

    for (i = 0; i < size; i++) {
      if (game.cells[celly][i] !== expected) {
        break;
      }
      if (i === size - 1) {
        return true;
      }
    }

    for (i = 0; i < size; i++) {
      if (game.cells[i][cellx] !== expected) {
        break;
      }
      if (i === size - 1) {
        return true;
      }
    }

    if (cellx === celly) {
      for (i = 0; i < size; i++) {
        if (game.cells[i][i] !== expected) {
          break;
        }
        if (i === size - 1) {
          return true;
        }
      }
    }

    if (cellx === size - 1 - celly) {
      for (i = 0; i < size; i++) {
        if (game.cells[i][size - 1 - i] !== expected) {
          break;
        }
        if (i === size - 1) {
          return true;
        }
      }
    }
  }

  function getTurn() {
    return turn;
  }

  function getGame(x, y) {
    return ultimate.games[y][x];
  }

  var { onChange, offChange } = newStore(dispatcher, {
    NEW_GAME_STARTED : (action) => {
      start(action.size);
    },
    PLAYED_CELL : (action) => {
      var game = ultimate.games[action.gamey][action.gamex], i, j, t;
      game.cells[action.celly][action.cellx] = turn;

      if (isWinning(game, turn, action.cellx, action.celly)) {
        game.isWonBy = turn;
      }

      for (i = 0; i < size; i++) {
        for (j = 0; j < size; j++) {
          ultimate.games[i][j].canPlayIn = false;
        }
      }

      var target = ultimate.games[action.celly][action.cellx];
      var draw = true;
      if (target.isWonBy || isFull(target)) {
        for (i = 0; i < size; i++) {
          for (j = 0; j < size; j++) {
            t = ultimate.games[i][j];
            t.canPlayIn = !(t.isWonBy || isFull(t));
            if (t.canPlayIn) {
              draw = false;
            }
          }
        }
      } else {
        target.canPlayIn = true;
        draw = false;
      }

      // TODO draw
      turn = (turn === 'X') ? 'O' : 'X';
    }
  });

  start(3);

  return { onChange, offChange, getTurn, getGame, generateRow, getSize };
};
