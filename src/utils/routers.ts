import service from '@/api/request'
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
          path: tmp.path,
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
  //return true
  if (route.meta && route.meta.roleArr) {
    return roles.some((role) => route.meta.roleArr.includes(role))
  } else {
    return false
  }
}

/**
 * @description 使用递归，过滤需要缓存的路由
 * @param {Array} _route 所有路由表
 * @param {Array} _cache 缓存的路由表
 * @return void
 * */
export function filterKeepAlive(routers) {
  const cacheRouter: any[] = []
  const deep = (routers) => {
    routers.forEach((item) => {
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
