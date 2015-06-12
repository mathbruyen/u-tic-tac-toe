/* jshint node: true, esnext: true */

var React = require('react');

var CellBox = require('./cell-box');
var TurnBox = require('./turn-box');

module.exports = React.createClass({

  render : function () {
    return React.DOM.div(
      null,
      React.createElement(TurnBox, { game : this.props.game, dispatch : this.props.dispatch }),
      React.DOM.table(null, this.props.game.generateRow(this._makeGameRow)),
      React.DOM.button({ onClick : this._startGame }, 'Start new game')
    );
  },

  _makeGameRow : function (y) {
    return React.DOM.tr({ key : y }, this.props.game.generateRow(x => this._makeGame(x, y)));
  },

  _makeGame : function (x, y) {
    return React.DOM.td({ key : x }, React.createElement(CellBox, { game : this.props.game, dispatch : this.props.dispatch, x, y }));
  },

  _startGame : function () {
    this.props.dispatch({ action : 'NEW_GAME_STARTED' });
  }
});
