import { pipe, map, join, curry, when, ifElse } from 'ramda'
import { isURLSearchParams } from './util';

interface URLOrigin {
  protocol: string
  host: string
}

const encode = (val: string): string => {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

const hashCut = (str: string) => () => str.replace(/#.*/, '')

const strAdd = curry((a, joinStr, b) => b + joinStr + a)

export function buildURL(url: string, params?: any, paramsSerializer?: (params: any) => string): string {
  if (!params) {
    return url
  }

  let serializedParams

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    serializedParams = pipe(
      Object.entries,
      map(
        ([key, value]) =>
          `${encode(key)}=${encode(typeof value === 'string' ? value : JSON.stringify(value))}`
      ),
      join('&')
    )(params)
  }

  return when(
    str => !!str,
    pipe(
      hashCut(url),
      ifElse(
        url => url.indexOf('?') !== -1,
        strAdd(serializedParams, ''),
        strAdd(serializedParams, '?')
      )
    )
  )(serializedParams)
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)
function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)

  const { protocol, host } = urlParsingNode

  return {
    protocol, 
    host,
  }
}

export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return (parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host)
}

export function isFormData(val: any): val is FormData {
  return typeof val !== 'undefined' && val instanceof FormData
}

export function isAbsoluteURL(url: string): boolean {
  return /(^[a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relatiiveURL?: string): string {
  return relatiiveURL ? `${baseURL.replace(/\/+$/, '')}/${relatiiveURL.replace(/^\/+/, '')}` : baseURL
}