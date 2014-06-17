var before = require('../')

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
