export type Method =
  | 'get'
  | 'GET'
  | 'post'
  | 'POST'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'PUT'
  | 'put'
  | 'PATCH'
  | 'patch'

export interface IRequestConfig {
  url: string
  method?: string
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
}

export interface IResponse {
  data: any
  status: number
  statusText: string
  headers: any
  config: IRequestConfig
  request: any
}

export interface IPromise extends Promise<IResponse> {}
