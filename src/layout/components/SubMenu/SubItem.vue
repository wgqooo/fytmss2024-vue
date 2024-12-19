<template>
  <template v-if="!item.hidden">
    <template v-if="!item.alwaysShow && hasOneShowingChild(item.children, item)">
      <app-link v-if="onlyOneChild.meta" :to="onlyOneChild.path">
        <el-menu-item :index="onlyOneChild.path">
          <el-icon v-if="onlyOneChild.meta.icon" :size="20">
            <component :is="onlyOneChild.meta?.icon"></component>
          </el-icon>
          <svg-icon
            v-if="onlyOneChild.meta.svg"
            style="width: 20px; height: 20px; margin-right: 10px"
            :icon-class="onlyOneChild.meta.svg"
          ></svg-icon>
          <template #title>{{ onlyOneChild.meta && onlyOneChild.meta.title }}</template>
        </el-menu-item>
      </app-link>
    </template>
    <el-sub-menu v-else :index="item.path" teleported>
      <template #title>
        <!--控制icon图标的地方，item.meta?.icon 中的 ?. 是可选链操作符，用于确保 item.meta 存在并且 icon 属性也存在。-->
        <el-icon v-if="item.meta.icon" :size="20"> <component :is="item.meta?.icon"></component></el-icon>
        <svg-icon v-else style="width: 20px; height: 20px; margin-right: 10px" :icon-class="item.meta.svg"></svg-icon>
        <span>{{ item.meta && item.meta.title }}</span>
      </template>
      <sub-item v-for="child in item.children" :key="child.path" :item="child" />
    </el-sub-menu>
  </template>
</template>

<script lang="ts" setup>
  import { isExternal } from '@/utils/validate.js'
  import AppLink from './Link.vue'
  import path from 'path-browserify'
  import { ref, computed } from 'vue'
  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
    basePath: {
      type: String,
      default: '',
    },
  })

  const onlyOneChild = ref(null)
  const hasOneShowingChild = (children = [], parent) => {
    const showingChildren = children.filter((item) => {
      // 过滤掉需要隐藏的菜单
      if (item.hidden) {
        return false
      } else {
        // 临时设置（如果只有一个显示子项，则将使用）
        onlyOneChild.value = item
        return true
      }
    })

    // 当只有一个子路由器时，默认情况下会显示该子路由器
    if (showingChildren.length === 1) {
      return true
    }
    // 如果没有要显示的子路由器，则显示父路由器
    if (showingChildren.length === 0) {
      onlyOneChild.value = { ...parent, noShowingChildren: true }
      return true
    }
    return false
  }

  const resolvePath = (routePath) => {
    if (isExternal(routePath)) {
      return routePath
    }
    if (isExternal(props.basePath)) {
      return props.basePath
    }
    return path.resolve(props.basePath, routePath)
  }
</script>
