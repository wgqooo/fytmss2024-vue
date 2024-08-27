// 自定义name的壳的集合
import { h } from 'vue'

/*
根据传入的 Component 和 route.name，动态地创建或复用包装器组件。
它通过检查和管理 wrapperMap，确保相同路由的包装器只被创建一次并且可以重复使用，以提高组件的效率和性能。
*/
const wrapperMap = new Map()

export const useWrapComponents = (Component, route) => {
  let wrapper
  if (Component) {
    const wrapperName = route.name
    if (wrapperMap.has(wrapperName)) {
      wrapper = wrapperMap.get(wrapperName)
    } else {
      wrapper = {
        name: wrapperName,
        render() {
          return h('div', { className: 'app-main-inner' }, Component)
        },
      }
      wrapperMap.set(wrapperName, wrapper)
    }
    return h(wrapper)
  }
}
