<template>
  <div class="sidebar-container" :class="{ 'has-logo': themeConfig.showLogo }">
    <Logo v-if="themeConfig.showLogo" :is-collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!--
        default-active：页面加载时默认激活菜单的 index
          即使不加这个属性，也能正常显示选中的item变量，但是之所以要加这个属性，是为了浏览器刷新后，仍然可以定位到之前选中的路由
        unique-opened：是否只保持一个子菜单的展开
        collapse-transition：是否开启折叠动画
        collapse：控制菜单折叠
      -->
      <el-menu
        :default-active="activeMenu"
        background-color="#304156"
        text-color="#ffffff"
        :unique-opened="SettingStore.themeConfig.uniqueOpened"
        :collapse-transition="false"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
      >
        <SubItem v-for="route in permission_routes" :key="route.path" :item="route" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
  import Logo from './components/Logo.vue'
  import SubItem from '../SubMenu/SubItem.vue'
  import { useSettingStore } from '@/store/modules/setting'
  import { usePermissionStore } from '@/store/modules/permission'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  // 在setup中获取store
  const route = useRoute()
  const PermissionStore = usePermissionStore()
  const SettingStore = useSettingStore()

  // 是否折叠
  const isCollapse = computed(() => !SettingStore.isCollapse)
  // 设置
  const themeConfig = computed(() => SettingStore.themeConfig)

  // 获取路由
  const permission_routes = computed(() => PermissionStore.permission_routes)

  const activeMenu = computed(() => {
    const { meta, path } = route
    if (meta.activeMenu) {
      return meta.activeMenu
    }
    return path
  })
</script>

<style lang="scss">
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    height: 100%;
  }
</style>
