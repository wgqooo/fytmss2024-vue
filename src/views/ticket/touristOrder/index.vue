<template>
  <div class="app-container">
    <div class="banner">
      <el-button @click="fOrder">未出行订单</el-button>
      <el-button @click="hOrder">历史订单</el-button>
    </div>
    <HistoryOrder v-if="visible" />
    <FutureOrder v-else />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import HistoryOrder from './components/historyOrder.vue'
  import FutureOrder from './components/futureOrder.vue'

  const visible = ref(false)

  const fOrder = () => {
    visible.value = false
  }
  const hOrder = () => {
    visible.value = true
  }
</script>

<style scoped lang="scss">
  @import './index';
  .banner {
    background-color: #5bc0de;
    height: auto;
    border-radius: 5px;
    .el-button {
      color: white;
      background-color: #5bc0de;
      border: #5bc0de;
      font-weight: bold;
      height: 40px;
    }
    .el-button:hover {
      background-color: white;
      color: #5bc0de;
    }
    .el-button:focus {
      background-color: white;
      color: #5bc0de;
    }
  }
</style>
