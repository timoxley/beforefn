"use strict"

var slice = require('sliced')

module.exports = beforeQueue

function beforeQueue(fn, beforeFn, overrideContext) {
  if (overrideContext) beforeFn.__context = overrideContext
  if (fn.__beforeFns) {
    fn.__beforeFns.push(beforeFn)
    return fn
  }

  before.__beforeFns = [beforeFn]
  before.__proto__ = fn
  before.prototype = fn.prototype
  function before() {
    var self = this

    var fns = before.__beforeFns
    var fnArgs = slice(arguments)
    var fnContext = undefined

    // for loop because performance
    for (var i = 0; i < fns.length; i++) {
      var doBefore = fns[i]
      var args = fnArgs

      var context = self
      if (fnContext) context = fnContext
      else if (doBefore.__context) context = doBefore.__context
      var oldArgs = doBefore.args
      var oldContext = doBefore.context
      var oldFn = doBefore.fn
      // execution information is stored on doBefore function itself
      doBefore.args = args
      doBefore.fn = fn
      doBefore.context = context

      doBefore.apply(doBefore.context, doBefore.args)

      // extract args/context which may have changed during execution of doBefore
      if (doBefore.args !== args) {
        fnArgs = doBefore.args
        if (Array.isArray(fnArgs)) {}
        else fnArgs = slice(fnArgs || [])
      }

      // if we have a new context
      fnContext = (doBefore.context !== context) ? doBefore.context : undefined

      // for good measure remove properties we added on doBefore
      doBefore.args = oldArgs
      doBefore.fn = oldFn
      doBefore.context = oldContext
    }

    var finalContext = fnContext ? fnContext : self
    return fn.apply(finalContext, fnArgs)
  }
  return before
}
