var before = require('../')

var user = {
  name: 'hodor',
  speak: function() {
    return this.name
  }
}

var speak = before(user.speak, function() {
  this.name = this.name[0].toUpperCase() + this.name.slice(1)
}, user)


console.log(speak()) // => 'Hodor'
console.log(speak.call({name: 'bran'})) // => 'Hodor'
