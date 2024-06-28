<template>
  <div class="m-user-table">
    <div class="header">
      <el-form ref="ruleFormRef" :inline="true" :model="formInline">
        <el-form-item label="用户名" prop="username">
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
          新增船只
        </el-button>
      </div>
      <div class="table-inner">
        <el-table v-loading="loading" :data="tableData" style="width: 100%; height: 100%" border>
          <el-table-column type="index" label="序号" align="center" width="60">
            <template #default="{ $index }">
                {{ getIndex($index) }}
            </template>
          </el-table-column>
          <el-table-column prop="legalNo" label="工商号" align="center"  />
          <el-table-column prop="travelName" label="旅行社名" align="center"  />
          <el-table-column prop="legalName" label="法人姓名" align="center"/>
          <el-table-column prop="legalPhone" label="法人手机号" align="center" />
          <el-table-column prop="money" label="余额" align="center" width="120" />
          <el-table-column prop="legalState" label="状态" align="center" width="120">
            <template #default="scope">
              <el-switch
                v-model="scope.row.legalState"
                inline-prompt
                :active-value="'1'"
                :inactive-value="'0'"
                active-text="启用"
                inactive-text="禁用"
                @click="changeStatus(scope.row)"
              />
            </template>
          </el-table-column>
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
    <TravelDialog ref="travelDialog" :getData="getData"/>
  </div>
</template>
<script lang="ts" setup>
  import { ElMessageBox, ElMessage, FormInstance } from 'element-plus'
  import { Search } from '@element-plus/icons-vue'
  import { onMounted, reactive, ref } from 'vue'
  import TravelDialog from './travelDialog.vue'
  import service from '@/api/request'
  import { Page } from '@/types/page'
  import { Ship } from '@/types/ship'

  const tableData = ref<Ship[]>([])
  const dialogVisible = ref(false)
  const travelDialog = ref()
  const ruleFormRef = ref<FormInstance>()
  const formInline = reactive({})
  const loading = ref(true)

  const resPage = ref<Page>({
    size:0,
    pageSize:0,
    total:0,
    prePage:0,
    nextPage:0,
    pages:0,
    pageNum:0,
    navigatePages:0,
    list:[]
  })
  const page = reactive({
    index: 1,
    size: 5,
  })
  const pageSizes = reactive([3,5,10,20,30,50,100])

  //索引
  const getIndex = (index: number) => {
    return index + 1 + (resPage.value.pageNum - 1) * resPage.value.pageSize
  }

  //展示
  const getData = async () => {
    //获取表格数据
    const res = await service({
      method: 'get',
      url: "base/travel/list",
      params: page
    });
    resPage.value = {...res.data.page}
    tableData.value = resPage.value.list;
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
    travelDialog.value.show()
  }
  const editHandler = (row) => {
    travelDialog.value.show(row)
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
        method:'delete',
        url:'base/travel/delete',
        //在axios接口封装是接收参数是一个object类型，不能直接params或者data当成一个属性或者直接赋值
        params:{
          legalNo:row.legalNo
        }}).then(
        response => {
          if(response.data.code == 0){
            ElMessage.success(response.data.msg)
            getData()
          }else {
            ElMessage.error(response.data.msg)
          }
        })
      })
      .catch(() => {})
  }

  const handleSizeChange = (val: number) => {
    page.index = 1;
    page.size = val;
    getData();
  }

  const handleCurrentChange = (val: number) => {
    page.index = val;
    getData();
  }

  const changeStatus = (row) => {
    ElMessageBox.confirm(`确定要${row.legalState=='0' ? '禁用' : '启用'} ${row.travelName} 账户吗？`, '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        await service({
          method:'put',
          url:'base/travel/enable',
          params:{
            legalState:row.legalState,
            legalNo:row.legalNo
          }
        })
      })
      .catch(() => {
        row.legalState = row.legalState == '1' ? '0' : '1';
      })
  }

  onMounted(() => {
    setTimeout(() => {
      loading.value = false
      getData();
    }, 200)
  })
</script>

<style lang="scss" scoped>
  @import '../index';
</style>
