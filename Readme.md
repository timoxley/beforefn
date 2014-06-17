# beforefn

#### Execute a function before a function.

## Example

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

var addByTen = before(add, function fn(a,b) {
  fn.args = [a * 10, b * 10]
})

console.log(add(1,2)) // => 3
console.log(addByTen(1,2)) // => 30

```

## API Facts

* `beforefn` returns a new Function.
* `beforefn` ignores return value of before function
* Original arguments will be passed as the second argument to the before function.
* Original function will be passed as the third argument to the before function.
* Original function `this` context is maintained.

## License

MIT
