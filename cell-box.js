/* jshint node: true, esnext: true */

import React from 'react';

import Cross from './cross-player';
import Circle from './circle-player';

var players = [Cross, Circle];

export default class CellBox extends React.Component {

  constructor(props) {
    super(props);
    var getState = () => this.props.game.getGame(this.props.x, this.props.y);
    this.state = getState();
    this._onChange = () => {
      if (this.props.x < this.props.game.getSize() && this.props.y < this.props.game.getSize()) {
        this.setState(getState());
      }
    };
  }

  componentDidMount() {
    this.props.game.onChange(this._onChange);
  }

  componentWillUnmount() {
    this.props.game.offChange(this._onChange);
  }

  render() {
    if (this.state.isWonBy < 0) {
      var tbody = React.DOM.tbody(null, this.props.game.generateRow(y => this._makeRow(y)));
      return React.DOM.table({ className : this.state.canPlayIn ? 'playable' : 'locked' }, tbody);
    } else {
      return React.createElement(players[this.state.isWonBy]);
    }
  }

  _makeRow(y) {
    return React.DOM.tr({ key : y }, this.props.game.generateRow(x => this._makeCell(x, y)));
  }

  _makeCell(x, y) {
    var owner = this.state.cells[y][x];
    if (owner < 0) {
      if (this.state.canPlayIn) {
        return React.DOM.td({ key : x, onClick : () => this._playCell(x, y), style : { cursor : 'pointer' } });
      } else {
        return React.DOM.td({ key : x });
      }
    } else {
      return React.DOM.td({ key : x }, React.createElement(players[owner]));
    }
  }

  _playCell(cellx, celly) {
    this.props.dispatch({ action : 'PLAYED_CELL', gamex : this.props.x, gamey : this.props.y, cellx, celly });
  }
}
