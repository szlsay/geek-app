import { Toast } from 'antd-mobile'
import axios from 'axios'
import { getTokenInfo, setTokenInfo } from './storage'
import history from './history'
import store from '@/store'
import { logout, saveToken } from '@/store/actions/login'
const baseURL = 'http://geek.itheima.net/v1_0/'
const instance = axios.create({
  timeout: 5000,
  baseURL,
})

// 配置拦截器
instance.interceptors.request.use(
  (config) => {
    // 对config做点什么
    // 获取token
    const token = getTokenInfo().token
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  },
  (error) => {
    // 对错误做点什么
    return Promise.reject(error)
  }
)

// 配置响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应做点什么...
    return response.data
  },
  async (err) => {
    // 如果因为网络原因，response没有，给提示消息
    if (!err.response) {
      Toast.info('网络繁忙，请稍后重试')
      return Promise.reject(err)
    }
    const { response, config } = err
    // console.log(config)
    // 网络没问题，后台返回了有数据
    if (response.status !== 401) {
      // 不是token失效的问题
      Toast.info(response.data.message)
      return Promise.reject(err)
    }

    // 网络没问题，且是401 token失效的问题
    // 1. 判断有没有刷新token
    const { refresh_token } = getTokenInfo()
    if (!refresh_token) {
      // 没有token
      // 跳转到登录页
      history.push({
        pathname: '/login',
        state: {
          from: history.location.pathname,
        },
      })
      return Promise.reject(err)
    }

    // 是401错误，且有刷新token
    // 尝试发请求，获取新的token,注意：刷新token发送请求，不能使用封装的instance
    try {
      const res = await axios({
        method: 'put',
        url: baseURL + 'authorizations',
        headers: {
          Authorization: 'Bearer ' + refresh_token,
        },
      })
      // debugger
      // 刷新成功
      // 把新的token保存起来
      const tokenInfo = {
        token: res.data.data.token,
        refresh_token: refresh_token,
      }
      // console.log(tokenInfo)
      // 保存到redux中
      store.dispatch(saveToken(tokenInfo))
      // 保存到localstorage中
      setTokenInfo(tokenInfo)

      // token刷新成功后，重新把最开始失败的请求重新发一次
      return instance(config)
    } catch {
      // 刷新token失败, 刷新token过期
      store.dispatch(logout())
      // 跳转到登录页
      history.push({
        pathname: '/login',
        state: {
          from: history.location.pathname,
        },
      })
      Toast.info('登录信息失效，请重新登录')
      return Promise.reject(err)
    }
  }
)

export default instance
