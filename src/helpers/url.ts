import { pipe, map, join, curry, when, ifElse } from 'ramda'

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

export function buildURL(url: string, params?: any): string {
  if (!params) {
    return url
  }

  const serializedParams = pipe(
    Object.entries,
    map(
      ([key, value]) =>
        `${encode(key)}=${encode(typeof value === 'string' ? value : JSON.stringify(value))}`
    ),
    join('&')
  )(params)

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
