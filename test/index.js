"use strict"

var test = require('tape')
var before = require('../')

test('before executes before', function(t) {
  var called = 0
  before(function() {
    t.equal(called, 1)
    t.end()
  }, function() {
    called++
  })()
})

test('before maintains context', function(t) {
  var context = {called: 0}
  before(function() {
    t.equal(this.called, 1)
    t.end()
  }, function() {
    this.called++
    t.equal(this, context)
  }).apply(context)
})

test('before is passed args', function(t) {
  t.plan(2)
  before(function(a, b, c) {
    t.deepEqual([].slice.call(arguments), [1,2,3])
  }, function() {
    t.deepEqual([].slice.call(arguments), [1,2,3])
  })(1,2,3)
})

test('returns correct value', function(t) {
  var result = before(function(a, b) {
    return a + b
  }, function() {
    return 100 // ignored
  })
  t.equal(result(2,3), 5)
  t.end()
})

test('before.args allows changing args', function(t) {
  var result = before.args(function(a, b) {
    return a + b
  }, function(a, b) {
    return [a * 10, b * 10]
  })
  t.equal(result(2,3), 50)
  t.end()
})

test('chain executes in order of definition', function(t) {
  t.plan(3)
  var called = []
  var result = before(function(a, b) {
    return a + b
  }, function() {
    t.deepEqual(called, [])
    called.push('first')
  })

  result = before(result, function() {
    t.deepEqual(called, ['first'])
  })

  t.equal(result(2,3), 5)
  t.end()
})
