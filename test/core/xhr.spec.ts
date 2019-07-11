import axios from '../../src/index'
import { getAjaxRequest } from '../helpers'

describe('core: xhr', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should content-type be deleted', () => {
    const formData = new FormData()
    formData.append('name', 'abc')
    axios.post('/foo', formData)

    return getAjaxRequest().then((request) => {
      expect(request.requestHeaders['Content-Type']).toBeUndefined()
    })
  })

  test('should use default xsrf defense', () => {
    const instance = axios.create({
      xsrfCookieName: 'CUSTOM-XSRF-TOKEN',
      xsrfHeaderName: 'X-CUSTOM-XSRF-TOKEN',
    })
    document.cookie = instance.defaults.xsrfCookieName + '=foobarbaz'

    instance.get('/foo')

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders[instance.defaults.xsrfHeaderName!]).toBe('foobarbaz')
    })
  })
})