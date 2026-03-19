import { readonly } from "../util/base";
export default {
  registerReadyState: function registerReadyState(target, props) {
    if (props === void 0) {
      props = {};
    }

    for (var prop in props) {
      var value = props[prop];
      if (!prop || value === undefined) return false;
      target[prop] = target.prototype[prop] = value;
      readonly(target, prop);
      readonly(target.prototype, prop);
    }

    return true;
  },
  parseTemplate: function parseTemplate(src, params) {
    return src ? src.replace(/\$([A-Za-z0-9_]+)/g, function (match, key) {
      return undefined === params[key] ? match : params[key];
    }) : "";
  }
};