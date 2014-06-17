"use strict"

module.exports = beforeQueue

function beforeQueue(fn, beforeFn) {
  if (fn.__beforeFns) {
    fn.__beforeFns.push(beforeFn)
    return fn
  }

  var fns = before.__beforeFns = before.__beforeFns || []
  fn.__beforeFns = fns
  fns.push(beforeFn)

  function before() {
    var context = this
    var args = fns.reduce(function(args, doBefore) {
      var newArgs = doBefore.apply(context, args)
      if (!doBefore.__args) return args
      return newArgs
    }, arguments)
    return fn.apply(this, args)
  }
  return before
}

beforeQueue.args = function beforeQueueArgs(fn, beforeFn) {
  beforeFn.__args = true
  return beforeQueue(fn, beforeFn)
}
