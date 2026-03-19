/*!
 * amap-js v2.4.0
 * 
 * Copyright (c) 2018-present Derek Li
 * Released under the MIT License - https://choosealicense.com/licenses/mit/
 * 
 * https://github.com/iDerekLi/amap-js
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("AMapJS", [], factory);
	else if(typeof exports === 'object')
		exports["AMapJS"] = factory();
	else
		root["AMapJS"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : undefined
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "version", function() { return /* reexport */ version; });
__webpack_require__.d(__webpack_exports__, "Loader", function() { return /* reexport */ loaders_Loader; });
__webpack_require__.d(__webpack_exports__, "LoaderUtil", function() { return /* reexport */ LoaderUtil; });
__webpack_require__.d(__webpack_exports__, "ScriptLoader", function() { return /* reexport */ loaders_ScriptLoader; });
__webpack_require__.d(__webpack_exports__, "AMapLoader", function() { return /* reexport */ loaders_AMapLoader; });
__webpack_require__.d(__webpack_exports__, "AMapUILoader", function() { return /* reexport */ loaders_AMapUILoader; });
__webpack_require__.d(__webpack_exports__, "LocaLoader", function() { return /* reexport */ loaders_LocaLoader; });
__webpack_require__.d(__webpack_exports__, "SubwayLoader", function() { return /* reexport */ loaders_SubwayLoader; });
__webpack_require__.d(__webpack_exports__, "LoadQueue", function() { return /* reexport */ src_LoadQueue; });

// CONCATENATED MODULE: ./src/constants.js
var version = "2.4.0";
// CONCATENATED MODULE: /home/runner/work/amap-js/amap-js/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}
// EXTERNAL MODULE: /home/runner/work/amap-js/amap-js/node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__(0);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);

// CONCATENATED MODULE: ./src/loaders/Loader.js



/**
 * Loader
 */
