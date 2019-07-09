import * as R from 'ramda'

interface URLOrigin {
  protocol: string
  host: string
}

const isURLSearchParams = (val: any): val is URLSearchParams => {
  return typeof val !== 'undefined' && val instanceof URLSearchParams
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

const strAdd = R.curry((a, joinStr, b) => b + joinStr + a)

export const buildURL = (
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string => {
  if (!params) {
    return url
  }

  let serializedParams

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    serializedParams = R.pipe(
      Object.entries,
      R.map(
        ([key, value]) =>
          `${encode(key)}=${encode(typeof value === 'string' ? value : JSON.stringify(value))}`
      ),
      R.join('&')
    )(params)
  }

  return R.when(
    str => !!str,
    R.pipe(
      hashCut(url),
      R.ifElse(
        url => url.indexOf('?') !== -1,
        strAdd(serializedParams, ''),
        strAdd(serializedParams, '?')
      )
    )
  )(serializedParams)
}

const urlParsingNode = document.createElement('a')
const resolveURL = (url: string): URLOrigin => {
  urlParsingNode.setAttribute('href', url)

  const { protocol, host } = urlParsingNode

  return {
    protocol,
    host
  }
}
const currentOrigin = resolveURL(window.location.href)

export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return (
    parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
  )
}

export function isAbsoluteURL(url: string): boolean {
  return /(^[a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relatiiveURL?: string): string {
  return relatiiveURL
    ? `${baseURL.replace(/\/+$/, '')}/${relatiiveURL.replace(/^\/+/, '')}`
    : baseURL
}
