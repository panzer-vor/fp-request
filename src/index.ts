import request from './request'

export const pipe = (...funcs: any[]) => {
  if (funcs.length === 0) {
    return (arg: any) => arg
  }
  if (funcs.length === 1) {
    return funcs[0]
  }
  return funcs.reduce((a, b) => async (...args: any[]) => b(await a(...args)))
}
export default request
