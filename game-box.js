/* jshint node: true, esnext: true */

var React = require('react');

var CellBox = require('./cell-box');
var TurnBox = require('./turn-box');

module.exports = React.createClass({

  render : function () {
    return React.DOM.div(
      null,
      React.createElement(TurnBox, { game : this.props.game, dispatch : this.props.dispatch }),
      React.DOM.table(null, this._makeGameRow(0), this._makeGameRow(1), this._makeGameRow(2)),
      React.DOM.button({ onClick : this._startGame }, 'Start new game')
    );
  },

  _makeGameRow : function (gamey) {
    return React.DOM.tr(null, this._makeGame(0, gamey), this._makeGame(1, gamey), this._makeGame(2, gamey));
  },

  _makeGame : function (gamex, gamey) {
    return React.DOM.td(null, React.createElement(CellBox, { game : this.props.game, dispatch : this.props.dispatch, x : gamex, y : gamey }));
  },

  _startGame : function () {
    this.props.dispatch({ action : 'NEW_GAME_STARTED' });
  }
});
