import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import router from '@/routers'
import { ElNotification } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { usePermissionStore } from '@/store/modules/permission'
import { getCurrentTime } from '@/utils/dateFormat'

// 创建axios实例 进行基本参数配置
const service = axios.create({
  // 默认请求地址，根据环境的不同可在.env 文件中进行修改
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 设置接口访问超时时间
  timeout: 3000000, // request timeout，
  // 跨域时候允许携带凭证
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

//  request interceptor 接口请求拦截
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    /**
     * 用户登录之后获取服务端返回的token,后面每次请求都在请求头中带上token进行JWT校验
     * token 存储在本地储存中（storage）、vuex、pinia
     */
    const userStore = useUserStore()
    const token: string = userStore.token
    // 自定义请求头
    if (token) {
      config.headers['Authorization'] = token
    }
    return config
  },
  (error: AxiosError) => {
    // 请求错误，这里可以用全局提示框进行提示
    console.log(error)
    return Promise.reject(error)
  },
)

//  response interceptor 接口响应拦截
service.interceptors.response.use(
  async (response: AxiosResponse) => {
    // 直接返回res，当然你也可以只返回res.data
    // 系统如果有自定义code也可以在这里处理
    if (response.headers['session-status'] === 'two-user') {
      const userStore = useUserStore()
      const TagsViewStore = useTagsViewStore()
      const PermissionStore = usePermissionStore()
      //还需要清除token
      await userStore.logout()
      await router.push({ path: '/login' })
      TagsViewStore.clearVisitedView()
      PermissionStore.clearRoutes()
      ElNotification({
        title: getCurrentTime(),
        //dangerouslyUseHTMLString: true,
        message: '您的账户已被异地登录，您已下线',
        type: 'error',
        offset: 200,
        duration: 5000,
      })
    }
    return response
  },
  async (error: AxiosError) => {
    if (error.response.status === 500) {
      ElNotification({
        title: getCurrentTime(),
        message: '服务器发生错误，请稍后重试或联系管理员',
        type: 'error',
        duration: 3000,
      })
    }
    return Promise.reject(error)
  },
)

// /**
//  * @description 显示错误消息
//  * opt 传入参数
//  * err 错误信息
//  * type 消息类型
//  * duration 消息持续时间
//  */
// function showErrMessage(opt, err, type: any = 'error', duration = 5000) {
//   ElMessage({
//     message: err.msg,
//     type: type,
//     duration: duration,
//   });
// }

export default service
