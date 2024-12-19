<template>
  <div style="width: 100%; background-color: #eef0fc">
    <TableSearch :columns="columns" :query="query" :options="searchOpt" :search="handleSearch" :reset="reset" />
    <div style="margin: 0px 30px 0px 30px; border: 1px solid #ddd; border-radius: 10px">
      <el-table :data="voyData" style="width: 100%">
        <el-table-column type="index" fixed align="center" width="150px">
          <template #default="{ $index }">
            <div style="font-weight: bold; font-size: 1.2em">{{ $index === 0 ? '出发航次' : '返回航次' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="船次信息" align="center">
          <template #default="scope">
            <div style="font-weight: bold; font-size: 1.5em; align-items: center">
              <svg-icon style="width: 30px; height: 30px; margin-right: 10px" icon-class="boat3"></svg-icon>
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
    teamNo: '',
  })
  const searchOpt = ref<FormOptionList[]>([{ type: 'input', label: '团号：', prop: 'teamNo' }])

  // 表格相关
  let columns = ref([
    { type: 'index', label: '序号', width: 70, align: 'center' },
    { prop: 'teamNo', label: '团号' },
    { prop: 'tickNo', label: '票号' },
    { prop: 'passportNo', label: '护照' },
    { prop: 'trName', label: '姓名' },
    { prop: 'startSeat', label: '出发座位' },
    { prop: 'returnSeat', label: '返程座位' },
    { prop: 'tickType', label: '票型' },
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

  const voyData = ref([])
  const tableData = ref([])
  const handleSearch = async () => {
    let regex = /^\d{19}$/
    query.teamNo = query.teamNo.trim()
    if (!regex.test(query.teamNo)) {
      ElMessage.warning('请输入19位团号')
      return
    }
    //获取表格数据
    const res = await service({
      method: 'get',
      url: 'query/teamQuery/teamInfo',
      params: {
        index: page.index,
        size: page.size,
        teamNo: query.teamNo,
      },
    })
    if (res.data.code === 500) {
      ElMessage.error(res.data.msg)
      return
    }
    resPage.value = { ...res.data.page }
    tableData.value = resPage.value.list
    voyData.value[0] = res.data.startVoy
    if (res.data.returnVoy) voyData.value[1] = res.data.returnVoy
  }

  const reset = () => {
    voyData.value = []
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
