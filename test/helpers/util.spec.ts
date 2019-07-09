import {
  isPlainObject,
  isFormData,
  higher,
  extend,
  NotEqualsUndefined,
  includesKey,
  composePipe,
  flatObject
} from '../../src/helpers/util'
import * as R from 'ramda'

describe('helpers: util', () => {
  describe('isXX', () => {
    test('should validate PlainObject', () => {
      expect(isPlainObject({})).toBeTruthy()
      expect(isPlainObject(new Date())).toBeFalsy()
    })

    test('should validate formData', () => {
      const a = new FormData()
      a.append('bar', 'foo')
      expect(isFormData(a)).toBeTruthy()
      expect(isFormData({})).toBeFalsy()
    })

    test('should validate not undefined', () => {
      expect(NotEqualsUndefined(undefined)).toBeFalsy()
      expect(NotEqualsUndefined('not undefined')).toBeTruthy()
    })
  })

  describe('higher', () => {
    test('should be return a function value equal to the function directly executing and the returned function ignores the argument', () => {
      const a = higher(R.identity, 1)
      expect(a(1111)).toBe(1)
    })
  })

  describe('composePipe', () => {
    test('receive a function array corresponding to an array of parameters and output the result array', () => {
      const result = composePipe([R.identity, R.identity])([1, 2])
      expect(result).toStrictEqual([1, 2])
    })
  })

  describe('includesKey', () => {
    test('array should include keys', () => {
      const arr = ['a', 'b', 'c']
      expect(includesKey(arr)('a')).toBeTruthy()
      expect(includesKey(arr)('d')).toBeFalsy()
    })
  })

  describe('flatObject', () => {
    const arr = [{ a: 1 }, { b: 2 }, { c: 3 }, { d: { f: 4 } }]

    test('object array should be flatten', () => {
      expect(flatObject(arr)).toEqual({ a: 1, b: 2, c: 3, d: { f: 4 } })
    })

    test('object array has null', () => {
      const newArr = [...arr, null]
      expect(flatObject(newArr)).toEqual({ a: 1, b: 2, c: 3, d: { f: 4 } })
    })
  })

  describe('extend', () => {
    test('should be mutable', () => {
      const a = Object.create(null)
      const b = { foo: 123 }
      extend(a, b)
      expect(a.foo).toBe(123)
    })

    test('should extend properties', () => {
      const a = { foo: 123, bar: 456 }
      const b = { bar: 789 }
      const c = extend(a, b)

      expect(c.foo).toBe(123)
      expect(c.bar).toBe(789)
    })
  })
})
