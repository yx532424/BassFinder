import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import LoaderUtil from "./loaders/LoaderUtil";

function queueLoad(manifest) {
  var promise = Promise.resolve([]);

  var _loop = function _loop(i, len) {
    var item = manifest[i];
    promise = promise.then(function (result) {
      return new Promise( /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(resolve, reject) {
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;

                  if (!(typeof item.resolve === "function")) {
                    _context.next = 9;
                    break;
                  }

                  _context.t0 = result;
                  _context.next = 5;
                  return item.resolve();

                case 5:
                  _context.t1 = _context.sent;

                  _context.t0.push.call(_context.t0, _context.t1);

                  _context.next = 14;
                  break;

                case 9:
                  _context.t2 = result;
                  _context.next = 12;
                  return item.resolve;

                case 12:
                  _context.t3 = _context.sent;

                  _context.t2.push.call(_context.t2, _context.t3);

                case 14:
                  resolve(result);
                  _context.next = 20;
                  break;

                case 17:
                  _context.prev = 17;
                  _context.t4 = _context["catch"](0);
                  reject(_context.t4);

                case 20:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[0, 17]]);
        }));

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
    });
  };

  for (var i = 0, len = manifest.length; i < len; i++) {
    _loop(i, len);
  }

  return promise;
}

function parallelLoad(manifest) {
  var promiseList = [];

  for (var i = 0, len = manifest.length; i < len; i++) {
    var item = manifest[i];

    if (typeof item.resolve === "function") {
      promiseList.push(item.resolve());
    } else {
      promiseList.push(item.resolve);
    }
  }

  return Promise.all(promiseList);
}

var SymbolLoad = Symbol("Symbol.load");

var LoadQueue = /*#__PURE__*/function () {
  function LoadQueue(manifest, queue) {
    if (manifest === void 0) {
      manifest = [];
    }

    if (queue === void 0) {
      queue = true;
    }

    this.manifest = manifest; // [{ id, loader }]

    this.queue = queue;
    this.result = null;
    this.readyState = this.CREATED;
  }

  var _proto = LoadQueue.prototype;

  _proto.load = function load() {
    var _this = this;

    if (this[SymbolLoad]) return this[SymbolLoad];
    this.readyState = this.LOADING;
    this[SymbolLoad] = new Promise(function (resolve, reject) {
      // 队列结果反馈
      (_this.queue ? queueLoad : parallelLoad)(_this.manifest).then(function (result) {
        _this.manifest.forEach(function (item, index) {
          if (!_this.result) _this.result = {};
          _this.result[item.id] = result[index];
        });

        _this.readyState = _this.COMPLETE;
        resolve(_this);
      }).catch(function (error) {
        _this.readyState = _this.ERROR;
        reject(error);
      });
    });
    return this[SymbolLoad];
  };

  _proto.getItem = function getItem(id) {
    if (this.result) {
      return this.result[id];
    }

    return null;
  };

  _proto.getResult = function getResult() {
    return this.result;
  };

  return LoadQueue;
}();
/**
 * 添加ReadyState
 */


LoaderUtil.registerReadyState(LoadQueue, {
  CREATED: "created",
  LOADING: "loading",
  COMPLETE: "complete",
  ERROR: "error"
});
export default LoadQueue;