var Loader_Loader = /*#__PURE__*/function () {
  function Loader() {
    this.readyState = "";
  }

  var _proto = Loader.prototype;

  _proto.load = /*#__PURE__*/function () {
    var _load = _asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee() {
      return regenerator_default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function load() {
      return _load.apply(this, arguments);
    }

    return load;
  }();

  return Loader;
}();

/* harmony default export */ var loaders_Loader = (Loader_Loader);
// CONCATENATED MODULE: ./src/util/base.js
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
// CONCATENATED MODULE: ./src/loaders/LoaderUtil.js

/* harmony default export */ var LoaderUtil = ({
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
});
// CONCATENATED MODULE: /home/runner/work/amap-js/amap-js/node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}
// CONCATENATED MODULE: /home/runner/work/amap-js/amap-js/node_modules/@babel/runtime/helpers/esm/inheritsLoose.js

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
// CONCATENATED MODULE: ./src/loaders/ScriptLoader.js



var SymbolLoad = Symbol("Symbol.load");
/**
 * ScriptLoader 加载器
 */

var ScriptLoader_ScriptLoader = /*#__PURE__*/function (_Loader) {
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
}(loaders_Loader);
/**
 * 添加ReadyState
 */


LoaderUtil.registerReadyState(ScriptLoader_ScriptLoader, {
  CREATED: "created",
  LOADING: "loading",
  LOADED: "loaded",
  FAILED: "failed"
});
/* harmony default export */ var loaders_ScriptLoader = (ScriptLoader_ScriptLoader);
// CONCATENATED MODULE: ./src/loaders/AMapLoader.js




var AMapLoader_SymbolLoad = Symbol("Symbol.load");
/**
 * API Callback Counter
 */

var callbackCounter = 0;
/**
 * AMapLoader 加载器
 */

var AMapLoader_AMapLoader = /*#__PURE__*/function (_Loader) {
  _inheritsLoose(AMapLoader, _Loader);

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
    _this[AMapLoader_SymbolLoad] = null;
    return _this;
  }

  var _proto = AMapLoader.prototype;

  _proto.getUrl = function getUrl() {
    // 目前官方设计 `callback` 并不是必须的，如果自定义url无 `callback`，请设置 this.callback = ""; 避免加载时出现引用问题。
    return LoaderUtil.parseTemplate("https://webapi.amap.com/maps?key=$key&v=$version&plugin=$plugins&callback=$callback", {
      key: this.key,
      version: this.version,
      plugins: this.plugins.join(","),
      callback: this.callback
    });
  };

  _proto.load = function load() {
    var _this2 = this;

    if (this[AMapLoader_SymbolLoad]) return this[AMapLoader_SymbolLoad];
    this.readyState = this.LOADING;
    this[AMapLoader_SymbolLoad] = new Promise(function (resolve, reject) {
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

      var script = new loaders_ScriptLoader(url);

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

        _this2[AMapLoader_SymbolLoad] = null;
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
    return this[AMapLoader_SymbolLoad];
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
}(loaders_Loader);
/**
 * 添加ReadyState
 */


LoaderUtil.registerReadyState(AMapLoader_AMapLoader, {
  CREATED: "created",
  LOADING: "loading",
  LOADED: "loaded",
  FAILED: "failed"
});
/* harmony default export */ var loaders_AMapLoader = (AMapLoader_AMapLoader);
// CONCATENATED MODULE: ./src/loaders/AMapUILoader.js





var AMapUILoader_SymbolLoad = Symbol("Symbol.load");
/**
 * AMapUILoader 加载器
 */

var AMapUILoader_AMapUILoader = /*#__PURE__*/function (_Loader) {
  _inheritsLoose(AMapUILoader, _Loader);

  function AMapUILoader(options) {
    var _this;

    if (options === void 0) {
      options = {};
    }

    _this = _Loader.call(this) || this;
    _this.version = options.version || "1.1";
    _this.async = options.async || false;
    _this.initAMapUI = noop;
    _this.AMapUI = null;
    _this.readyState = _this.CREATED;
    _this[AMapUILoader_SymbolLoad] = null;
    return _this;
  }

  var _proto = AMapUILoader.prototype;

  _proto.getUrl = function getUrl() {
    return LoaderUtil.parseTemplate("https://webapi.amap.com/ui/$version/$main", {
      version: this.version,
      main: this.async ? "main-async.js" : "main.js"
    });
  };

  _proto.load = function load() {
    var _this2 = this;

    if (this[AMapUILoader_SymbolLoad]) return this[AMapUILoader_SymbolLoad];
    this.readyState = this.LOADING;
    this[AMapUILoader_SymbolLoad] = new Promise(function (resolve, reject) {
      var url = _this2.getUrl();

      var async = _this2.async;
      var script = new loaders_ScriptLoader(url);

      var onScriptLoad = function onScriptLoad() {
        _this2.readyState = _this2.LOADED;

        if (async) {
          _this2.initAMapUI = function () {
            _this2.initAMapUI = noop;
            window.initAMapUI();
            _this2.AMapUI = window.AMapUI;
            _this2.readyState = _this2.MOUNTED;
          };
        } else {
          _this2.initAMapUI = noop;
          _this2.AMapUI = window.AMapUI;
          _this2.readyState = _this2.MOUNTED;
        }

        resolve(_this2);
      };

      var onScriptError = function onScriptError(event) {
        _this2[AMapUILoader_SymbolLoad] = null;
        _this2.readyState = _this2.FAILED;
        reject(event);
      };

      script.load().then(onScriptLoad).catch(onScriptError);
    });
    return this[AMapUILoader_SymbolLoad];
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
}(loaders_Loader);
/**
 * 添加ReadyState
 */


LoaderUtil.registerReadyState(AMapUILoader_AMapUILoader, {
  CREATED: "created",
  LOADING: "loading",
  LOADED: "loaded",
  FAILED: "failed",
  MOUNTED: "mounted"
});
/* harmony default export */ var loaders_AMapUILoader = (AMapUILoader_AMapUILoader);
// CONCATENATED MODULE: ./src/loaders/LocaLoader.js




var LocaLoader_SymbolLoad = Symbol("Symbol.load");
/**
 * LocaLoader 数据可视化加载器
 */

var LocaLoader_LocaLoader = /*#__PURE__*/function (_Loader) {
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
    _this[LocaLoader_SymbolLoad] = null;
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

    if (this[LocaLoader_SymbolLoad]) return this[LocaLoader_SymbolLoad];
    this.readyState = this.LOADING;
    this[LocaLoader_SymbolLoad] = new Promise(function (resolve, reject) {
      var url = _this2.getUrl();

      var script = new loaders_ScriptLoader(url);

      var onScriptLoad = function onScriptLoad() {
        if (!window.Loca) return reject(new Error("请检查当前Loca API是否可用！"));
        _this2.Loca = window.Loca;
        _this2.readyState = _this2.LOADED;
        resolve(_this2);
      };

      var onScriptError = function onScriptError(event) {
        _this2[LocaLoader_SymbolLoad] = null;
        _this2.readyState = _this2.FAILED;
        reject(event);
      };

      script.load().then(onScriptLoad).catch(onScriptError);
    });
    return this[LocaLoader_SymbolLoad];
  };

  return LocaLoader;
}(loaders_Loader);
/**
 * 添加ReadyState
 */


LoaderUtil.registerReadyState(LocaLoader_LocaLoader, {
  CREATED: "created",
  LOADING: "loading",
  LOADED: "loaded",
  FAILED: "failed"
});
/* harmony default export */ var loaders_LocaLoader = (LocaLoader_LocaLoader);
// CONCATENATED MODULE: ./src/loaders/SubwayLoader.js




var SubwayLoader_SymbolLoad = Symbol("Symbol.load");
/**
 * callback count
 */

var count = 0;
/**
 * SubwayLoader 地铁图加载器
 */

var SubwayLoader_SubwayLoader = /*#__PURE__*/function (_Loader) {
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
    _this[SubwayLoader_SymbolLoad] = null;
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

    if (this[SubwayLoader_SymbolLoad]) return this[SubwayLoader_SymbolLoad];
    this.readyState = this.LOADING;
    this[SubwayLoader_SymbolLoad] = new Promise(function (resolve, reject) {
      var url = _this2.getUrl();

      var callback = _this2.callback;
      var script = new loaders_ScriptLoader(url);

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

        _this2[SubwayLoader_SymbolLoad] = null;
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
    return this[SubwayLoader_SymbolLoad];
  };

  return SubwayLoader;
}(loaders_Loader);
/**
 * 添加ReadyState
 */


LoaderUtil.registerReadyState(SubwayLoader_SubwayLoader, {
  CREATED: "created",
  LOADING: "loading",
  LOADED: "loaded",
  FAILED: "failed"
});
/* harmony default export */ var loaders_SubwayLoader = (SubwayLoader_SubwayLoader);
// CONCATENATED MODULE: ./src/LoadQueue.js




function queueLoad(manifest) {
  var promise = Promise.resolve([]);

  var _loop = function _loop(i, len) {
    var item = manifest[i];
    promise = promise.then(function (result) {
      return new Promise( /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee(resolve, reject) {
          return regenerator_default.a.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;

                  if (!(typeof item.resolve === "function")) {
                    _context.next = 9;
                    break;
                  }

                  _context.t0 = result;
                  _context.next = 5;
                  return item.resolve();

                case 5:
                  _context.t1 = _context.sent;

                  _context.t0.push.call(_context.t0, _context.t1);

                  _context.next = 14;
                  break;

                case 9:
                  _context.t2 = result;
                  _context.next = 12;
                  return item.resolve;

                case 12:
                  _context.t3 = _context.sent;

                  _context.t2.push.call(_context.t2, _context.t3);

                case 14:
                  resolve(result);
                  _context.next = 20;
                  break;

                case 17:
                  _context.prev = 17;
                  _context.t4 = _context["catch"](0);
                  reject(_context.t4);

                case 20:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[0, 17]]);
        }));

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
    });
  };

  for (var i = 0, len = manifest.length; i < len; i++) {
    _loop(i, len);
  }

  return promise;
}

function parallelLoad(manifest) {
  var promiseList = [];

  for (var i = 0, len = manifest.length; i < len; i++) {
    var item = manifest[i];

    if (typeof item.resolve === "function") {
      promiseList.push(item.resolve());
    } else {
      promiseList.push(item.resolve);
    }
  }

  return Promise.all(promiseList);
}

var LoadQueue_SymbolLoad = Symbol("Symbol.load");

var LoadQueue = /*#__PURE__*/function () {
  function LoadQueue(manifest, queue) {
    if (manifest === void 0) {
      manifest = [];
    }

    if (queue === void 0) {
      queue = true;
    }

    this.manifest = manifest; // [{ id, loader }]

    this.queue = queue;
    this.result = null;
    this.readyState = this.CREATED;
  }

  var _proto = LoadQueue.prototype;

  _proto.load = function load() {
    var _this = this;

    if (this[LoadQueue_SymbolLoad]) return this[LoadQueue_SymbolLoad];
    this.readyState = this.LOADING;
    this[LoadQueue_SymbolLoad] = new Promise(function (resolve, reject) {
      // 队列结果反馈
      (_this.queue ? queueLoad : parallelLoad)(_this.manifest).then(function (result) {
        _this.manifest.forEach(function (item, index) {
          if (!_this.result) _this.result = {};
          _this.result[item.id] = result[index];
        });

        _this.readyState = _this.COMPLETE;
        resolve(_this);
      }).catch(function (error) {
        _this.readyState = _this.ERROR;
        reject(error);
      });
    });
    return this[LoadQueue_SymbolLoad];
  };

  _proto.getItem = function getItem(id) {
    if (this.result) {
      return this.result[id];
    }

    return null;
  };

  _proto.getResult = function getResult() {
    return this.result;
  };

  return LoadQueue;
}();
/**
 * 添加ReadyState
 */


LoaderUtil.registerReadyState(LoadQueue, {
  CREATED: "created",
  LOADING: "loading",
  COMPLETE: "complete",
  ERROR: "error"
});
/* harmony default export */ var src_LoadQueue = (LoadQueue);
// CONCATENATED MODULE: ./src/index.js









var AMapJS = {
  version: version,
  Loader: loaders_Loader,
  LoaderUtil: LoaderUtil,
  ScriptLoader: loaders_ScriptLoader,
  AMapLoader: loaders_AMapLoader,
  AMapUILoader: loaders_AMapUILoader,
  LocaLoader: loaders_LocaLoader,
  SubwayLoader: loaders_SubwayLoader,
  LoadQueue: src_LoadQueue
};
/**
 * Export
 */


/* harmony default export */ var src = __webpack_exports__["default"] = (AMapJS);

/***/ })
/******/ ]);
});
//# sourceMappingURL=amap-js.js.map