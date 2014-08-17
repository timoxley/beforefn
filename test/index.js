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
    t.equal(this, oldContext)
  }, function() {
    t.equal(this, newContext)
  }, newContext)

  fn.call(oldContext)
})

test('each before maintains its own context', function(t) {
  t.plan(5)
  var contextA = {name: 'a'}
  var contextB = {name: 'b'}
  var contextC = {name: 'c'}
  var contextD = {name: 'd'}

  function op() {
    t.equal(this, contextC)
  }

  var A = before(op, function() {
    t.equal(this, contextA)
  }, contextA)

  var B = before(A, function() {
    t.equal(this, contextB)
  }, contextB)

  var D = before(op, function() {
    t.equal(this, contextD)
  }, contextD)

  B.call(contextC)
  D.call(contextC)
})

test('context can be adjusted', function(t) {
  t.plan(2)
  var oldContext = {}
  var newContext = {}
  var fn = before(function() {
    t.equal(this, newContext)
  }, function fn() {
    t.equal(this, oldContext)
    fn.context = newContext
  })

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

test('function keys are copied across', function(t) {
  function Thing() {}
  Thing.copied = true
  var anotherThing = {}
  Thing.prototype = anotherThing

  var NewThing = before(Thing, function() {})
  t.ok(NewThing.copied)
  t.equal(NewThing.prototype, anotherThing)
  t.end()
})

test('function keys are available on fn.fn', function(t) {
  function Thing() {}
  Thing.copied = true
  var anotherThing = {}
  Thing.prototype = anotherThing

  before(Thing, function fn() {
    t.ok(fn.fn.copied)
    t.equal(fn.fn.prototype, anotherThing)
    t.end()
  })()
})

test('recursive calls work correctly', function(t) {
  t.plan(2)
  var count = 0
  var addOne = before(function(arg) {
    return arg
  }, function fn(arg) {
    fn.args = [arg+1]
    if (count++ < 1) t.equal(addOne(3), 4)
  })
  t.equal(addOne(0), 1)
})

test('no error if args set to weird value', function(t) {
  before(function() {
    t.equal(arguments.length, 0)
  }, function fn() {
    fn.args = null
  })()
  before(function() {
    t.equal(arguments.length, 0)
  }, function fn() {
    fn.args = {}
  })()
  before(function() {
    t.equal(arguments.length, 0)
  }, function fn() {
    fn.args = false
  })()
  before(function() {
    t.equal(arguments.length, 0)
  }, function fn() {
    fn.args = true
  })()
  before(function() {
    // i guess this is sane behaviour?
    t.deepEqual(arguments.length, 3)
    t.equal(arguments[0], undefined)
    t.equal(arguments[1], undefined)
    t.equal(arguments[2], undefined)
  }, function fn() {
    fn.args = {length: 3}
  })()
  t.end()
})
