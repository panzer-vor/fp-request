import { AxiosTransformer, AxiosRequestConfig } from '../types'

export const transformRequestCore = (config: AxiosRequestConfig): any => {
  let { transformRequest } = config
  if (!transformRequest) {
    return config
  }
  if (!Array.isArray(transformRequest)) {
    transformRequest = [transformRequest]
  }
  transformRequest.forEach(fn => {
    config = fn(config)
  })

  return config
}

export const transformResponseCore = (data: any, fns?: AxiosTransformer | AxiosTransformer[]) => {
  if (!fns) {
    return data
  }
  if (!Array.isArray(fns)) {
    fns = [fns]
  }
  fns.forEach(fn => {
    data = fn(data)
  })
  return data
}
