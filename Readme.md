# beforefn

Execute a function before a function.

```js
var before = require('beforefn')

// replace user.save with a function that executes
// customBeheviour() before every .save  call
user.save = before(user.save, function() {
  customBehaviour()
})

// roughly equivalent to
var oldSave = user.oldSave
user.save = function() {
  customBehaviour()
  return oldSave.apply(this, arguments)
}
```

## Examples

```js

var user = {
  name: 'tim oxley',
  save: function() {
    // save routine
  },
  formatName: function() {
    this.name = this.name.toUpperCase()
  }
}

// always calls 'user.formatName' before 'user.save'
user.save = before(user.save, user.formatName)

console.log(user.name) // => tim oxley
user.save()
console.log(user.name) // => TIM OXLEY

```

### Modify arguments

```js
function add(a, b) {
  return a + b
}

var addByTen = before(add, function fn(a, b) {
  fn.args = fn.args.map(function(x) { return x * 10 })
})

console.log(add(1,2)) // => 3
console.log(addByTen(1,2)) // => 30

```

### Fix context

```js

var user = {
  name: 'hodor',
  speak: function() {
    return this.name
  }
}

user.speak = before(user.speak, function() {
  this.name = this.name[0].toUpperCase() + this.name.slice(1)
}, user)


console.log(user.speak()) // => 'Hodor'

// Reset name
user.name = 'hodor'

// Original function runs in call-time context
console.log(user.speak.call({name: 'bran'})) // => 'bran'

// But the before function runs in context set when defined
console.log(user.name) // => 'Hodor'

```

### Adjust Context

```js

var user = {
  name: 'hodor',
  speak: function() {
    return this.name
  }
}

user.speak = before(user.speak, function fn() {
  // make 'this' in all 'befores' effectively immutable
  fn.context = Object.create(this)
})

user.speak = before(user.speak, function fn() {
  this.name = this.name[0].toUpperCase() + this.name.slice(1)
}, user)


console.log(speak()) // => 'Hodor'

// the 'this' was altered when the function ran,
// but the original object is unmodified due to
// the Object.create(this)

console.log(user.name) // => 'hodor'

```

## Performance

As of `beforefn` 2.2.0, `beforefn` performs comparably to a manually replaced function. 

```
iterations 700000
...
366ms - manually replaced function
299ms - using before function
...
```

```js

test('manually replaced function', function() {
  var user = setup()
  var s = user.speak
  user.speak = function() {
    this.name = this.name.toUpperCase()
    return s.apply(this, arguments)
  }
  user.speak()
})

test('using before function', function() {
  var user = setup()
  function a() {
    this.name = this.name.toUpperCase()
  }
  user.speak = before(user.speak, a)
  user.speak()
})
```
Other runnable benchmarks are located in [bench/index](/bench/index).

## API Facts

* `beforefn` returns a new Function.
* `beforefn` ignores return value of before function
* Original arguments will be passed as the second argument to the before function.
* Original function will be passed as the third argument to the before function.
* Original function `this` context is maintained.
* Properties and prototype are inherited though function arity will not be preserved.

## See Also

* [timoxley/guardfn](http://github.com/timoxley/guardfn)
* [timoxley/afterfn](http://github.com/timoxley/afterfn)
* [timoxley/namefn](http://github.com/timoxley/namefn)

## License

MIT
