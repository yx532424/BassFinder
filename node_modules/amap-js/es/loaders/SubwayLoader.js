import _inheritsLoose from "@babel/runtime/helpers/esm/inheritsLoose";
import Loader from "./Loader";
import LoaderUtil from "./LoaderUtil";
import ScriptLoader from "./ScriptLoader";
var SymbolLoad = Symbol("Symbol.load");
/**
 * callback count
 */

var count = 0;
/**
 * SubwayLoader 地铁图加载器
 */

var SubwayLoader = /*#__PURE__*/function (_Loader) {
  _inheritsLoose(SubwayLoader, _Loader);

  function SubwayLoader(options) {
    var _this;

    if (options === void 0) {
      options = {};
    }

    _this = _Loader.call(this, options) || this;
    _this.key = "";
    _this.version = options.version || "1.0";
    _this.callback = options.callback || "__onSubwayLoaded" + count++;
    _this.subway = null;
    _this.readyState = _this.CREATED;
    _this[SymbolLoad] = null;
    return _this;
  }

  var _proto = SubwayLoader.prototype;

  _proto.getUrl = function getUrl() {
    return LoaderUtil.parseTemplate("https://webapi.amap.com/subway?key=$key&v=$version&callback=$callback", {
      key: this.key,
      version: this.version,
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
      var script = new ScriptLoader(url);

      var onScriptLoad = function onScriptLoad() {
        if (callback && callback !== "") {
          delete window[callback];
        }

        _this2.subway = window.subway;
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

  return SubwayLoader;
}(Loader);
/**
 * 添加ReadyState
 */


LoaderUtil.registerReadyState(SubwayLoader, {
  CREATED: "created",
  LOADING: "loading",
  LOADED: "loaded",
  FAILED: "failed"
});
export default SubwayLoader;