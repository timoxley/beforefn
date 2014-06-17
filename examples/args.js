var before = require('../')

function add(a, b) {
  return a + b
}

var addByTen = before(add, function fn(a,b) {
  fn.args = [a * 10, b * 10]
})

console.log(add(1,2)) // => 3
console.log(addByTen(1,2)) // => 30
