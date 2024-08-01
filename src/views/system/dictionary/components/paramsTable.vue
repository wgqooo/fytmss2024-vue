<template>
  <div class="m-user-table">
    <div class="header">
      <el-form ref="ruleFormRef" :inline="true" :model="formInline">
        <el-form-item label="参数" prop="username">
          <el-input v-model="formInline['username']" placeholder="请输入参数特征" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="onSubmit">查询</el-button>
          <el-button @click="reset(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <div class="util">
        <el-button type="primary" @click="addHandler">
          <el-icon><Plus /></el-icon>
          新增系统参数
        </el-button>
      </div>
      <div class="table-inner">
        <el-table v-loading="loading" :data="filteredTableData" style="width: 100%; height: 100%" border>
          <el-table-column type="index" label="序号" align="center" width="80">
            <template #default="{ $index }">
              {{ getIndex($index) }}
            </template>
          </el-table-column>
          <el-table-column prop="dtype" label="参数类型" align="center" width="150" />
          <el-table-column prop="dcode" label="参数编码" align="center" />
          <el-table-column prop="cpara" label="参数说明" align="center" />
          <el-table-column prop="dvalue" label="参数值" align="center" />
          <el-table-column prop="dtime" label="修改时间" align="center" />
          <el-table-column prop="operator" label="操作" width="260px" align="center" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" icon="Edit" @click="editHandler(scope.row)"> 编辑 </el-button>
              <el-button type="danger" size="small" icon="Delete" @click="del(scope.row)"> 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          :current-page="resPage.pageNum"
          :page-size="resPage.pageSize"
          :page-sizes="pageSizes"
          background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="resPage.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <ParamsDialog ref="paramsDialog" :get-data="getData" />
  </div>
</template>
<script lang="ts" setup>
  import { ElMessageBox, ElMessage, FormInstance } from 'element-plus'
  import { Search } from '@element-plus/icons-vue'
  import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
  import ParamsDialog from './paramsDialog.vue'
  import service from '@/api/request'
  import { Page } from '@/types/page'
  import emitter from '@/utils/emitter'

  const tableData = ref([])
  const filteredTableData = ref([])
  const paramsDialog = ref()
  const ruleFormRef = ref<FormInstance>()
  const formInline = reactive({})
  const loading = ref(true)

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
  const pageSizes = reactive([10, 20, 30, 50, 100])

  //索引
  const getIndex = (index: number) => {
    return index + 1 + (resPage.value.pageNum - 1) * resPage.value.pageSize
  }

  //展示
  const getData = async () => {
    //获取表格数据
    const res = await service({
      method: 'get',
      url: 'sys/syspara/list',
      params: page,
    })
    resPage.value = { ...res.data.page }
    tableData.value = resPage.value.list
    emitter.emit('updateTypes')
  }
  const onSubmit = () => {
    console.log('submit!', formInline)
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }

  const reset = (formEl: FormInstance | undefined) => {
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }

  const addHandler = () => {
    paramsDialog.value.show()
  }
  const editHandler = (row) => {
    paramsDialog.value.show(row)
  }

  const del = (row) => {
    ElMessageBox.confirm('你确定要删除当前项吗?', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    })
      .then(() => {
        service({
          method: 'delete',
          url: 'sys/syspara/delete',
          //在axios接口封装是接收参数是一个object类型，不能直接params或者data当成一个属性或者直接赋值
          params: {
            dType: row.dtype,
            dCode: row.dcode,
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
      .catch(() => {})
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

  onMounted(() => {
    emitter.on('filterData', (filterText) => {
      filteredTableData.value = tableData.value.filter((row) => {
        return row.dtype.includes(filterText)
      })
    })
    setTimeout(() => {
      loading.value = false
      getData()
    }, 200)
  })
  onUnmounted(() => {
    // 解绑事件
    emitter.off('filterData')
  })
</script>
<style lang="scss" scoped>
  @import '../index';
</style>
