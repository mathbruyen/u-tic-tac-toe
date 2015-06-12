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
    this.replaceState(this._getState());
  },

  _getState : function () {
    return this.props.game.getGame(this.props.x, this.props.y);
  },

  render : function () {
    if (this.state.isWonBy) {
      return React.DOM.div(null, this.state.isWonBy);
    } else {
      return React.DOM.table(
          { style : { border : this.state.canPlayIn ? '1px solid red' : '1px solid black' } },
          this._makeCellRow(0),
          this._makeCellRow(1),
          this._makeCellRow(2)
        );
    }
  },

  _makeCellRow : function (celly) {
    return React.DOM.tr(null, this._makeCell(0, celly), this._makeCell(1, celly), this._makeCell(2, celly));
  },

  _makeCell : function (cellx, celly) {
    var owner = this.state.cells[celly][cellx];
    if (!owner && this.state.canPlayIn) {
      return React.DOM.td({
        onClick : this._playCell.bind(this, cellx, celly),
        style : { cursor : 'pointer' }
      }, owner);
    } else {
      return React.DOM.td(null, owner);
    }
  },

  _playCell : function (cellx, celly) {
    this.props.dispatch({ action : 'PLAYED_CELL', gamex : this.props.x, gamey : this.props.y, cellx, celly });
  }
});
