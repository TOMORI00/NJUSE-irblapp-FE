import axios from 'axios'
import api from './api'

let instance = axios.create({
    baseURL: 'http://172.19.130.201:8090/irblapp-ZERO',
    // baseURL: 'http://localhost:8090',
    timeout: 50000
})

//请求拦截器
instance.interceptors.request.use(config => {
    console.log('正在请求')
    return config
}, err => {
    console.error('请求失败', err)
})

//响应拦截器
instance.interceptors.response.use(res => {
    console.log('请求成功')
    return res
}, err => {
    console.log('响应失败', err)
})

//封装请求 option = {method,url,params} method为请求方法，url为请求接口，params为请求参数
async function http(option = {}) {
    let result = null
    if (option.method === 'get' || option.method === 'delete') {
        await instance[option.method](
            api[option.url],
            {params: option.params}
        ).then(res => {
            result = res.data
        }).catch(err => {
            result = err
        })
    } else if (option.method === 'post' || option.method === 'put') {
        await instance[option.method](
            api[option.url],
            option.params
        ).then(res => {
            result = res.data
        }).catch(err => {
            result = err
        })
    }

    return result
}

export default http