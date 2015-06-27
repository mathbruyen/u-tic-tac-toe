/* jshint node: true, esnext: true */

var React = require('react');

var players = ['X', 'O'];

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
    if (this.props.game.isDraw()) {
      return { message : 'Draw!' };
    } else if (this.props.game.getWinner() >= 0) {
      return { message : players[this.props.game.getWinner()] + ' won!' };
    } else {
      return {  message : players[this.props.game.getTurn()] + '\'s turn' };
    }
  },

  render : function () {
    return React.DOM.h1(null, this.state.message);
  }
});
