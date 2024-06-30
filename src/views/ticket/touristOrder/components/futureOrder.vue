<template>
  <div class="util">
    <span class="startPort"
      >订票时间：
      <el-select v-model="startPort">
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
  import { ref, reactive, onMounted, nextTick } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import PropTable from '@/components/Table/PropTable/index.vue'
  import { Traveller } from '@/types/traveller'
  import service from '@/api/request'
  import { Page } from '@/types/page'
  import { columns } from './constants.tsx'

  const loading = ref(true)
  const appContainer = ref(null)
  const travellerDialog = ref()
  const tableData = ref<Traveller[]>([])
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
  })

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

  let baseColumns = reactive(columns)
  const selectObj = ref([])

  const add = () => {
    travellerDialog.value.show()
  }

  const batchDelete = () => {
    if (!selectObj.value.length) {
      return ElMessage.error('未选中任何行')
    }
    ElMessageBox.confirm('你确定要删除选中项吗?', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    })
      .then(() => {
        ElMessage.success('模拟删除成功')
        list.value = list.value.concat([])
      })
      .catch(() => {})
  }

  const selectionChange = (val) => {
    selectObj.value = val
  }

  const edit = (row) => {
    travellerDialog.value.show(row)
  }

  const del = (row) => {
    ElMessageBox.confirm('你确定要删除当前项吗?', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    }).then(() => {
      service({
        method: 'delete',
        url: 'base/traveller/delete',
        //在axios接口封装是接收参数是一个object类型，不能直接params或者data当成一个属性或者直接赋值
        params: {
          passportNo: row.passportNo,
        },
      }).then((response) => {
        if (response.data.code == 0) {
          ElMessage.success(response.data.msg)
          getData()
        } else {
          ElMessage.error(response.data.msg)
        }
      })
    })
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
    setTimeout(() => {
      loading.value = false
    }, 500)
  }

  onMounted(() => {
    nextTick(() => {
      // let data = appContainer.value.
    })
    setTimeout(() => {
      //getData()
      loading.value = false
    }, 200)
  })
</script>

<style lang="scss" scoped>
  @import '../index';
</style>
