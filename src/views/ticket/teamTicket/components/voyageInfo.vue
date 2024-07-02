<template>
  <div class="util">
    <span class="startPort"
      >港口：
      <el-select v-model="startPort" :disabled="disabled">
        <el-option label="抚远" :value="0"></el-option>
        <el-option label="哈巴洛夫斯克" :value="1"></el-option>
      </el-select>
    </span>
    <span class="startTime"
      >出发日期：
      <el-date-picker
        v-model="dateScope"
        type="daterange"
        unlink-panels
        range-separator="至"
        start-placeholder="开始"
        end-placeholder="截止"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        :editable="false"
        :clearable="false"
        :disabled-date="disabledDate"
      />
    </span>
    <el-button type="primary" @click="queryVoys">查询</el-button>
  </div>
  <div class="table-inner">
    <el-table v-loading="loading" :data="tableData" style="width: 100%" border>
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
              <div>二等座总数: {{ scope.row.secSeat }}</div>
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
      <el-table-column label="票价" align="center">
        <template #default="scope">
          <div style="font-weight: bold; font-size: 1.5em; align-items: center">
            <svg-icon style="width: 30px; height: 30px; margin-right: 10px" icon-class="vip-seat"></svg-icon>
            <span>{{ scope.row.vipVisa }}</span>
            <svg-icon style="width: 20px; height: 20px; margin-right: 10px" icon-class="rmb"></svg-icon>
          </div>
          <div style="font-weight: bold; font-size: 1.5em; align-items: center">
            <svg-icon style="width: 30px; height: 30px; margin-right: 10px" icon-class="fir-seat"></svg-icon>
            <span>{{ scope.row.firVisa }}</span>
            <svg-icon style="width: 20px; height: 20px; margin-right: 10px" icon-class="rmb"></svg-icon>
          </div>
          <div style="font-weight: bold; font-size: 1.5em; align-items: center">
            <svg-icon style="width: 30px; height: 30px; margin-right: 10px" icon-class="sec-seat"></svg-icon>
            <span>{{ scope.row.secVisa }}</span>
            <svg-icon style="width: 20px; height: 20px; margin-right: 10px" icon-class="rmb"></svg-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="剩余票量" align="center">
        <template #default="scope">
          <div style="font-weight: bold; font-size: 1.5em; align-items: center">
            <svg-icon style="width: 30px; height: 30px; margin-right: 10px" icon-class="vip-seat"></svg-icon>
            <span>{{ scope.row.vipLeft }} 张</span>
          </div>
          <div style="font-weight: bold; font-size: 1.5em; align-items: center">
            <svg-icon style="width: 30px; height: 30px; margin-right: 10px" icon-class="fir-seat"></svg-icon>
            <span>{{ scope.row.firLeft }} 张</span>
          </div>
          <div style="font-weight: bold; font-size: 1.5em; align-items: center">
            <svg-icon style="width: 30px; height: 30px; margin-right: 10px" icon-class="sec-seat"></svg-icon>
            <span>{{ scope.row.secLeft }} 张</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-checkbox v-model="scope.row.isSelected" label="选择" border @change="selectVoy(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
  import service from '@/api/request'
  import { getCurrentDate } from '@/utils/dateFormat'
  import { computed, onMounted, ref, watch } from 'vue'

  const props = defineProps({
    handleEdit: {
      type: Function,
      default: () => {},
    },
    resetEdit: {
      type: Function,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: () => {
        return false
      },
    },
    port: {
      type: Number,
      default: () => {
        return 0
      },
    },
    startVoyData: {
      type: Array,
    },
    returnVoyData: {
      type: Array,
    },
  })
  const tableData = ref<[]>([])
  const loading = ref(true)
  const startPort = computed(() => {
    return props.port
  })
  watch(startPort, () => {
    getData()
  })

  const dateScope = ref([getCurrentDate(), getCurrentDate()])

  const disabledDate = (date) => {
    const today = new Date() // 获取当前日期
    today.setHours(0, 0, 0, 0) // 将时间设置为0时0分0秒0毫秒，即当天的开始时间
    return date.getTime() < today.getTime() // 禁用过去的日期
  }

  //展示
  const getData = async () => {
    //获取表格数据
    const res = await service({
      method: 'get',
      url: 'voyage/voyageManage/allBetweenDate',
      params: {
        startPort: startPort.value,
        startDate: dateScope.value[0],
        endDate: dateScope.value[1],
      },
    })
    tableData.value = res.data.voyages
    tableData.value.forEach((row: any) => {
      row['isSelected'] = false
    })
    //清除之前的选择
    props.resetEdit(startPort.value)
  }
  const queryVoys = () => {
    getData()
  }

  //选择新的航次，舍去之前的选择
  const selectVoy = (selectedRow) => {
    tableData.value.forEach((row: any) => {
      if (row !== selectedRow) {
        row.isSelected = false
      }
    })
    props.handleEdit(selectedRow)
  }

  onMounted(() => {
    setTimeout(() => {
      loading.value = false
      getData()
    }, 200)
  })
</script>

<style lang="scss" scoped>
  @import '../../common/index.scss';
</style>
