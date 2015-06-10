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
    return { player : this.props.game.getTurn() };
  },

  render : function () {
    return React.DOM.span(null, this.state.player + "'s turn");
  }
});
