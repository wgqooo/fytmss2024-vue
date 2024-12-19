<template>
  <div style="width: 100%; background-color: #eef0fc">
    <TableSearch :columns="columns" :query="query" :options="searchOpt" :search="handleSearch" :reset="reset" />
    <div style="padding: 0px 5px; margin: 0px 30px 0px 30px; border: 1px solid #ddd; border-radius: 10px"> </div>
    <TableCustom
      :columns="columns"
      :table-data="tableData"
      :res-page="resPage"
      :handle-current-change="handleCurrentChange"
      :handle-size-change="handleSizeChange"
    >
    </TableCustom>
  </div>
</template>

<script setup lang="ts" name="ship-info">
  import { ref, reactive } from 'vue'
  import TableCustom from '../common/table-custom.vue'
  import TableSearch from '../common/table-search.vue'
  import { FormOptionList } from '@/types/form-option'
  import { Page } from '@/types/page'
  import service from '@/api/request'
  import { ElMessage } from 'element-plus'
  import { getCurrentDate } from '@/utils/dateFormat'

  // 查询相关
  const query = reactive({
    dateType: 0,
    date: getCurrentDate(),
    state: 3,
    startSeat: 3,
    returnSeat: 3,
  })
  const searchOpt = ref<FormOptionList[]>([
    {
      type: 'select',
      prop: 'dateType',
      placeholder: '出发 / 购票日期',
      opts: [
        { label: '出发日期', value: 0 },
        { label: '购票日期', value: 1 },
      ],
    },
    { type: 'date', prop: 'date', placeholder: '请选择日期', format: 'YYYY-MM-DD' },
    {
      type: 'select',
      prop: 'state',
      opts: [
        { label: '全部票状态', value: 3 },
        { label: '未检票', value: 0 },
        { label: '退票', value: 1 },
        { label: '取消', value: 2 },
      ],
    },
    {
      type: 'select',
      prop: 'startSeat',
      placeholder: '出发座位',
      opts: [
        { label: '全部出发座位等级', value: 3 },
        { label: 'VIP座', value: 0 },
        { label: '一等座', value: 1 },
        { label: '二等座', value: 2 },
      ],
    },
    {
      type: 'select',
      prop: 'returnSeat',
      placeholder: '返程座位',
      opts: [
        { label: '全部返程座位等级', value: 3 },
        { label: 'VIP座', value: 0 },
        { label: '一等座', value: 1 },
        { label: '二等座', value: 2 },
      ],
    },
  ])

  // 表格相关
  let columns = ref([
    { type: 'index', label: '序号', width: 60, align: 'center', fixed: 'left' },
    { prop: 'tickNo', label: '票号', width: 220, fixed: 'left' },
    { prop: 'state', label: '船票状态', width: 100, fixed: 'left' },
    { prop: 'startSeat', label: '出发座位', width: 100, fixed: 'left' },
    { prop: 'returnSeat', label: '返程座位', width: 100, fixed: 'left' },
    { prop: 'tickDate', label: '订票日期', width: 220, fixed: 'right' },
    { prop: 'passportNo', label: '护照', width: 130 },
    { prop: 'trName', label: '姓名', width: 150 },
    { prop: 'travelType', label: '出入境', width: 110 },
    { prop: 'tickType', label: '票型', width: 60 },
    { prop: 'tickCost', label: '票价', width: 60 },
    { prop: 'startVoyNo', label: '出发船次', width: 100 },
    { prop: 'startDate', label: '出发日期', width: 220 },
    { prop: 'returnVoyNo', label: '返回船次', width: 100 },
    { prop: 'returnDate', label: '返回日期', width: 220 },
    { prop: 'teamNo', label: '团号', width: 220 },
    { prop: 'legalNo', label: '旅行社', width: 220 },
  ])
  const page = reactive({
    index: 1,
    size: 10,
  })
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

  const tableData = ref([])
  const handleSearch = async () => {
    //获取表格数据
    const res = await service({
      method: 'get',
      url: 'query/ticketQuery/ticketInfo',
      params: {
        index: page.index,
        size: page.size,
        dateType: query.dateType,
        date: query.date,
        state: query.state,
        startSeat: query.startSeat,
        returnSeat: query.returnSeat,
      },
    })
    if (res.data.code === 500) {
      ElMessage.error(res.data.msg)
      return
    }
    resPage.value = { ...res.data.page }
    tableData.value = resPage.value.list
  }

  const reset = () => {
    tableData.value = []
  }

  const handleSizeChange = (val: number) => {
    page.index = 1
    page.size = val
    handleSearch()
  }

  const handleCurrentChange = (val: number) => {
    page.index = val
    handleSearch()
  }
</script>

<style scoped></style>
