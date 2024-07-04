<template>
  <div class="m-ticket-table">
    <div class="util">
      <span class="team"
        >中俄团：
        <el-select v-model="page.country">
          <el-option label="中团" value="中团"></el-option>
          <el-option label="俄团" value="俄团"></el-option>
        </el-select>
      </span>
      <span class="startPort"
        >出入境：
        <el-select v-model="page.exitEntry">
          <el-option label="全部" value=""></el-option>
          <el-option label="出境" value="出境"></el-option>
          <el-option label="入境" value="入境"></el-option>
        </el-select>
      </span>
      <span class="startTime"
        >乘船日期：
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
      <el-button type="primary" @click="queryOrders">查询</el-button>
    </div>
    <el-table :data="teamData" border :row-style="{ height: '60px' }" style="font-size: 1.2em">
      <el-table-column label="序号" align="center">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="travelName" label="旅行社" align="center"></el-table-column>
      <el-table-column prop="teamNo" label="团号" align="center"></el-table-column>
      <el-table-column prop="travellerNum" label="人数" align="center"></el-table-column>
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button type="primary" size="large" icon="View" @click="viewTeamInfo(scope.row)"> 查看团信息 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        :current-page="resPage.pageNum"
        :page-size="resPage.pageSize"
        background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="resPage.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
  <HistoryDialog ref="historyDialog"></HistoryDialog>
</template>
<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import { Traveller } from '@/types/traveller'
  import HistoryDialog from './historyDialog.vue'
  import service from '@/api/request'
  import { Page } from '@/types/page'
  import { getCurrentDate, getCurrentTime } from '@/utils/dateFormat.js'

  const loading = ref(true)
  const tableData = ref<Traveller[]>([])
  const teamData = ref<[]>([])
  const historyDialog = ref()
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
    country: '中团',
    exitEntry: '',
    startDate: getCurrentDate() + ' ' + '00:00:00',
    endDate: getCurrentDate() + ' ' + getCurrentTime(),
  })

  const disabledDate = (date) => {
    const today = new Date() // 获取当前日期
    today.setHours(0, 0, 0, 0) // 将时间设置为0时0分0秒0毫秒，即当天的开始时间
    return date.getTime() > today.getTime() // 禁用未来的日期
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
      url: 'ticket/teamOrder/list',
      params: page,
    })
    resPage.value = { ...res.data.page }
    teamData.value = resPage.value.list
  }

  const queryOrders = () => {
    if (dateScope.value[1] === getCurrentDate()) page.endDate = dateScope.value[1] + ' ' + getCurrentTime()
    else page.endDate = dateScope.value[1] + ' ' + '23:59:59'
    page.startDate = dateScope.value[0] + ' ' + '00:00:00'
    getData()
  }

  const viewTeamInfo = (row) => {
    historyDialog.value.show(row)
  }

  const selectObj = ref([])

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
