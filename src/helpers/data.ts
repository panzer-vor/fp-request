import { isPlainObject } from './util'
import { tryCatch, type, when } from 'ramda'

const isString = (data: any) => typeof data === 'string'

export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

export function transformResponse(data: any): any {
  type('s')
  return when(isString, tryCatch(d => JSON.parse(d), () => null))(data)
}
