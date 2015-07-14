/* jshint node: true, browser: true, esnext: true */
'use strict';

import React from 'react';
//import ReactDOM from 'react-dom';

import GameBox from './game-box';

import newDispatcher from './dispatcher';
import newGameStore from './game-store';

var dispatcher = newDispatcher();
var game = newGameStore(dispatcher);

React.render(React.createElement(GameBox, { dispatch : dispatcher.dispatch, game }), document.body);
