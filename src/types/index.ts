export type Method = 'get' | 'GET' | 'post' | 'POST' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'PUT' | 'put' | 'PATCH' | 'patch'

export interface AxiosRequestConfig {
    url: string
    method?: string
    data?: any
    params?: any
    headers?: any
}