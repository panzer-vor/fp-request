import { parseHeaders, flattenHeaders } from '../../src/helpers/headers'

describe('helpers: headers', () => {
  describe('parseHeaders', () => {
    test('if no params should return {}', () => {
      expect(parseHeaders('')).toEqual({})
    })

    test('trim header value', () => {
      const headers = 'a:'
      expect(parseHeaders(headers)).toEqual({ a: '' })
    })
  })

  describe('flattenHeaders', () => {
    test('if no headers should return config', () => {
      const config = {
        a: 1
      }
      expect(flattenHeaders(config)).toEqual(config)
    })
  })
})
