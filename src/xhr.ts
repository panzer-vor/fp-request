import { AxiosRequestConfig } from './types'


export default function xhr (config: AxiosRequestConfig) {
    const { headers, data = null, url, method = 'get' } = config
    const request = new XMLHttpRequest()
    request.open(method.toUpperCase(), url, true)
    Object.keys(headers).forEach(v => {
        request.setRequestHeader(v, headers[v])
    })
    request.send(data)
}