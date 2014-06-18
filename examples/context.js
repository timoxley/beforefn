var before = require('../')

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
