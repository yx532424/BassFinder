"use strict";

exports.__esModule = true;
exports.default = void 0;

var _base = require("./base");

/**
 * deepMerge
 * @param target  {Object|Array}  merge target
 * @param objN    {Object|Array}  obj1, obj2, obj3...
 * @returns target
 */
function deepMerge(target) {
  function assignItem(val, key) {
    if ((0, _base.isObject)(target[key]) && (0, _base.isObject)(val)) {
      target[key] = deepMerge(target[key], val);
    } else if ((0, _base.isObject)(val)) {
      var _target = Array.isArray(val) ? [] : {};

      target[key] = deepMerge(_target, val);
    } else {
      target[key] = val;
    }
  }

  for (var i = 1, l = arguments.length; i < l; i++) {
    for (var key in arguments[i]) {
      assignItem(arguments[i][key], key);
    }
  }

  return target;
}

var _default = deepMerge;
exports.default = _default;