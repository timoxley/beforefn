var before = require('../')
var pkg = require('../package.json')

function test(name, fn) {
  fn.testName = name
  test.tests = test.tests || []
  test.tests.push(fn)
  run(test)
  return fn
}

test.iterations = 700000

function run(test) {
  if (run.called) return
  run.called = true
  setTimeout(function() {
    test.tests.forEach(function(fn) {
      console.error('running %s', fn.testName)
      var start = Date.now()
      for (var i = 0; i < test.iterations; i++) {
        fn()
      }
      var end = Date.now()
      fn.time = end - start
    })
    console.info('\n### '+pkg.version+' Results ###')
    console.info('')
    console.info('iterations: ', test.iterations)
    console.info('')
    test.tests.forEach(function(test) {
      console.info('* %dms - %s', test.time, test.testName)
    })
  })
}

function setup() {
  return {
    name: 'tim oxley',
    speak: function(word) {
      return word + ' ' + this.name
    }
  }
}

test('calling vanilla function', function() {
  var user = setup()
  user.speak()
})

test('inlined code', function() {
  var user = setup()
  user.speak = function(word) {
    this.name = this.name.toUpperCase()
    return word + ' ' + this.name
  }
  user.speak('Hello')
})

test('inlined functions', function() {
  var user = setup()
  function a() {
    this.name = this.name.toUpperCase()
  }
  user.speak = function(word) {
    a.apply(this, arguments)
    return word + ' ' + this.name
  }
  user.speak()
})

test('replaced function', function() {
  var user = setup()
  var s = user.speak
  user.speak = function() {
    this.name = this.name.toUpperCase()
    return s.apply(this, arguments)
  }
  user.speak()
})

test('before function noop', function() {
  var user = setup()
  user.speak = before(user.speak, function() {})
  user.speak()
})

test('before function', function() {
  var user = setup()
  function a() {
    this.name = this.name.toUpperCase()
  }
  user.speak = before(user.speak, a)
  user.speak()
})

test('before function with context', function() {
  var user = setup()

  function a() {
    this.name = this.name.toUpperCase()
  }

  user.speak = before(user.speak, a, user)
  user.speak()
})

test('before function changing context', function() {
  var user = setup()
  var newContext = {name: 'bob'}
  user.speak = before(user.speak, function fn() {
    this.name = this.name.toUpperCase()
    fn.context = newContext
  })
  user.speak()
})

test('before function changing args', function() {
  var user = setup()

  user.speak = before(user.speak, function fn() {
    this.name = this.name.toUpperCase()
    fn.args[0] = 'Sup'
  }, user)
  user.speak()
})

var MULTIPLE = 10

test('multiple ('+MULTIPLE+') inlined operations', function() {
  var user = setup()
  function a() {
    this.name = this.name.toUpperCase()
  }
  var s = user.speak
  user.speak = function() {
    for (var i = 0; i < MULTIPLE; i++) {
      a.apply(this, arguments)
    }
    return s.apply(this, arguments)
  }
  user.speak()
})

test('multiple ('+MULTIPLE+') regular function replacements', function() {
  var user = setup()
  for (var i = 0; i < MULTIPLE; i++) {
    (function() {
      var s = user.speak
      user.speak = function() {
        this.name = this.name.toUpperCase()
        return s.apply(this, arguments)
      }
    })()
  }
  user.speak()
})

test('multiple ('+MULTIPLE+') befores', function() {
  var user = setup()
  for (var i = 0; i < MULTIPLE; i++) {
    (function() {
      var s = user.speak
      user.speak = before(user.speak, function() {
        this.name = this.name.toUpperCase()
      })
    })()
  }
  user.speak()
})

test('multiple ('+MULTIPLE+') noop befores', function() {
  var user = setup()
  for (var i = 0; i < MULTIPLE; i++) {
    (function() {
      user.speak = before(user.speak, function() {
      })
    })()
  }
  user.speak()
})
