<template>
  <div class="app-container m-user">
    <UserSide />
    <TravellerTable />
  </div>
</template>

<script lang="ts" setup>
 // 也可以使用travellerTable类型的表格进行展示
 // import TravellerTable from './components/travellerTable.vue'
  import TravellerTable from './components/travellerTable2.vue'
</script>

<style scoped lang="scss">
  @import './index';
</style>
