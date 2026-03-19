"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

/**
 * Loader
 */
var Loader = /*#__PURE__*/function () {
  function Loader() {
    this.readyState = "";
  }

  var _proto = Loader.prototype;

  _proto.load = /*#__PURE__*/function () {
    var _load = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function load() {
      return _load.apply(this, arguments);
    }

    return load;
  }();

  return Loader;
}();

var _default = Loader;
exports.default = _default;