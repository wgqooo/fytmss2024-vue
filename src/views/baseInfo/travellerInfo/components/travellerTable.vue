<template>
  <div class="m-user-table">
    <div class="header">
      <el-form ref="ruleFormRef" :inline="true" :model="formInline">
        <el-form-item label="用户名" prop="travellername">
          <el-input v-model="formInline.username" placeholder="请输入用户名" />
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
          新增旅客
        </el-button>
      </div>
      <div class="table-inner">
        <el-table v-loading="loading" :data="tableData" style="width: 100%; height: 100%" border>
          <el-table-column type="index" label="序号" align="center" width="60">
            <template #default="{ $index }">
              {{ getIndex($index) }}
            </template>
          </el-table-column>
          <el-table-column prop="passportNo" label="护照号" align="center" width="150" />
          <el-table-column prop="trName" label="姓名" align="center" />
          <el-table-column prop="trPinYin" label="英文名" align="center" width="150" />
          <el-table-column prop="trPhone" label="手机号" align="center" width="120" />
          <el-table-column prop="trTmpPhone" label="临时手机号" align="center" width="120" />
          <el-table-column prop="trSex" label="性别" align="center" width="70" />
          <el-table-column prop="trBirthday" label="出生日期" align="center" width="120" />
          <el-table-column prop="trBorAdd" label="出生地" align="center" width="120" />
          <el-table-column prop="trNation" label="国籍" align="center" width="120" />
          <el-table-column prop="travelName" label="旅行社" align="center" />
          <el-table-column prop="operator" label="操作" width="200px" align="center" fixed="right">
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
    <TravellerDialog ref="travellerDialog" :get-data="getData" />
  </div>
</template>
<script lang="ts" setup>
  import { ElMessageBox, ElMessage, FormInstance } from 'element-plus'
  import { Search } from '@element-plus/icons-vue'
  import { onMounted, reactive, ref } from 'vue'
  import TravellerDialog from './travellerDialog.vue'
  import service from '@/api/request'
  import { Page } from '@/types/page'
  import { Traveller } from '@/types/traveller'

  const tableData = ref<Traveller[]>([])
  const dialogVisible = ref(false)
  const travellerDialog = ref()
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
    size: 5,
  })
  const pageSizes = reactive([3, 5, 10, 20, 30, 50, 100])

  //索引
  const getIndex = (index: number) => {
    return index + 1 + (resPage.value.pageNum - 1) * resPage.value.pageSize
  }

  //展示
  const getData = async () => {
    //获取表格数据
    const res = await service({
      method: 'get',
      url: 'base/traveller/list',
      params: page,
    })
    resPage.value = { ...res.data.page }
    tableData.value = resPage.value.list
    tableData.value.forEach((item) => {
      if (item.trSex == 1) item.trSex = '男'
      else item.trSex = '女'
    })
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
    travellerDialog.value.show()
  }
  const editHandler = (row) => {
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
    setTimeout(() => {
      loading.value = false
      getData()
    }, 200)
  })
</script>
<style lang="scss" scoped>
  @import '../index';
</style>
