import axios, { AxiosResponse, AxiosError, Canceler } from '../src/index'
import { getAjaxRequest } from './helpers'
import Cancel from '../src/cancel/Cancel'

describe('request', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  const CancelToken = axios.CancelToken

  test('should request be canceled with source.cancel', done => {
    const source = CancelToken.source()
    let err: AxiosError
    axios('/foo', {
      cancelToken: source.token
    }).catch(e => {
      if (axios.isCancel(e)) {
        err = e
      }
    })

    getAjaxRequest().then(() => {
      source.cancel('Operation canceled by the user')
      setTimeout(() => {
        expect(err.message).toBe('Operation canceled by the user')
        done()
      }, 100)
    })
  })

  test('should ignore reason2', done => {
    let cancel: Canceler
    let err: AxiosError
    axios('/foo', {
      cancelToken: new CancelToken(c => (cancel = c))
    }).catch(e => (err = e))

    getAjaxRequest().then(() => {
      cancel('Operation canceled by the user')
      cancel('Operation canceled by the user2')
      setTimeout(() => {
        expect(err.message).toBe('Operation canceled by the user')
        done()
      }, 100)
    })
  })

  test('should throw reason', done => {
    let cancel: Canceler
    let err: AxiosError
    const cancelToken = new CancelToken(c => (cancel = c))
    cancelToken.reason = new Cancel('here is a reason')
    const instance = axios.create({
      cancelToken
    })
    instance.get('/foo').catch(e => (err = e))

    getAjaxRequest().then(() => {
      cancel('Operation canceled by the user')
      setTimeout(() => {
        expect(err.message).toBe('here is a reason')
        done()
      }, 100)
    })
  })
})
