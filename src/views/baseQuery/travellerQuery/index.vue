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

  // 查询相关
  const query = reactive({
    passportNo: '',
    trName: '',
  })
  const searchOpt = ref<FormOptionList[]>([
    { type: 'input', prop: 'passportNo', label: '护照号', placeholder: '请输入护照号' },
    { type: 'input', prop: 'trName', label: '姓名', placeholder: '请输入姓名' },
  ])

  // 表格相关
  let columns = ref([
    { type: 'index', label: '序号', width: 60, align: 'center', fixed: 'left' },
    { prop: 'passportNo', label: '护照', width: 170 },
    { prop: 'trName', label: '姓名', width: 200 },
    { prop: 'trPinYin', label: '英文名', width: 200 },
    { prop: 'trPhone', label: '手机号', width: 180 },
    { prop: 'trTmpPhone', label: '临时手机号', width: 180 },
    { prop: 'trSex', label: '性别', width: 120 },
    { prop: 'trBirthday', label: '出生日期', width: 200 },
    { prop: 'trBorAdd', label: '出生地', width: 120 },
    { prop: 'trNation', label: '国籍', width: 120 },
    { prop: 'legalNo', label: '旅行社', width: 220 },
    { prop: 'tickDate', label: '订票(变动)时间' },
    { prop: 'tickCost', label: '票价', width: 100 },
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
      url: 'query/travellerQuery/travellerInfo',
      params: {
        index: page.index,
        size: page.size,
        passportNo: query.passportNo,
        trName: query.trName,
      },
    })
    if (res.data.code === 500) {
      ElMessage.error(res.data.msg)
      return
    }
    resPage.value = { ...res.data.page }
    tableData.value = resPage.value.list
    tableData.value.forEach((traveller) => {
      if (traveller['trSex'] === 0) traveller['trSex'] = '女'
      else traveller['trSex'] = '男'
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
