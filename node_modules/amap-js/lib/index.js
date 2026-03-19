"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _constants = require("./constants");

exports.version = _constants.version;

var _Loader = _interopRequireDefault(require("./loaders/Loader"));

exports.Loader = _Loader.default;

var _LoaderUtil = _interopRequireDefault(require("./loaders/LoaderUtil"));

exports.LoaderUtil = _LoaderUtil.default;

var _ScriptLoader = _interopRequireDefault(require("./loaders/ScriptLoader"));

exports.ScriptLoader = _ScriptLoader.default;

var _AMapLoader = _interopRequireDefault(require("./loaders/AMapLoader"));

exports.AMapLoader = _AMapLoader.default;

var _AMapUILoader = _interopRequireDefault(require("./loaders/AMapUILoader"));

exports.AMapUILoader = _AMapUILoader.default;

var _LocaLoader = _interopRequireDefault(require("./loaders/LocaLoader"));

exports.LocaLoader = _LocaLoader.default;

var _SubwayLoader = _interopRequireDefault(require("./loaders/SubwayLoader"));

exports.SubwayLoader = _SubwayLoader.default;

var _LoadQueue = _interopRequireDefault(require("./LoadQueue"));

exports.LoadQueue = _LoadQueue.default;
var AMapJS = {
  version: _constants.version,
  Loader: _Loader.default,
  LoaderUtil: _LoaderUtil.default,
  ScriptLoader: _ScriptLoader.default,
  AMapLoader: _AMapLoader.default,
  AMapUILoader: _AMapUILoader.default,
  LocaLoader: _LocaLoader.default,
  SubwayLoader: _SubwayLoader.default,
  LoadQueue: _LoadQueue.default
};
/**
 * Export
 */

var _default = AMapJS;
exports.default = _default;