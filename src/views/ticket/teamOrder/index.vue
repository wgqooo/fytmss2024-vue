<template>
  <div class="app-container">
    <el-tabs type="border-card" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane name="future">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><calendar /></el-icon>
            <span style="font-size: 1.2em; font-weight: bold"> 未出行订单</span>
          </span>
        </template>
      </el-tab-pane>
      <el-tab-pane name="history" class="pane1">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Memo /></el-icon>
            <span style="font-size: 1.2em; font-weight: bold"> 历史订单</span>
          </span>
        </template>
      </el-tab-pane>
      <HistoryOrder v-if="visible" />
      <FutureOrder v-else />
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import HistoryOrder from './components/historyOrder.vue'
  import FutureOrder from './components/futureOrder.vue'

  const visible = ref()
  const handleClick = (tab) => {
    if (tab.props.name === 'future') visible.value = false
    else visible.value = true
  }

  onMounted(() => {})
</script>

<style scoped lang="scss">
  @import './index';

  .demo-tabs .custom-tabs-label .el-icon {
    vertical-align: middle;
    color: #5bc0de;
  }
  .demo-tabs .custom-tabs-label span {
    vertical-align: middle;
    margin-left: 4px;
  }
</style>
