<template>
  <div class="app-container m-user">
    <UserSide />
    <UserTable />
  </div>
</template>

<script lang="ts" setup>
  import UserTable from './components/shipTable.vue'
</script>

<style scoped lang="scss">
  @import './index';
</style>
