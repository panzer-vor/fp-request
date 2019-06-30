import { isPlainObject } from './util'
import { tryCatch, when } from 'ramda'

const isString = (data: any) => typeof data === 'string'

export const transformRequest = (data: any): any => {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

export const transformResponse = (data: any): any => {
  return when(isString, tryCatch(d => JSON.parse(d), () => null))(data)
}
