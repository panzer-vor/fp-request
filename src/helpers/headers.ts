import { isPlainObject, higher } from './util'
import { toUpper, ifElse, isEmpty, keys, pipe, any, F, when, assoc, clone } from 'ramda'

const upperEqual = (a: string, b: string): boolean => toUpper(a) === toUpper(b)

const hasHeaderName = (normalizedName: string) => ifElse(
  isEmpty,
  pipe(
    keys,
    any(key => upperEqual(key, normalizedName)),
  ),
  F,
)

export const processHeaders = (headers: any, data: any): any => {
  return when(
    higher(isPlainObject, data),
    ifElse(
      hasHeaderName('Content-Type'),
      clone,
      assoc('Content-Type', 'application/json;charset=utf-8'),
    )
  )(headers)
}

export const parseHeaders = (headers: string): any => {
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }
  headers.split('\r\n').forEach(line => {
    let [key, val] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    if (val) {
      val = val.trim()
    }
    parsed[key] = val
  })
  return parsed
}