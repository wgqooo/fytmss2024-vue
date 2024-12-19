<template>
  <div style="width: 100%; background-color: #eef0fc">
    <TableSearch :columns="columns" :query="query" :options="searchOpt" :search="handleSearch" :reset="reset" />
    <div style="margin: 0px 30px 0px 30px; border: 1px solid #ddd; border-radius: 10px"> </div>
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
    dateScope: [getCurrentDate(), getCurrentDate()],
  })
  const searchOpt = ref<FormOptionList[]>([{ type: 'daterange', label: '出发日期 ', prop: 'dateScope', format: 'YYYY-MM-DD' }])

  // 表格相关
  let columns = ref([
    { type: 'index', label: '序号', width: 70 },
    { prop: 'voyNo', label: '船次', width: 150 },
    { prop: 'reShipNo', label: '船舷号', width: 150 },
    { prop: 'shipName', label: '船名', width: 170 },
    { prop: 'voyDate', label: '出发日期', width: 260 },
    { prop: 'teamNo', label: '团号', width: 300 },
    { prop: 'travelName', label: '旅行社' },
    { prop: 'teamNum', label: '团人数', width: 160 },
    { prop: 'carryNum', label: '核载人数', width: 160 },
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
      url: 'query/carryQuery/carryInfo',
      params: {
        index: page.index,
        size: page.size,
        startDate: query.dateScope[0],
        endDate: query.dateScope[1],
      },
    })
    if (res.data.code === 500) {
      ElMessage.error(res.data.msg)
      return
    }
    if (res.data.page.list.length === 0) {
      ElMessage.warning('该日期区间没有运载信息')
      return
    }
    resPage.value = { ...res.data.page }
    tableData.value = resPage.value.list
    const carryNumMap = {}
    tableData.value.forEach((carry) => {
      const { voyDate, voyNo, teamNum } = carry
      const key = `${voyNo}_${voyDate}`
      if (carryNumMap[key]) {
        carryNumMap[key] += teamNum
      } else {
        carryNumMap[key] = teamNum
      }
    })
    tableData.value.forEach((carry) => {
      const { voyNo, voyDate } = carry
      const key = `${voyNo}_${voyDate}`
      carry['carryNum'] = carryNumMap[key]
    })
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
