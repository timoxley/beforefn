"use strict"

module.exports = beforeQueue

// inherit is pretty slow
module.exports.inherit = function beforeInherit(fn, beforeFn, overrideContext) {
  const before = beforeQueue(fn, beforeFn, overrideContext)
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
    const self = this

    const fns = before.__beforeFns
    const fnArgs = args
    let fnContext = undefined

    // for loop because performance
    for (let i = 0; i < fns.length; i++) {
      const doBefore = fns[i]
      const args = fnArgs

      const context = self
      if (fnContext) context = fnContext
      else if (doBefore.__context) context = doBefore.__context
      const oldArgs = doBefore.args
      const oldContext = doBefore.context
      const oldFn = doBefore.fn
      // execution information is stored on doBefore function itself
      doBefore.args = args
      doBefore.fn = fn
      doBefore.context = context

      doBefore.apply(doBefore.context, doBefore.args)

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

    const finalContext = fnContext ? fnContext : self
    return fn.apply(finalContext, fnArgs)
  }
  return before
}
