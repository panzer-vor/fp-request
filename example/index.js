const { axios } = require('../dist/ts-axios.umd')

console.log(axios({
    url: '111',
    params: {
        name: 'xyk',
        age: 18
    }
}))