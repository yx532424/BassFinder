import _inheritsLoose from "@babel/runtime/helpers/esm/inheritsLoose";
import Loader from "./Loader";
import LoaderUtil from "./LoaderUtil";
import ScriptLoader from "./ScriptLoader";
var SymbolLoad = Symbol("Symbol.load");
/**
 * LocaLoader 数据可视化加载器
 */

var LocaLoader = /*#__PURE__*/function (_Loader) {
  _inheritsLoose(LocaLoader, _Loader);

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
    return LoaderUtil.parseTemplate("https://webapi.amap.com/loca?key=$key&v=$version", {
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

      var script = new ScriptLoader(url);

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
}(Loader);
/**
 * 添加ReadyState
 */


LoaderUtil.registerReadyState(LocaLoader, {
  CREATED: "created",
  LOADING: "loading",
  LOADED: "loaded",
  FAILED: "failed"
});
export default LocaLoader;