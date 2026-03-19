import _inheritsLoose from "@babel/runtime/helpers/esm/inheritsLoose";
import Loader from "./Loader";
import LoaderUtil from "./LoaderUtil";
var SymbolLoad = Symbol("Symbol.load");
/**
 * ScriptLoader 加载器
 */

var ScriptLoader = /*#__PURE__*/function (_Loader) {
  _inheritsLoose(ScriptLoader, _Loader);

  function ScriptLoader(url) {
    var _this;

    _this = _Loader.call(this) || this;
    _this.url = url || "";
    _this.readyState = _this.CREATED;
    _this[SymbolLoad] = null;
    return _this;
  }

  var _proto = ScriptLoader.prototype;

  _proto.load = function load() {
    var _this2 = this;

    if (this[SymbolLoad]) return this[SymbolLoad];
    this.readyState = this.LOADING;
    this[SymbolLoad] = new Promise(function (resolve, reject) {
      if (!window || !document) {
        reject(new Error(_this2.constructor.name + " can only be used in Browser."));
        return;
      }

      var script = document.createElement("script");

      var onScriptLoad = function onScriptLoad() {
        script.removeEventListener("load", onScriptLoad, false);
        script.removeEventListener("error", onScriptError, false);
        _this2.readyState = _this2.LOADED;
        resolve(_this2);
      };

      var onScriptError = function onScriptError(event) {
        script.removeEventListener("load", onScriptLoad, false);
        script.removeEventListener("error", onScriptError, false);
        _this2[SymbolLoad] = null;
        _this2.readyState = _this2.FAILED;
        reject(event);
      };

      script.addEventListener("load", onScriptLoad, false);
      script.addEventListener("error", onScriptError, false);
      script.src = _this2.url;
      var target = document.getElementsByTagName("script")[0] || document.head || document.getElementsByTagName("head")[0];
      target.parentNode.insertBefore(script, target);
      if (script.parentNode) script.parentNode.removeChild(script);
    });
    return this[SymbolLoad];
  };

  return ScriptLoader;
}(Loader);
/**
 * 添加ReadyState
 */


LoaderUtil.registerReadyState(ScriptLoader, {
  CREATED: "created",
  LOADING: "loading",
  LOADED: "loaded",
  FAILED: "failed"
});
export default ScriptLoader;