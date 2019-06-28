export const isPlainObject = (val: any): val is Object => {
  return Object.prototype.toString.call(val) === '[object Object]'
}

export const higher = (fn: Function, ...args: any) => () => fn(...args)
