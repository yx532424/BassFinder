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
 * API Callback Counter
 */

var callbackCounter = 0;
/**
 * AMapLoader 加载器
 */

var AMapLoader = /*#__PURE__*/function (_Loader) {
  (0, _inheritsLoose2.default)(AMapLoader, _Loader);

  function AMapLoader(options) {
    var _this;

    if (options === void 0) {
      options = {};
    }

    _this = _Loader.call(this) || this;
    _this.key = options.key || "";
    _this.version = options.version || "1.4.15";
    _this.plugins = options.plugins || [];
    _this.callback = options.callback || "__onAMapLoaded" + callbackCounter++;
    _this.security = options.security ? options.security : false; // this.security = {
    //   serviceHost: "您的代理服务器域名或地址/_AMapService"
    //   securityJsCode: "您申请的安全密钥"
    // };

    _this.AMap = null;
    _this.readyState = _this.CREATED;
    _this[SymbolLoad] = null;
    return _this;
  }

  var _proto = AMapLoader.prototype;

  _proto.getUrl = function getUrl() {
    // 目前官方设计 `callback` 并不是必须的，如果自定义url无 `callback`，请设置 this.callback = ""; 避免加载时出现引用问题。
    return _LoaderUtil.default.parseTemplate("https://webapi.amap.com/maps?key=$key&v=$version&plugin=$plugins&callback=$callback", {
      key: this.key,
      version: this.version,
      plugins: this.plugins.join(","),
      callback: this.callback
    });
  };

  _proto.load = function load() {
    var _this2 = this;

    if (this[SymbolLoad]) return this[SymbolLoad];
    this.readyState = this.LOADING;
    this[SymbolLoad] = new Promise(function (resolve, reject) {
      var url = _this2.getUrl();

      var callback = _this2.callback;
      /**
       * 自2021年12月02日升级，升级之后所申请的 key 必须配备安全密钥 jscode 一起使用
       * 注意：此次升级不会影响之前已获得 key 的使用；升级之后的新增的key必须要配备安全密钥一起使用，
       * 具体用法请您参看下文《JSAPI key和安全密钥设置和使用》（本次key升级新增安全密钥，是为了提升广大用户的对自己的key安全有效管理，降低明文传输被窃取的风险 。）
       */

      if (_this2.security) {
        window._AMapSecurityConfig = _this2.security;
      } else {
        delete window._AMapSecurityConfig;
      }

      var script = new _ScriptLoader.default(url);

      var onScriptLoad = function onScriptLoad() {
        if (callback && callback !== "") {
          delete window[callback];
        }

        _this2.AMap = window.AMap;
        _this2.readyState = _this2.LOADED;
        resolve(_this2);
      };

      var onScriptError = function onScriptError(event) {
        if (callback && callback !== "") {
          delete window[callback];
        }

        _this2[SymbolLoad] = null;
        _this2.readyState = _this2.FAILED;
        reject(event);
      };

      if (callback && callback !== "") {
        window[callback] = onScriptLoad;
        script.load().catch(onScriptError);
      } else {
        script.load().then(onScriptLoad).catch(onScriptError);
      }
    });
    return this[SymbolLoad];
  };

  _proto.loadPlugin = function loadPlugin(plugins) {
    var _this3 = this;

    if (plugins === void 0) {
      plugins = [];
    }

    return new Promise(function (resolve, reject) {
      if (!_this3.AMap) return reject("请先加载AMap.");
      var newPlugins = [];

      for (var i = 0; i < plugins.length; i += 1) {
        if (_this3.plugins.indexOf(plugins[i]) === -1) {
          newPlugins.push(plugins[i]);
        }
      }

      if (newPlugins.length) {
        _this3.AMap.plugin(newPlugins, function () {
          _this3.plugins = _this3.plugins.concat(newPlugins);
          resolve(_this3);
        });
      } else {
        resolve(_this3);
      }
    });
  };

  return AMapLoader;
}(_Loader2.default);
/**
 * 添加ReadyState
 */


_LoaderUtil.default.registerReadyState(AMapLoader, {
  CREATED: "created",
  LOADING: "loading",
  LOADED: "loaded",
  FAILED: "failed"
});

var _default = AMapLoader;
exports.default = _default;