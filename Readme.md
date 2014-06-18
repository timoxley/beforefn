# beforefn

#### Execute a function before a function.

## Examples

```js
var before = require('beforefn')

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

## API Facts

* `beforefn` returns a new Function.
* `beforefn` ignores return value of before function
* Original arguments will be passed as the second argument to the before function.
* Original function will be passed as the third argument to the before function.
* Original function `this` context is maintained.

## See Also

* [timoxley/guardfn](http://github.com/timoxley/guardfn)
* [timoxley/afterfn](http://github.com/timoxley/afterfn)

## License

MIT
