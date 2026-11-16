import axios from 'axios'
import { clearAuth } from '../utils/auth'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const status = error.response?.status

    // 登录失败的401应该交给登录页面显示错误
    const isLoginRequest = error.config?.url?.includes('/auth/login')

    if (status === 401 && !isLoginRequest) {
      clearAuth()

      // 通知主程序跳转登录页面
      window.dispatchEvent(new Event('auth:expired'))
    }

    return Promise.reject(error)
  }
)

export default http