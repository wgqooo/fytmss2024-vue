import service from '@/api/request'
import path from 'path-browserify'
/**
 * 通过递归过滤异步路由表
 * @param routes asyncRoutes
 * @param roles
 */
export async function filterAsyncRoutes(routes, roles) {
  const res = []
  // 使用 for...of 循环来实现异步请求的顺序处理
  for (const route of routes) {
    const tmp = { ...route }
    try {
      const response = await service({
        method: 'get',
        url: 'sys/auth/roles',
        params: {
          menuId: tmp.menuId,
        },
      })
      tmp.meta.roleArr = response.data.roles
      if (hasPermission(roles, tmp)) {
        if (tmp.children) {
          tmp.children = await filterAsyncRoutes(tmp.children, roles)
        }
        res.push(tmp)
      }
    } catch (error) {
      console.error('获取权限失败:', error)
    }
  }
  return res
}

//每次调用ajax请求时也应该判断路由

/**
 * 使用 meta.role 来确定当前用户是否具有权限
 * 如果 route 指定了 meta.roles，则通过 roles.some() 方法遍历用户角色数组，
 *
 * 判断用户角色是否包含在 route.meta.roles 中
 * 如果用户的任一角色包含在 route.meta.roles 中，则返回 true，表示用户有权限访问该路由；否则返回 false
 * @param roles
 * @param route
 */
export function hasPermission(roles, route) {
  if (route.meta && route.meta.roleArr) {
    return roles.some((role) => route.meta.roleArr.includes(role))
  } else {
    return false
  }
}

/**
 * 当用户从一个页面切换到另一个页面时，如果某些页面被缓存，
 * 那么这些页面的状态（比如滚动位置、表单输入数据）可以得以保留。
 * 这样可以避免用户每次返回页面时都需要重新加载和填写数据，提升用户体验
 * @description 使用递归，过滤需要缓存的路由，好处是：页面状态保持，减少服务器负载，加快页面切换速度，自定义缓存策略
 * @param {Array} _route 所有路由表
 * @param {Array} _cache 缓存的路由表
 * @return void
 * */
export function filterKeepAlive(routers) {
  const cacheRouter: any[] = []
  const deep = (routers) => {
    routers.forEach((item) => {
      // 如果当前路由项具有 meta 属性并且 meta.keepAlive 是真值，并且具有 name 属性
      if (item.meta?.keepAlive && item.name) {
        cacheRouter.push(item.name)
      }
      if (item.children && item.children.length) {
        deep(item.children)
      }
    })
  }
  deep(routers)
  return cacheRouter
}

export function handleRoutes(routers, pathUrl = '') {
  routers.forEach((item) => {
    item.path = path.resolve(pathUrl, item.path)
  })
}
