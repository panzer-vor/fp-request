
export const isPlainObject = (val: any): val is Object => {
    return Object.prototype.toString.call(val) === '[object Object]'
}

export const higher = (fn: Function, ...args: any) => {
    return () => fn(...args)
}

export const extend = <T, U>(to: T, from: U): T & U => {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}
