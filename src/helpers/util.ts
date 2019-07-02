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

export const NotEqualsUndefined = (data: any) => {
  return typeof data !== 'undefined'
}

export const includesKey = (array: string[]) => (key: string) => array.includes(key)

export const composePipe = (...pipes: any[]) => (...datas: any[]) => {
  return pipes.map((v, i) => v(datas[i]))
}

export const flatObject = (objArray: any[]) => {
  const config = Object.create(null)
  objArray.forEach((v: any) => {
    Object.entries(v).forEach(([key, value]) => {
      config[key] = value
    })
  })
  return config
}
