<template>
  <div class="app-container m-user">
    <Side />
    <ParamsTable ref="paramsTable" />
  </div>
</template>

<script lang="ts" setup>
  import ParamsTable from './components/ParamsTable.vue'
  import Side from './components/Side.vue'
</script>

<style scoped lang="scss">
  @import './index';
</style>
