
/**
 * 封装 axios 请求模块
 */
import axios from 'axios'

import jsonBig from 'json-bigint'

import store from '@/store'
import router from '@/router'
// axios.create 方法：复制一个 axios
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/' // 基础路径
})

// axios 开放了自定义转换后端返回数据的 API
// data 就是后端返回的原始数据
request.defaults.transformResponse = [function (data) {
  try {
    // 现在我们定制使用 json-bigint 来帮我们处理转换原始的 JSON 格式字符串
    // 这个方法类似于 JSON.parse，只不过它能把数据中的超出 JS 安全整数范围的数字给处理成正确的
    // 它内部有自己的算法，它会把大数字转为一个对象，我们在使用的时候把对象.toString() 就得到字符串形式的 id 了
    // 如果转换成功则返回成功的结果给请求使用
    // 如果转换失败则进入 catch，返回一个空对象
    return jsonBig.parse(data)

    // 它默认是这样的
    // return JSON.parse(data)
  } catch (err) {
    console.log('转换失败', err)
    return {}
  }
}]
// 请求拦截器
request.interceptors.request.use(function (config) {
  const { user } = store.state
  if (user) { config.headers.Authorization = `Bearer ${user.token}` }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, async function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  if (error.response && error.response.status === 401) {
    const user = store.state.user
    if (!user || !user.refresh_token) {
      redirectLogin()
      // router.push('/login')

      return
    }
    try {
      const { data } = await axios({
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        method: 'PUT',
        Headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      store.commit('onSetItem', {
        ...user,
        token: data.data.token
      })
      return request(error.config)
    } catch (err) {
      console.log('刷新token失败', err)
      redirectLogin()
      // router.push('/login')
    }
  }

  return Promise.reject(error)
})

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}
export default request
