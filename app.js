/* jshint node: true, browser: true, esnext: true */
'use strict';

var React = require('react');

var dispatcher = require('./dispatcher')();
var game = require('./game-store')(dispatcher);

var GameBox = require('./game-box');

React.render(React.createElement(GameBox, { dispatch : dispatcher.dispatch, game }), document.body);
