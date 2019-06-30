import axios from '../../src/index'

// axios({
//   method: 'get',
//   url: '/error/get1',
// })
// .then(res => console.log(res))
// .catch(e => {
//   console.log(e)
// })

axios({
  method: 'get',
  url: '/error/get',
  timeout: 3000,
})
.then(res => console.log(res))
.catch(e => {
  console.log('timeout', e)
})

axios({
  method: 'get',
  url: '/error/timeout',
  timeout: 3000
})
.then(res => console.log(res))
.catch(e => {
  console.log(e.message)
})
