import { curry } from 'ramda' 

export function isPlainObject (val: any): val is Object {
    return Object.prototype.toString.call(val) === '[object Object]'
}

export function higher (fn: Function, ...args: any) {
    return () => fn(...args)
}
