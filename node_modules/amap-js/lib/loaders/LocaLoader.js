"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _Loader2 = _interopRequireDefault(require("./Loader"));

var _LoaderUtil = _interopRequireDefault(require("./LoaderUtil"));

var _ScriptLoader = _interopRequireDefault(require("./ScriptLoader"));

var SymbolLoad = Symbol("Symbol.load");
/**
 * LocaLoader 数据可视化加载器
 */

var LocaLoader = /*#__PURE__*/function (_Loader) {
  (0, _inheritsLoose2.default)(LocaLoader, _Loader);

  function LocaLoader(options) {
    var _this;

    if (options === void 0) {
      options = {};
    }

    _this = _Loader.call(this) || this;
    _this.key = options.key || "";
    _this.version = options.version || "1.3.2";
    _this.Loca = null;
    _this.readyState = _this.CREATED;
    _this[SymbolLoad] = null;
    return _this;
  }

  var _proto = LocaLoader.prototype;

  _proto.getUrl = function getUrl() {
    return _LoaderUtil.default.parseTemplate("https://webapi.amap.com/loca?key=$key&v=$version", {
      key: this.key,
      version: this.version
    });
  };

  _proto.load = function load() {
    var _this2 = this;

    if (this[SymbolLoad]) return this[SymbolLoad];
    this.readyState = this.LOADING;
    this[SymbolLoad] = new Promise(function (resolve, reject) {
      var url = _this2.getUrl();

      var script = new _ScriptLoader.default(url);

      var onScriptLoad = function onScriptLoad() {
        if (!window.Loca) return reject(new Error("请检查当前Loca API是否可用！"));
        _this2.Loca = window.Loca;
        _this2.readyState = _this2.LOADED;
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

  return LocaLoader;
}(_Loader2.default);
/**
 * 添加ReadyState
 */


_LoaderUtil.default.registerReadyState(LocaLoader, {
  CREATED: "created",
  LOADING: "loading",
  LOADED: "loaded",
  FAILED: "failed"
});

var _default = LocaLoader;
exports.default = _default;