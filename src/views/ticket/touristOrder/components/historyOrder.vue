<template>
  <div class="util">
    <span class="startPort"
      >出入境：
      <el-select v-model="page.travelType">
        <el-option label="全部" value=""></el-option>
        <el-option label="散客出境" value="散客出境"></el-option>
        <el-option label="散客入境" value="散客入境"></el-option>
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
    <span class="queryParams">
      <el-input v-model="page.queryParams" placeholder="护照号/姓名"></el-input>
    </span>
    <el-button type="primary" @click="queryOrders">查询</el-button>
  </div>
  <div ref="appContainer" class="app-container">
    <PropTable
      :show-search="false"
      :loading="loading"
      :columns="baseColumns"
      :data="tableData"
      :res-page="resPage"
      :handle-size-change="handleSizeChange"
      :handle-current-change="handleCurrentChange"
      @selection-change="selectionChange"
      @reset="reset"
      @on-submit="onSubmit"
    >
    </PropTable>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import PropTable from '@/components/Table/PropTable/index.vue'
  import { Traveller } from '@/types/traveller'
  import service from '@/api/request'
  import { Page } from '@/types/page'
  import { columns } from './constants-history.jsx'
  import { getCurrentDate, getCurrentTime } from '@/utils/dateFormat.js'

  const loading = ref(true)
  const appContainer = ref(null)
  const tableData = ref<Traveller[]>([])
  const dateScope = ref([getCurrentDate(), getCurrentDate()])
  const resPage = ref<Page>({
    size: 0,
    pageSize: 0,
    total: 0,
    prePage: 0,
    nextPage: 0,
    pages: 0,
    pageNum: 0,
    navigatePages: 0,
    list: [],
  })
  const page = reactive({
    index: 1,
    size: 10,
    travelType: '',
    startDate: getCurrentDate() + ' ' + '00:00:00',
    endDate: getCurrentDate() + ' ' + getCurrentTime(),
    queryParams: '',
  })

  const disabledDate = (date) => {
    const today = new Date() // 获取当前日期
    today.setHours(0, 0, 0, 0) // 将时间设置为0时0分0秒0毫秒，即当天的开始时间
    return date.getTime() > today.getTime() // 禁用过去的日期
  }

  const handleSizeChange = (val: number) => {
    page.index = 1
    page.size = val
    getData()
  }
  const handleCurrentChange = (val: number) => {
    page.index = val
    getData()
  }

  //展示
  const getData = async () => {
    //获取表格数据
    const res = await service({
      method: 'get',
      url: 'ticket/touristOrder/list',
      params: page,
    })
    resPage.value = { ...res.data.page }
    tableData.value = resPage.value.list
  }

  const queryOrders = () => {
    if (dateScope.value[1] === getCurrentDate()) page.endDate = dateScope.value[1] + ' ' + getCurrentTime()
    else page.endDate = dateScope.value[1] + ' ' + '23:59:59'
    page.startDate = dateScope.value[0] + ' ' + '00:00:00'
    getData()
  }

  let baseColumns = reactive(columns)
  const selectObj = ref([])

  const selectionChange = (val) => {
    selectObj.value = val
  }

  const reset = () => {
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 500)
    ElMessage.success('触发重置方法')
  }

  const onSubmit = (val) => {
    ElMessage.success('触发查询方法')
    loading.value = true
    console.log(val)
    setTimeout(() => {
      loading.value = false
    }, 200)
  }

  onMounted(() => {
    setTimeout(() => {
      getData()
      loading.value = false
    }, 200)
  })
</script>

<style lang="scss" scoped>
  @import '../index';
</style>
