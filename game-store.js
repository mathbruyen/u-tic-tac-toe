/* jshint node: true, esnext: true */

var newStore = require('./store');

module.exports = (dispatcher) => {

  function emptyGame() {
    return {
      canPlayIn : true,
      isWonBy : null,
      cells : [
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ]
    };
  }

  function emptyUltimateGame() {
    return {
      games : [
        [emptyGame(), emptyGame(), emptyGame()],
        [emptyGame(), emptyGame(), emptyGame()],
        [emptyGame(), emptyGame(), emptyGame()]
      ]
    };
  }

  var ultimate = emptyUltimateGame();
  var turn = 'X';

  function isFull(game) {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (!game.cells[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  function isWinning(game, expected, cellx, celly) {
    var i;

    for (i = 0; i < 3; i++) {
      if (game.cells[celly][i] !== expected) {
        break;
      }
      if (i === 2) {
        return true;
      }
    }

    for (i = 0; i < 3; i++) {
      if (game.cells[i][cellx] !== expected) {
        break;
      }
      if (i === 2) {
        return true;
      }
    }

    if (cellx === celly) {
      for (i = 0; i < 3; i++) {
        if (game.cells[i][i] !== expected) {
          break;
        }
        if (i === 2) {
          return true;
        }
      }
    }

    if (cellx === 2 - celly) {
      for (i = 0; i < 3; i++) {
        if (game.cells[i][2 - i] !== expected) {
          break;
        }
        if (i === 2) {
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
      ultimate = emptyUltimateGame();
      turn = 'X';
    },
    PLAYED_CELL : (action) => {
      var game = ultimate.games[action.gamey][action.gamex], i, j, t;
      game.cells[action.celly][action.cellx] = turn;

      if (isWinning(game, turn, action.cellx, action.celly)) {
        game.isWonBy = turn;
      }

      for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
          ultimate.games[i][j].canPlayIn = false;
        }
      }

      var target = ultimate.games[action.celly][action.cellx];
      var draw = true;
      if (target.isWonBy || isFull(target)) {
        for (i = 0; i < 3; i++) {
          for (j = 0; j < 3; j++) {
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

  return { onChange, offChange, getTurn, getGame };
};
