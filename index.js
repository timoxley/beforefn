"use strict"

module.exports = beforeQueue

// inherit is pretty slow
module.exports.inherit = function beforeInherit(fn, beforeFn, overrideContext) {
  let before = beforeQueue(fn, beforeFn, overrideContext)
  before.__proto__ = fn
  before.prototype = fn.prototype
  return before
}

function beforeQueue(fn, beforeFn, overrideContext) {
  if (overrideContext) beforeFn.__context = overrideContext
  if (fn.__beforeFns) {
    fn.__beforeFns.push(beforeFn)
    return fn
  }

  before.__beforeFns = [beforeFn]

  function before(...args) {
    let self = this

    let fns = before.__beforeFns
    let fnArgs = args
    let fnContext = undefined

    // for loop because performance
    for (let i = 0; i < fns.length; i++) {
      let doBefore = fns[i]
      let args = fnArgs

      let context = self
      if (fnContext) context = fnContext
      else if (doBefore.__context) context = doBefore.__context
      let oldArgs = doBefore.args
      let oldContext = doBefore.context
      let oldFn = doBefore.fn
      // execution information is stored on doBefore function itself
      doBefore.args = args
      doBefore.fn = fn
      doBefore.context = context

      doBefore.call(doBefore.context, ...doBefore.args)

      // extract args/context which may have changed during execution of doBefore
      if (doBefore.args !== args) {
        fnArgs = doBefore.args
        if (!Array.isArray(fnArgs)) fnArgs = Array.from(fnArgs || [])
      }

      // if we have a new context
      fnContext = doBefore.context !== context ? doBefore.context : undefined

      // for good measure remove properties we added on doBefore
      doBefore.args = oldArgs
      doBefore.fn = oldFn
      doBefore.context = oldContext
    }

    let finalContext = fnContext ? fnContext : self
    return fn.call(finalContext, ...fnArgs)
  }
  return before
}
