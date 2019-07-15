import { isPlainObject } from './util'
import { tryCatch, when } from 'ramda'

const isString = (data: any) => typeof data === 'string'

export const transformRequest = (data: any): any =>
  isPlainObject(data) ? JSON.stringify(data) : data

export const transformResponse = (data: any): any =>
  when(isString, tryCatch(d => JSON.parse(d), () => data))(data)
