"use strict";

module.exports = beforeQueue;

// inherit is pretty slow
module.exports.inherit = function beforeInherit(fn, beforeFn, overrideContext) {
  var before = beforeQueue(fn, beforeFn, overrideContext);
  before.__proto__ = fn;
  before.prototype = fn.prototype;
  return before;
};

function beforeQueue(fn, beforeFn, overrideContext) {
  if (overrideContext) beforeFn.__context = overrideContext;
  if (fn.__beforeFns) {
    fn.__beforeFns.push(beforeFn);
    return fn;
  }

  before.__beforeFns = [beforeFn];

  function before() {
    var self = this;

    var fns = before.__beforeFns;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var fnArgs = args;
    var fnContext = undefined;

    // for loop because performance
    for (var i = 0; i < fns.length; i++) {
      var doBefore = fns[i];
      var _args = fnArgs;

      var context = self;
      if (fnContext) context = fnContext;else if (doBefore.__context) context = doBefore.__context;
      var oldArgs = doBefore.args;
      var oldContext = doBefore.context;
      var oldFn = doBefore.fn;
      // execution information is stored on doBefore function itself
      doBefore.args = _args;
      doBefore.fn = fn;
      doBefore.context = context;

      doBefore.apply(doBefore.context, doBefore.args);

      // extract args/context which may have changed during execution of doBefore
      if (doBefore.args !== _args) {
        fnArgs = doBefore.args;
        if (!Array.isArray(fnArgs)) fnArgs = Array.from(fnArgs || []);
      }

      // if we have a new context
      fnContext = doBefore.context !== context ? doBefore.context : undefined;

      // for good measure remove properties we added on doBefore
      doBefore.args = oldArgs;
      doBefore.fn = oldFn;
      doBefore.context = oldContext;
    }

    var finalContext = fnContext ? fnContext : self;
    return fn.apply(finalContext, fnArgs);
  }
  return before;
}

