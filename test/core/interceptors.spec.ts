import axios, { AxiosRequestConfig, AxiosResponse, AxiosTransformer } from '../../src/index'
import { getAjaxRequest } from '../helpers'

describe('instance', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should have response interceptors', done => {
    const instance = axios.create()

    instance.interceptors.response.use((response: AxiosResponse) => {
      response.data.a = 1
      return response
    })

    let response: AxiosResponse
    instance.get('/foo').then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: '{"b": 2}'
      })
    })

    setTimeout(() => {
      expect(response.data).toEqual({
        a: 1,
        b: 2
      })
      done()
    }, 100)
  })

  test('should interceptors eject', done => {
    const instance = axios.create()

    const id = instance.interceptors.response.use((response: AxiosResponse) => {
      response.data.a = 1
      return response
    })

    instance.interceptors.response.eject(id)

    let response: AxiosResponse
    instance.get('/foo').then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: '{"b": 2}'
      })
    })

    setTimeout(() => {
      expect(response.data.a).toBeUndefined()
      done()
    }, 100)
  })

  test('should not interceptors eject if id error', done => {
    const instance = axios.create()

    const id = instance.interceptors.response.use((response: AxiosResponse) => {
      response.data.a = 1
      return response
    })

    instance.interceptors.response.eject(id + 1)

    let response: AxiosResponse
    instance.get('/foo').then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: '{"b": 2}'
      })
    })

    setTimeout(() => {
      expect(response.data.a).toBe(1)
      done()
    }, 100)
  })
})
