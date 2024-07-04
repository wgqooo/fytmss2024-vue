<template>
  <div class="app-container m-ticket">
    <div class="m-ticket-table">
      <div class="footer" style="height: 240px; margin-bottom: 30px">
        <el-divider class="ticket-divider">
          <span class="divider-span">团体购票</span>
        </el-divider>
        <div class="theSteps">
          <el-steps :active="active" align-center finish-status="success">
            <el-step title="往返航次" />
            <el-step title="选择旅客" />
            <el-step title="生成订单" />
          </el-steps>
        </div>
        <div class="theStepsBtn">
          <el-button class="previousStep" @click="previousStep">上一步</el-button>
          <el-button class="nextStep" @click="nextStep">下一步</el-button>
        </div>
      </div>
      <div v-if="active === 0" class="footer">
        <span style="font-weight: bold; font-size: 1.5em; color: #409eff">
          出发航线
          <el-button type="primary" style="margin-left: 20px" @click="switchPort">
            <svg-icon style="width: 30px; height: 30px; margin-right: 10px" icon-class="switch"></svg-icon>
            切换港口
          </el-button>
        </span>
        <svg-icon style="width: 80px; height: 30px; margin-right: 10px" icon-class="go"></svg-icon>
        <VoyageInfo :voy-num="0" :handle-edit="handleEdit" :reset-edit="resetEdit" :disabled="true" :port="port" />
        <el-divider style="border-width: 30px; border-color: #f0f2f5"></el-divider>
        <span style="font-weight: bold; font-size: 1.5em; color: #409eff">返回航线</span>
        <svg-icon style="width: 80px; height: 30px; margin-right: 10px" icon-class="back"></svg-icon>
        <VoyageInfo :voy-num="1" :handle-edit="handleEdit" :reset-edit="resetEdit" :disabled="true" :port="port == 0 ? 1 : 0" />
      </div>
      <ChooseTravellers v-if="active === 1" :voy-data="voyData" :order-data="orderData" :next-step="nextStep" />
      <OrderInfo v-if="active === 2" :order="order" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import VoyageInfo from './components/voyageInfo.vue'
  import ChooseTravellers from './components/chooseTravellers.vue'
  import OrderInfo from './components/orderInfo.vue'
  import { ElMessage } from 'element-plus'

  const port = ref(0)
  const active = ref(0)
  const voyData = ref([])
  const order = ref([])
  const switchPort = () => {
    port.value = port.value == 0 ? 1 : 0
  }
  const nextStep = () => {
    if (voyData.value[0] == undefined) {
      ElMessage.warning('请选择出发航次')
      return
    } else if (voyData.value[1] == undefined) {
      ElMessage.warning('请选择返回航次')
      return
    } else if (++active.value > 2) active.value = 0
  }
  const previousStep = () => {
    if (active.value > 1) {
      --active.value
    } else if (active.value > 0) {
      voyData.value[0] = undefined
      voyData.value[1] = undefined
      --active.value
    } else ElMessage.warning('已是初始状态')
  }
  const handleEdit = (voy, voyNum) => {
    if (voyData.value[voyNum] === voy) voyData.value[voyNum] = undefined
    else voyData.value[voyNum] = voy
    if (voyData.value[0] != undefined && voyData.value[1] != undefined) {
      nextStep()
    }
  }
  const resetEdit = (voyNum) => {
    voyData.value[voyNum] = undefined
  }

  const orderData = (val) => {
    order.value = val
  }
</script>

<style scoped lang="scss">
  @import '../common/index.scss';
</style>
