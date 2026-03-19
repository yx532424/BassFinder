import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";

/**
 * Loader
 */
var Loader = /*#__PURE__*/function () {
  function Loader() {
    this.readyState = "";
  }

  var _proto = Loader.prototype;

  _proto.load = /*#__PURE__*/function () {
    var _load = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      return _regeneratorRuntime.wrap(function _callee$(_context) {
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

export default Loader;