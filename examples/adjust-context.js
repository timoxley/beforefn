var before = require('../')

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


console.log(user.speak()) // => 'Hodor'

// user.name should not be altered
console.log(user.name) // => 'hodor'
