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

test('before can be passed context', function(t) {
  t.plan(2)
  var oldContext = {}
  var newContext = {}
  var fn = before(function() {
    t.equal(this, newContext)
  }, function() {
    t.equal(this, newContext)
  }, newContext)

  fn.call(oldContext)
})

test('before is passed args', function(t) {
  t.plan(2)
  before(function(a, b, c) {
    t.deepEqual([].slice.call(arguments), [1,2,3])
  }, function() {
    t.deepEqual([].slice.call(arguments), [1,2,3])
  })(1,2,3)
})

test('before is passed args on fn', function(t) {
  t.plan(2)
  before(function(a, b, c) {
    t.deepEqual([].slice.call(arguments), [1,2,3])
  }, function fn() {
    t.deepEqual(fn.args, [1,2,3])
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

test('before allows changing args via fn.args', function(t) {
  var result = before(function(a, b) {
    return a + b
  }, function fn(a, b) {
    fn.args = [a * 10, b * 10]
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

test('does not mess with prototype functions', function(t) {

  function User(name) {
    this.name = name
  }

  User.prototype.speak = function() {
    return this.name
  }

  var bill = new User('bill')
  var bob = new User('bob')

  var called = []

  bill.speak = before(bill.speak, function() {
    called.push('bill')
  })

  bob.speak = before(bob.speak, function() {
    called.push('bob')
  })

  t.equal(bill.speak(), 'bill')
  t.deepEqual(called, ['bill'])

  t.equal(bob.speak(), 'bob')
  t.deepEqual(called, ['bill', 'bob'])

  t.equal(bill.speak(), 'bill')
  t.deepEqual(called, ['bill', 'bob', 'bill'])

  t.equal(bob.speak(), 'bob')
  t.deepEqual(called, ['bill', 'bob', 'bill', 'bob'])

  t.end()
})
