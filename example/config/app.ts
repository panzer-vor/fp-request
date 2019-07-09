import axios, { AxiosTransformer } from '../../src/index'

axios.defaults.headers.common['test2'] = 132

// axios({
//   url: '/config/post',
//   method: 'post',
//   data: {
//     a: 1,
//   },
//   headers: {
//     test: '321'
//   }
// }).then(res => console.log(res))

// axios({
//   transformRequest: [
//     data => data,
//     ...(axios.defaults.transformRequest as AxiosTransformer[]),
//   ],
//   transformResponse: [
//     ...(axios.defaults.transformResponse as AxiosTransformer[]),
//     data => {
//       data.b = 2 
//       return data
//     }
//   ],
//   url: '/config/post',
//   method: 'post',
//   data: {
//     a: 1,
//   },
//   headers: {
//     test: '321'
//   }
// }).then(res => console.log(res))

axios.post(
  '/config/post',
  {
    prop: 'value'
  },
  {
    headers: {
      'content-type': 'application/json'
    }
  }
)

