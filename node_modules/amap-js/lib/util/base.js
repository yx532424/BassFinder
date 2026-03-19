"use strict";

exports.__esModule = true;
exports.isObject = isObject;
exports.noop = noop;
exports.readonly = readonly;

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject(obj) {
  return obj !== null && typeof obj === "object";
}
/**
 * noop function
 */


function noop() {}
/**
 * Set object property value to read-only
 */


function readonly(target, prop, value) {
  if (value === void 0) {
    value = target[prop];
  }

  Object.defineProperty(target, prop, {
    configurable: false,
    writable: false,
    value: value
  });
}