import { mergeDeepRight } from 'ramda'
import { AxiosRequestConfig } from "../types";
import { isPlainObject } from "../helpers/util";
const strats = Object.create(null)

const defaultStrat = (val1: any, val2: any): any => {
  return typeof val2 !== 'undefined' ? val2 : val1
}

const deepMergeStrat = (val1: any, val2 = {}): any => {
  if (isPlainObject(val2)) {
    return mergeDeepRight(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return mergeDeepRight(val1, val2)
  } else if (typeof val1 !== 'undefined') {
    return val1
  }
}


const fromVal2Strat = (val1: any, val2: any): any => {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

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
  
  const mergeField = (key: string): void => {
    const strat = strats[key] || defaultStrat
    config[key] = strat(config1[key], config2![key])
  }
  

  const config = Object.create(null)

  for (let key in config2) {
    mergeField(key)
  }

  for (let key in config1) {
    if(!config2[key]) {
      mergeField(key)
    }
  }
  
  return config
}