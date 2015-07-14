/* jshint node: true, esnext: true */

import React from 'react';

import CellBox from './cell-box';
import StatusBox from './status-box';

export default class GameBox extends React.Component {

  constructor(props) {
    super(props);
    var getState = () => {
      return { size : this.props.game.getSize() };
    };
    this.state = getState();
    this._onChange = () => {
      this.setState(getState());
    };
  }

  componentDidMount() {
    this.props.game.onChange(this._onChange, this);
  }

  componentWillUnmount() {
    this.props.game.offChange(this._onChange, this);
  }

  render() {
    return React.DOM.div(
      null,
      React.createElement(StatusBox, { game : this.props.game, dispatch : this.props.dispatch }),
      React.DOM.table(null, React.DOM.tbody(null, this.props.game.generateRow(y => this._makeGameRow(y)))),
      React.DOM.input({ type : 'number', step : 1, min : 1, max : 6, value : this.state.size, onChange : e => this._changeSize(e) }),
      React.DOM.button({ onClick : () => this._startGame() }, 'Start new game')
    );
  }

  _makeGameRow(y) {
    return React.DOM.tr({ key : y }, this.props.game.generateRow(x => this._makeGame(x, y)));
  }

  _makeGame(x, y) {
    return React.DOM.td({ key : x }, React.createElement(CellBox, { game : this.props.game, dispatch : this.props.dispatch, x, y }));
  }

  _startGame() {
    this.props.dispatch({ action : 'NEW_GAME_STARTED', size : this.props.game.getSize() });
  }

  _changeSize(event) {
    // TODO currentTarget is used in place of target in 0.14.0-beta1 due to https://github.com/facebook/react/issues/4288
    var size = parseInt(event.currentTarget.value, 10);
    if (!isNaN(size)) {
      this.props.dispatch({ action : 'NEW_GAME_STARTED', size });
    }
  }
}
