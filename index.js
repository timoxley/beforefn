"use strict"

module.exports = beforeQueue
var slice = require('sliced')

function beforeQueue(fn, beforeFn) {
  if (fn.__beforeFns) {
    fn.__beforeFns.push(beforeFn)
    return fn
  }

  var fns = before.__beforeFns = before.__beforeFns || []
  fns.push(beforeFn)

  function before() {
    var context = this
    var args = fns.reduce(function(args, doBefore) {
      doBefore.args = slice(args)
      doBefore.fn = fn
      doBefore.apply(context, doBefore.args)
      var newArgs = doBefore.args
      delete doBefore.args
      delete doBefore.fn
      return newArgs
    }, arguments)
    return fn.apply(this, args)
  }
  return before
}
