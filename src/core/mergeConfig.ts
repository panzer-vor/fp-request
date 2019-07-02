import {
  mergeDeepRight,
  mergeDeepLeft,
  cond,
  T,
  identity,
  pipe,
  curry,
  map,
  keys,
  flatten
} from 'ramda'
import { AxiosRequestConfig } from '../types'
import {
  isPlainObject,
  NotEqualsUndefined,
  includesKey,
  composePipe,
  flatObject
} from '../helpers/util'

const strats = Object.create(null)

const defaultStrat = curry(
  (config1: any, config2: any, key: string): any => {
    const val1 = config1[key]
    const val2 = config2[key]
    return typeof val2 !== 'undefined' ? val2 : val1
  }
)

const deepMergeStrat = curry(
  (config1: any, config2: any, key: string): any => {
    const val1 = config1[key]
    const val2 = config2[key] || {}
    return cond([
      [() => isPlainObject(val2), () => mergeDeepRight(val1, val2)],
      [isPlainObject, mergeDeepLeft(val2)],
      [NotEqualsUndefined, identity],
      [T, () => identity(val2)]
    ])(val1)
  }
)

const fromVal2Strat = curry(
  (config2: any, key: string): any => {
    return cond([[NotEqualsUndefined, identity]])(config2[key])
  }
)

const stratsKeysDeepMerge = ['headers']

stratsKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

const stratKeysFromVal2 = ['url', 'params', 'data']

stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

export default (config1: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig => {
  if (!config2) {
    config2 = {}
  }

  const mergeField = (key: string, config1: any, config2: any): any => {
    return cond([
      [includesKey(['url', 'params', 'data']), fromVal2Strat(config2)],
      [includesKey(['headers']), deepMergeStrat(config1, config2)],
      [T, defaultStrat(config1, config2)]
    ])(key)
  }

  const pipe1 = pipe(
    keys,
    map(key => mergeField(key, config1, config2))
  )

  const pipe2 = pipe(
    Object.entries,
    map(([key, value]) => (!value ? mergeField(key, config1, config2) : null))
  )

  return pipe(
    composePipe([pipe1, pipe2]),
    flatten,
    flatObject
  )([config2, config1])
}
