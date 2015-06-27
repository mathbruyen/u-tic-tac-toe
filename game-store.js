/* jshint node: true, esnext: true */

var newStore = require('./store');

module.exports = (dispatcher) => {

  var size;
  var ultimate;

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
      isWonBy : -1,
      cells : generateGrid(() => -1)
    };
  }

  function emptyUltimateGame() {
    return {
      turn : 0,
      isWonBy : -1,
      isDraw : false,
      cells : generateGrid(emptyGame)
    };
  }

  function start(s) {
    size = s;
    ultimate = emptyUltimateGame();
  }

  function isFull(game) {
    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size; j++) {
        if (game.cells[i][j] < 0) {
          return false;
        }
      }
    }
    return true;
  }

  function isWinning(game, matches, cellx, celly) {
    var i;

    for (i = 0; i < size; i++) {
      if (!matches(game.cells[celly][i])) {
        break;
      }
      if (i === size - 1) {
        return true;
      }
    }

    for (i = 0; i < size; i++) {
      if (!matches(game.cells[i][cellx])) {
        break;
      }
      if (i === size - 1) {
        return true;
      }
    }

    if (cellx === celly) {
      for (i = 0; i < size; i++) {
        if (!matches(game.cells[i][i])) {
          break;
        }
        if (i === size - 1) {
          return true;
        }
      }
    }

    if (cellx === size - 1 - celly) {
      for (i = 0; i < size; i++) {
        if (!matches(game.cells[i][size - 1 - i])) {
          break;
        }
        if (i === size - 1) {
          return true;
        }
      }
    }

    return false;
  }

  function getTurn() {
    return ultimate.turn;
  }

  function isDraw() {
    return ultimate.isDraw;
  }

  function getWinner() {
    return ultimate.isWonBy;
  }

  function getGame(x, y) {
    return ultimate.cells[y][x];
  }

  var { onChange, offChange } = newStore(dispatcher, {
    NEW_GAME_STARTED : (action) => {
      start(action.size);
    },
    PLAYED_CELL : (action) => {
      var game = ultimate.cells[action.gamey][action.gamex], i, j, t;
      game.cells[action.celly][action.cellx] = ultimate.turn;

      if (isWinning(game, (x) => ultimate.turn === x, action.cellx, action.celly)) {
        game.isWonBy = ultimate.turn;
        if (isWinning(ultimate, (x) => ultimate.turn === x.isWonBy, action.gamex, action.gamey)) {
          ultimate.isWonBy = ultimate.turn;
        }
      }

      for (i = 0; i < size; i++) {
        for (j = 0; j < size; j++) {
          ultimate.cells[i][j].canPlayIn = false;
        }
      }

      if (ultimate.isWonBy < 0) {
        var target = ultimate.cells[action.celly][action.cellx];
        ultimate.isDraw = true;
        if ((target.isWonBy < 0) && !isFull(target)) {
          target.canPlayIn = true;
          ultimate.isDraw = false;
        } else {
          for (i = 0; i < size; i++) {
            for (j = 0; j < size; j++) {
              t = ultimate.cells[i][j];
              t.canPlayIn = (t.isWonBy < 0) && !isFull(t);
              if (t.canPlayIn) {
                ultimate.isDraw = false;
              }
            }
          }
        }
      }

      ultimate.turn = (ultimate.turn + 1) % 2;
    }
  });

  start(3);

  return { onChange, offChange, getTurn, isDraw, getWinner, getGame, generateRow, getSize };
};
