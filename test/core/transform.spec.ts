import { transformRequestCore, transformResponseCore } from '../../src/core/transfrom'
import { AxiosRequestConfig } from '../../src'

describe('core: transform', () => {
  describe('transformRequestCore', () => {
    test('if no transformRequest should return config', () => {
      const config: AxiosRequestConfig = {
        method: 'post'
      }
      expect(transformRequestCore(config)).toEqual(config)
    })

    test('if has transformRequest should edit config', () => {
      const transformRequest = (config: AxiosRequestConfig) => ({
        ...config,
        method: 'get'
      })
      const config: AxiosRequestConfig = {
        method: 'post',
        transformRequest
      }
      const newConfig = transformRequestCore(config)
      expect(newConfig.method).toBe('get')
    })
  })

  describe('transformResponseCore', () => {
    test('if has no transformResponse should return data', () => {
      const data = {
        method: 'post'
      }
      expect(transformResponseCore(data)).toEqual(data)
    })

    test('if has transformResponse should edit data', () => {
      const transformResponse = (data: any) => ({
        ...data,
        a: 1
      })
      const data = {
        b: 2
      }
      const newData = transformResponseCore(data, transformResponse)
      expect(newData.a).toBe(1)
      expect(newData.b).toBe(2)
    })
  })
})
