import { buildURL } from '../../src/helpers/url'
import * as R from 'ramda'

describe('helpers: url', () => {
  describe('buildURL', () => {
    const url = 'https://www.abc.com/'
    test('if without params, return origin url', () => {
      expect(buildURL(url)).toBe(url)
    })

    test('paramsSerializer params', () => {
      const params = 'data=1'
      const paramsAdd = ' is edited'
      const paramsSerializer = (params: any) => params + paramsAdd
      expect(buildURL(url, params, paramsSerializer)).toBe(`${url}?${params}${paramsAdd}`)
    })

    test('params is URLSearchParams', () => {
      const params = 'a=1&b=2'
      expect(buildURL(url, new URLSearchParams(params))).toBe(`${url}?${params}`)
    })

    test('params is Object', () => {
      const params = {
        a: 1,
        b: 2
      }
      expect(buildURL(url, params)).toBe(`${url}?a=1&b=2`)
    })

    test('URL with ?', () => {
      const newURL = url + '?'
      const params = 'a=1'
      expect(buildURL(newURL, params)).toBe(`${newURL}${params}`)
    })
  })
})
