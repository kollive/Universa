'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* eslint no-console: ["error", { allow: ["error"] }] */


exports.default = router;

var _fsmIterator2 = require('fsm-iterator');

var _fsmIterator3 = _interopRequireDefault(_fsmIterator2);

var _buildRouteMatcher = require('./buildRouteMatcher');

var _buildRouteMatcher2 = _interopRequireDefault(_buildRouteMatcher);

var _createHistoryChannel = require('./createHistoryChannel');

var _createHistoryChannel2 = _interopRequireDefault(_createHistoryChannel);

var _effects2 = require('./effects');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var INIT = 'INIT';
var LISTEN = 'LISTEN';
var BEFORE_HANDLE_LOCATION = 'BEFORE_HANDLE_LOCATION';
var AWAIT_BEFORE_ALL = 'AWAIT_BEFORE_HANDLE_LOCATION';
var HANDLE_LOCATION = 'HANDLE_LOCATION';

function router(history, routes) {
  var _fsmIterator;

  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var routeMatcher = (0, _buildRouteMatcher2.default)(routes);
  var historyChannel = null;
  var lastMatch = null;
  var lastSaga = null;
  var pendingBeforeRouteChange = null;
  var currentLocation = null;

  function errorMessageValue(error, message) {
    var finalMessage = 'Redux Saga Router: ' + message + ':\n' + error.message;

    if ('stack' in error) {
      finalMessage += '\n' + error.stack;
    }

    return {
      value: (0, _effects2.call)([console, console.error], finalMessage),
      next: LISTEN
    };
  }

  return (0, _fsmIterator3.default)(INIT, (_fsmIterator = {}, _defineProperty(_fsmIterator, INIT, function () {
    return {
      value: (0, _effects2.call)(_createHistoryChannel2.default, history),
      next: LISTEN
    };
  }), _defineProperty(_fsmIterator, LISTEN, function (effects) {
    if (effects && !historyChannel) {
      historyChannel = effects;
    }

    if (effects instanceof Array) {
      var _effects = _slicedToArray(effects, 1);

      lastSaga = _effects[0];
    }

    if ('beforeRouteChange' in options) {
      return {
        value: (0, _effects2.take)(historyChannel),
        next: BEFORE_HANDLE_LOCATION
      };
    }

    return {
      value: (0, _effects2.take)(historyChannel),
      next: HANDLE_LOCATION
    };
  }), _defineProperty(_fsmIterator, BEFORE_HANDLE_LOCATION, function (location, fsm) {
    var path = location.pathname;
    var match = routeMatcher.match(path);
    currentLocation = location;

    if (!match) {
      return fsm[LISTEN]();
    }

    pendingBeforeRouteChange = (0, _effects2.spawn)(options.beforeRouteChange, match.params);

    return {
      value: pendingBeforeRouteChange,
      next: AWAIT_BEFORE_ALL
    };
  }), _defineProperty(_fsmIterator, AWAIT_BEFORE_ALL, function (task) {
    if (task) {
      return { value: (0, _effects2.join)(task), next: HANDLE_LOCATION };
    }
    return {
      value: (0, _effects2.join)(pendingBeforeRouteChange),
      next: HANDLE_LOCATION
    };
  }), _defineProperty(_fsmIterator, HANDLE_LOCATION, function (location, fsm) {
    var path = location ? location.pathname : currentLocation.pathname;
    var match = routeMatcher.match(path);
    var effects = [];

    while (match !== null) {
      lastMatch = match;
      effects.push((0, _effects2.spawn)(match.action, match.params));
      match = options.matchAll ? match.next() : null;
    }

    if (lastSaga) {
      effects.push((0, _effects2.cancel)(lastSaga));
    }

    if (effects.length > 0) {
      return {
        value: (0, _effects2.all)(effects),
        next: LISTEN
      };
    }

    return fsm[LISTEN]();
  }), _defineProperty(_fsmIterator, 'throw', function _throw(e, fsm) {
    switch (fsm.previousState) {
      case HANDLE_LOCATION:
        return errorMessageValue(e, 'Unhandled ' + e.name + ' in route "' + lastMatch.route + '"');

      case LISTEN:
        return errorMessageValue(e, 'Unexpected ' + e.name + ' while listening for route');

      case BEFORE_HANDLE_LOCATION:
      case AWAIT_BEFORE_ALL:
        return errorMessageValue(e, 'Error ' + e.name + ' was uncaught within the before handle location hook.');

      default:
        return { done: true };
    }
  }), _fsmIterator));
}