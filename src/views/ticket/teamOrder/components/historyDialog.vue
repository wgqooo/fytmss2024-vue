<template>
  <el-dialog v-model="dialogVisible" width="50%" style="color: aqua">
    <div class="footer" style="margin-bottom: 30px">
      <div class="table-inner">
        <span style="font-weight: bold; font-size: 1.5em; color: cadetblue">往返航次</span>
        <el-table :data="voyData" style="width: 100%">
          <el-table-column type="index" fixed align="center" width="150px">
            <template #default="{ $index }">
              <div style="font-weight: bold; font-size: 1.2em">{{ $index === 0 ? '出发航次' : '返回航次' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="船次信息" align="center">
            <template #default="scope">
              <div style="font-weight: bold; font-size: 1.5em; align-items: center">
                <svg-icon style="width: 30px; height: 30px; margin-right: 10px" icon-class="voy-no"></svg-icon>
                <span>{{ scope.row.voyNo }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="船号信息" align="center">
            <template #default="scope">
              <div style="font-weight: bold; font-size: 1.5em; align-items: center">
                <svg-icon style="width: 30px; height: 30px; margin-right: 10px" icon-class="ship-no"></svg-icon>
                <span>{{ scope.row.shipNo }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="船名信息" align="center">
            <template #default="scope">
              <el-popover effect="light" trigger="hover" placement="top" align="center" width="auto">
                <template #default>
                  <div>vip座总数: {{ scope.row.vipSeat }}</div>
                  <div>一等座总数: {{ scope.row.firSeat }}</div>
                  <div>二等座数量: {{ scope.row.secSeat }}</div>
                </template>
                <template #reference>
                  <div>
                    <el-tag size="large" round type="light" style="color: #606266; font-weight: bold; font-size: 20px">{{
                      scope.row.shipName
                    }}</el-tag>
                  </div>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="出发时间" align="center">
            <template #default="scope">
              <svg-icon style="width: 30px; height: 30px" icon-class="clock"></svg-icon>
              <div style="font-weight: bold; font-size: 1.5em; align-items: center">
                <span>{{ scope.row.voyDate }}</span>
              </div>
              <div style="font-weight: bold; font-size: 1.2em; align-items: center">
                <span>{{ scope.row.startTime }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="港口" align="center">
            <template #default="scope">
              <div style="font-weight: bold; font-size: 1.5em; align-items: center">
                <svg-icon style="width: 30px; height: 30px; margin-right: 10px" icon-class="from"></svg-icon>
                <span>{{ scope.row.startPort == 0 ? '抚远' : '哈巴洛夫斯克' }}</span>
              </div>
              <div style="font-weight: bold; font-size: 1.5em; align-items: center">
                <svg-icon style="width: 30px; height: 30px; margin-right: 10px" icon-class="to"></svg-icon>
                <span>{{ scope.row.startPort == 1 ? '抚远' : '哈巴洛夫斯克' }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="font-weight: bold; font-size: 1.5em; margin-top: 20px; color: cadetblue"
        >团号: {{ teamNo }} --- 旅行社: {{ travelName }}</div
      >
      <PropTable :show-search="showSearch" :columns="baseColumns" :data="ticketData"> </PropTable>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
  import service from '@/api/request'
  import { reactive, ref } from 'vue'
  import PropTable from '@/components/Table/PropTable/index.vue'
  import { columns } from './history-order.jsx'

  const dialogVisible = ref(false)
  const showSearch = ref(false)
  const ticketData = ref([])
  const voyData = ref([])
  const teamNo = ref('')
  const travelName = ref('')
  let baseColumns = reactive(columns)

  const show = async (row) => {
    teamNo.value = row.teamNo
    travelName.value = row.travelName
    const res = await service({
      method: 'get',
      url: 'ticket/teamOrder/orderInfo',
      params: {
        teamNo: row.teamNo,
      },
    })
    voyData.value[0] = res.data.startVoy
    voyData.value[1] = res.data.returnVoy
    ticketData.value = res.data.page
    dialogVisible.value = true
  }

  defineExpose({
    show,
  })
</script>

<style lang="scss" scoped>
  @import '../index';
</style>
