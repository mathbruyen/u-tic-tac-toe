/* jshint node: true, esnext: true */

var React = require('react');

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
    // TODO ignore updates if the size of the grid makes this cell disappear
    if (this.props.x < this.props.game.getSize() && this.props.y < this.props.game.getSize()) {
      this.replaceState(this._getState());
    }
  },

  _getState : function () {
    return this.props.game.getGame(this.props.x, this.props.y);
  },

  render : function () {
    if (this.state.isWonBy) {
      return React.DOM.div(null, this.state.isWonBy);
    } else {
      var border = this.state.canPlayIn ? '1px solid red' : '1px solid black';
      return React.DOM.table({ className : this.state.canPlayIn ? 'playable' : 'locked' }, React.DOM.tbody(null, this.props.game.generateRow(this._makeCellRow)));
    }
  },

  _makeCellRow : function (y) {
    return React.DOM.tr({ key : y }, this.props.game.generateRow(x => this._makeCell(x, y)));
  },

  _makeCell : function (x, y) {
    var owner = this.state.cells[y][x];
    if (!owner && this.state.canPlayIn) {
      return React.DOM.td({ key : x, onClick : this._playCell.bind(this, x, y), style : { cursor : 'pointer' } }, owner);
    } else {
      return React.DOM.td({ key : x }, owner);
    }
  },

  _playCell : function (cellx, celly) {
    this.props.dispatch({ action : 'PLAYED_CELL', gamex : this.props.x, gamey : this.props.y, cellx, celly });
  }
});
