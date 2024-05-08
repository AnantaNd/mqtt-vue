import axios from 'axios'
import router from '@/router'

const axiosInstance = axios.create({
  baseURL: 'http://175.176.161.67:3000/',
  timeout: 5000
})

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json'
    const dataUser = JSON.parse(localStorage?.getItem('dataUser'))
    if (dataUser) {
      config.headers['Authorization'] = `Bearer ${dataUser?.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    axiosInstance.isWarningShown = true
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('dataUser')
      router.push({ name: 'sign-in' })
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
