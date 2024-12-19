<template>
  <div class="app-container m-ticket">
    <div class="m-ticket-table">
      <div class="footer" style="height: 240px; margin-bottom: 30px">
        <el-divider class="ticket-divider">
          <span class="divider-span">散客购票</span>
        </el-divider>
        <div class="theSteps">
          <el-steps :active="active" align-center finish-status="success">
            <el-step title="选择航次" />
            <el-step title="选择旅客" />
            <el-step title="生成订单" />
          </el-steps>
        </div>
        <div class="theStepsBtn">
          <el-button class="previousStep" @click="previousStep">上一步</el-button>
          <el-button class="nextStep" @click="nextStep">下一步</el-button>
        </div>
      </div>
      <div v-if="active === 0" class="footer"><VoyageInfo :handle-edit="handleEdit" /></div>
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

  const active = ref(0)
  const voyData = ref([])
  const order = ref([])
  const nextStep = () => {
    if (voyData.value.length === 0) {
      ElMessage.warning('请选择航次')
      return
    } else if (++active.value > 2) active.value = 0
  }
  const previousStep = () => {
    //voyData.value.pop()
    if (active.value > 1) {
      --active.value
    } else if (active.value > 0) {
      voyData.value.pop()
      --active.value
    } else ElMessage.warning('已是初始状态')
  }
  const handleEdit = (voy) => {
    voyData.value.push(voy)
    nextStep()
  }

  const orderData = (val) => {
    console.log('val', val)
    order.value = val
  }
</script>

<style scoped lang="scss">
  @import '../common/index.scss';
</style>
