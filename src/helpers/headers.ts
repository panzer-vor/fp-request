import { isPlainObject, higher } from './util'
import {
  toUpper,
  ifElse,
  keys,
  pipe,
  any,
  F,
  when,
  assoc,
  clone,
  equals,
  isEmpty,
  forEach,
  split
} from 'ramda'

const hasHeaderName = (normalizedName: string) =>
  ifElse(
    isEmpty,
    pipe(
      keys,
      any((key: string) => equals(toUpper(key), toUpper(normalizedName)))
    ),
    F
  )

export const processHeaders = (headers: any, data: any): any => {
  return when(
    higher(isPlainObject, data),
    ifElse(
      hasHeaderName('Content-Type'),
      clone,
      assoc('Content-Type', 'application/json;charset=utf-8')
    )
  )(headers)
}

export const parseHeaders = (headers: string): any => {
  const parsed = Object.create(null)
  if (!headers) {
    return parsed
  }
  pipe(
    split('\r\n'),
    forEach(line => {
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
  )(headers)
  return parsed
}
