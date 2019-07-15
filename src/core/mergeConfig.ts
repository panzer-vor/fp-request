import * as R from 'ramda'
import { AxiosRequestConfig } from '../types'
import {
  isPlainObject,
  NotEqualsUndefined,
  includesKey,
  composePipe,
  flatObject
} from '../helpers/util'

const defaultStrat = R.curry(
  (config1: any, config2: any, key: string): any => {
    const val1 = config1[key]
    const val2 = config2[key]
    console.log(typeof val2 !== 'undefined' ? val2 : val1)
    return typeof val2 !== 'undefined' ? val2 : val1
  }
)

const deepMergeStrat = R.curry(
  (config1: any, config2: any, key: string): any => {
    const val1 = config1[key]
    const val2 = config2[key] || {}
    return R.cond([
      [() => isPlainObject(val2), () => R.mergeDeepRight(val1, val2)],
      [isPlainObject, R.mergeDeepLeft(val2)],
      [NotEqualsUndefined, R.identity]
    ])(val1)
  }
)

const fromVal2Strat = R.curry(
  (config2: any, key: string): any => {
    return R.cond([[NotEqualsUndefined, R.identity]])(config2[key])
  }
)

export default (config1: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig => {
  if (!config2) {
    config2 = {}
  }

  const mergeField = (key: string, config1: any, config2: any): any => {
    return {
      [key]: R.cond([
        [includesKey(['url', 'params', 'data']), fromVal2Strat(config2)],
        [includesKey(['headers', 'auth']), deepMergeStrat(config1, config2)],
        [R.T, defaultStrat(config1, config2)]
      ])(key)
    }
  }
  const pipe1 = R.pipe(
    R.keys,
    R.map(key => mergeField(key, config1, config2))
  )

  const pipe2 = R.pipe(
    Object.entries,
    R.map(([key, value]) =>
      typeof value !== 'undefined' ? mergeField(key, config1, config2) : null
    )
  )

  return R.pipe(
    composePipe([pipe1, pipe2]),
    R.flatten,
    flatObject
  )([config2, config1])
}
