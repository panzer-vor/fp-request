const R = require('ramda')

const val = a => a
const value = R.partial(val)
console.log(val)
console.log(val, [1])