<template>
  <!--
  name="fade-slide"：指定过渡动画的名称，这里是 fade-slide
  mode="out-in"：指定过渡模式，表示新元素先进入，旧元素再离开
  appear：表示初次渲染时也会应用过渡效果
  -->
  <div class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-slide" mode="out-in" appear>
        <keep-alive v-if="isReload" :include="cacheRoutes">
          <component :is="useWrapComponents(Component, route)" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
  import { useWrapComponents } from '@/hooks/useWrapComponents'
  import { computed, ref } from 'vue'
  import { useSettingStore } from '@/store/modules/setting'
  import { usePermissionStore } from '@/store/modules/permission'
  const SettingStore = useSettingStore()
  const PermissionStore = usePermissionStore()
  const cacheRoutes = computed(() => PermissionStore.keepAliveRoutes)
  const isReload = computed(() => SettingStore.isReload)
</script>

<style lang="scss" scoped>
  .app-main {
    flex: 1;
    display: flex;
    overflow-x: hidden;
    width: 100%;
    box-sizing: border-box;
    .app-main-inner {
      flex: 1;
      display: flex;
      overflow-x: hidden;
      width: 100%;
      box-sizing: border-box;
    }
  }
</style>
