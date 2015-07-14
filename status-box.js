/* jshint node: true, esnext: true */

import React from 'react';

var players = ['X', 'O'];

export default class StatusBox extends React.Component {

  constructor(props) {
    super(props);
    var getState = () => {
      if (this.props.game.isDraw()) {
        return { message : 'Draw!' };
      } else if (this.props.game.getWinner() >= 0) {
        return { message : players[this.props.game.getWinner()] + ' won!' };
      } else {
        return {  message : players[this.props.game.getTurn()] + '\'s turn' };
      }
    };
    this.state = getState();
    this._onChange = () => this.setState(getState());
  }

  componentDidMount() {
    this.props.game.onChange(this._onChange, this);
  }

  componentWillUnmount() {
    this.props.game.offChange(this._onChange, this);
  }

  render() {
    return React.DOM.h1(null, this.state.message);
  }
}
