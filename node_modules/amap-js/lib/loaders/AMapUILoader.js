"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _Loader2 = _interopRequireDefault(require("./Loader"));

var _LoaderUtil = _interopRequireDefault(require("./LoaderUtil"));

var _ScriptLoader = _interopRequireDefault(require("./ScriptLoader"));

var _base = require("../util/base");

var SymbolLoad = Symbol("Symbol.load");
/**
 * AMapUILoader 加载器
 */

var AMapUILoader = /*#__PURE__*/function (_Loader) {
  (0, _inheritsLoose2.default)(AMapUILoader, _Loader);

  function AMapUILoader(options) {
    var _this;

    if (options === void 0) {
      options = {};
    }

    _this = _Loader.call(this) || this;
    _this.version = options.version || "1.1";
    _this.async = options.async || false;
    _this.initAMapUI = _base.noop;
    _this.AMapUI = null;
    _this.readyState = _this.CREATED;
    _this[SymbolLoad] = null;
    return _this;
  }

  var _proto = AMapUILoader.prototype;

  _proto.getUrl = function getUrl() {
    return _LoaderUtil.default.parseTemplate("https://webapi.amap.com/ui/$version/$main", {
      version: this.version,
      main: this.async ? "main-async.js" : "main.js"
    });
  };

  _proto.load = function load() {
    var _this2 = this;

    if (this[SymbolLoad]) return this[SymbolLoad];
    this.readyState = this.LOADING;
    this[SymbolLoad] = new Promise(function (resolve, reject) {
      var url = _this2.getUrl();

      var async = _this2.async;
      var script = new _ScriptLoader.default(url);

      var onScriptLoad = function onScriptLoad() {
        _this2.readyState = _this2.LOADED;

        if (async) {
          _this2.initAMapUI = function () {
            _this2.initAMapUI = _base.noop;
            window.initAMapUI();
            _this2.AMapUI = window.AMapUI;
            _this2.readyState = _this2.MOUNTED;
          };
        } else {
          _this2.initAMapUI = _base.noop;
          _this2.AMapUI = window.AMapUI;
          _this2.readyState = _this2.MOUNTED;
        }

        resolve(_this2);
      };

      var onScriptError = function onScriptError(event) {
        _this2[SymbolLoad] = null;
        _this2.readyState = _this2.FAILED;
        reject(event);
      };

      script.load().then(onScriptLoad).catch(onScriptError);
    });
    return this[SymbolLoad];
  };

  _proto.loadUI = function loadUI(unames) {
    var _this3 = this;

    if (unames === void 0) {
      unames = [];
    }

    return new Promise(function (resolve, reject) {
      if (!_this3.AMapUI) return reject("请先加载AMapUI.");

      if (unames.length) {
        _this3.AMapUI.loadUI(unames, function () {
          for (var _len = arguments.length, umodules = new Array(_len), _key = 0; _key < _len; _key++) {
            umodules[_key] = arguments[_key];
          }

          resolve(umodules);
        });
      } else {
        resolve([]);
      }
    });
  };

  _proto.loadModule = function loadModule(unames, opts) {
    var _this4 = this;

    if (unames === void 0) {
      unames = [];
    }

    return new Promise(function (resolve, reject) {
      if (!_this4.AMapUI) return reject("请先加载AMapUI.");

      if (unames.length) {
        _this4.AMapUI.load(unames, function () {
          for (var _len2 = arguments.length, umodules = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            umodules[_key2] = arguments[_key2];
          }

          resolve(umodules);
        }, opts);
      } else {
        resolve([]);
      }
    });
  };

  return AMapUILoader;
}(_Loader2.default);
/**
 * 添加ReadyState
 */


_LoaderUtil.default.registerReadyState(AMapUILoader, {
  CREATED: "created",
  LOADING: "loading",
  LOADED: "loaded",
  FAILED: "failed",
  MOUNTED: "mounted"
});

var _default = AMapUILoader;
exports.default = _default;