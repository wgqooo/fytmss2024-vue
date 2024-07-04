<template>
  <el-dialog v-model="dialogVisible" :title="title" width="40%" @close="close">
    <div style="display: flex">
      <svg-icon style="width: 50%; height: 320px; margin-right: 10px" icon-class="boat2"></svg-icon>
      <el-descriptions class="orderDescriptions" :column="1" :size="size" border>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item"> 往返 </div>
          </template>
          {{ props.voyData[0]['voyNo'] }}⬅➡
          {{ props.voyData[1]['voyNo'] }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item"> 港口 </div>
          </template>
          {{ props.voyData[0]['startPort'] === 0 ? '抚远' : '哈巴洛夫斯克' }} ⬅➡
          {{ props.voyData[0]['startPort'] === 0 ? '哈巴洛夫斯克' : '抚远' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item"> 出发时间 </div>
          </template>
          {{ props.voyData[0]['voyDate'] }} / {{ props.voyData[0]['startTime'] }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item"> 返回时间 </div>
          </template>
          {{ props.voyData[1]['voyDate'] }} / {{ props.voyData[1]['startTime'] }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item"> 订票数量 </div>
          </template>
          <el-tag size="small">{{ props.chooseTravellers.length }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item"> 订单金额 </div>
          </template>
          {{ props.getTotalMoney() }} 元
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item"> 支付方式 </div>
          </template>
          现金
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <el-table :data="props.chooseTravellers" style="width: 100%; height: 100%">
      <el-table-column type="index" fixed label="序号" align="center" width="55">
        <template #default="{ $index }">
          {{ getIndex($index) }}
        </template>
      </el-table-column>
      <el-table-column prop="passportNo" fixed label="护照号" align="center" />
      <el-table-column prop="trName" fixed label="姓名" align="center" />
      <el-table-column prop="ticketType" label="票型" align="center">
        <template #default="scope">
          {{ scope.row.ticketType === 0 ? '成人票' : '儿童票' }}
        </template>
      </el-table-column>
      <el-table-column prop="startSeat" label="出发座位" align="center">
        <template #default="scope">
          {{ scope.row.startSeat }}
        </template>
      </el-table-column>
      <el-table-column prop="returnSeat" label="返回座位" align="center">
        <template #default="scope">
          {{ scope.row.returnSeat }}
        </template>
      </el-table-column>
      <el-table-column prop="ticketPrice" label="票价" align="center">
        <template #default="scope">
          {{ scope.row.tickCost }}
          <svg-icon style="width: 20px; height: 15px; margin-right: 10px" icon-class="rmb"></svg-icon>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="props.generateOrder">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  import { FormInstance } from 'element-plus'
  import { ref } from 'vue'
  import type { ComponentSize } from 'element-plus'

  const props = defineProps({
    chooseTravellers: {
      type: Array,
    },
    voyData: {
      type: Array,
    },
    getTotalMoney: {
      type: Function,
    },
    generateOrder: {
      type: Function,
    },
  })
  const size = ref<ComponentSize>('large')
  const dialogVisible = ref<boolean>(false)
  const title = ref('订单信息')

  function close() {
    dialogVisible.value = false
  }

  const show = (item = {}) => {
    dialogVisible.value = true
  }
  const getIndex = (index: number) => {
    return index + 1
  }

  defineExpose({
    show,
  })
</script>

<style lang="scss" scoped>
  .orderDescriptions {
    width: 50%;
    margin-left: auto;
    margin-bottom: 20px;
  }
  .cell-item {
    color: #2196f3;
  }
</style>
