/* jshint node: true, esnext: true */

var React = require('react');

var CellBox = require('./cell-box');
var StatusBox = require('./status-box');

module.exports = React.createClass({

  getInitialState : function () {
    return this._getState();
  },

  componentDidMount: function() {
    this.props.game.onChange(this._onChange, this);
  },

  componentWillUnmount: function() {
    this.props.game.offChange(this._onChange, this);
  },

  _onChange : function (counter) {
    this.replaceState(this._getState());
  },

  _getState : function () {
    return { size : this.props.game.getSize() };
  },

  render : function () {
    return React.DOM.div(
      null,
      React.createElement(StatusBox, { game : this.props.game, dispatch : this.props.dispatch }),
      React.DOM.table(null, React.DOM.tbody(null, this.props.game.generateRow(this._makeGameRow))),
      React.DOM.input({ type : 'number', step : 1, min : 1, max : 6, value : this.state.size, onChange : this._changeSize }),
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
    this.props.dispatch({ action : 'NEW_GAME_STARTED', size : this.props.game.getSize() });
  },

  _changeSize : function (event) {
    var size = parseInt(event.target.value, 10);
    if (!isNaN(size)) {
      this.props.dispatch({ action : 'NEW_GAME_STARTED', size });
    }
  }
});
