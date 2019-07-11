import axios from '../src/index'
import { getAjaxRequest } from './helpers'

describe('progress', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should accept HTTP Basic auth with username/password', () => {
    axios('/foo', { 
      auth: {
        username: 'ABC',
        password: 'EFG'
      }
    })

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders['Authorization']).toBe('Basic QUJDIDogRUZH')
    })
  })

  test('should fail to encode HTTP Basic auth credentials with non-Latin1 characters', () => {
    return axios('/foo', { 
      auth: {
        username: 'ABC啊',
        password: 'EFG'
      }
    }).then(() => {
      throw new Error(
        'should not successed to make a http basic auth'
      )
    }).catch(error => {
      expect(/character/i.test(error.message)).toBeTruthy()
    })
  })
})