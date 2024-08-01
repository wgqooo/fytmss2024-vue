<template>
  <div class="app-container">
    <div class="header">
      <el-form ref="ruleFormRef" :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="formInline['roleName']" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="onSubmit">查询</el-button>
          <el-button @click="reset(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="util">
        <el-button type="primary" @click="addRole">
          <el-icon><Plus /></el-icon>
          新增角色
        </el-button>
      </div>
    </div>
    <div class="footer">
      <div class="table-inner">
        <el-table v-loading="loading" :data="tableData" style="width: 100%" border>
          <el-table-column prop="roleId" label="角色编号" align="center" />
          <el-table-column prop="roleCname" label="角色名称" align="center">
            <template #default="scope">
              <el-tag size="large">{{ scope.row.roleCname }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="roleEname" label="角色标识" align="center">
            <template #default="scope">
              <el-tag size="large" type="warning" effect="plain">{{ scope.row.roleEname }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240" align="center">
            <template #default="scope">
              <el-button type="success" size="small" icon="Edit" @click="edit(scope.row)"> 更改权限 </el-button>
              <el-button type="danger" size="small" icon="Delete" @click="del(scope.row)"> 删除角色 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <RoleDrawer ref="roleDrawer" :get-data="getData" />
  </div>
</template>

<script lang="ts" setup>
  import { ElMessageBox, FormInstance } from 'element-plus'
  import { onMounted, reactive, ref } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import RoleDrawer from './components/roleDrawer.vue'
  import service from '@/api/request'

  const tableData = ref()
  const loading = ref(true)
  const roleDrawer = ref()
  const formSize = ref('default')
  const ruleFormRef = ref<FormInstance>()
  const formInline = reactive({})

  const getData = async () => {
    //获取表格数据
    const res = await service({
      method: 'get',
      url: 'base/role/list',
    })
    tableData.value = res.data.roles
  }

  const onSubmit = () => {
    console.log('submit!', formInline)
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 500)
  }

  const reset = (formEl: FormInstance | undefined) => {
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 500)
  }
  const addRole = () => {
    roleDrawer.value.show()
  }

  const edit = (row) => {
    roleDrawer.value.show(row)
  }

  const del = (row) => {
    ElMessageBox.confirm('你确定要删除当前项吗?', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    })
      .then(() => {})
      .catch(() => {})
  }

  onMounted(() => {
    setTimeout(() => {
      loading.value = false
      getData()
    }, 500)
  })
</script>

<style scoped lang="scss">
  .header {
    display: flex;
    padding: 16px 16px 0px 16px;
    margin-bottom: 16px;
    border-radius: 4px;
    background: white;
    box-shadow: 0 0 12px rgb(0 0 0 / 5%);
    .util {
      margin-bottom: 15px;
      display: flex;
      justify-content: flex-end;
      flex-shrink: 0;
    }
  }
  .footer {
    flex: 1;
    display: flex;
    padding: 16px;
    flex-direction: column;
    border-radius: 4px;
    overflow: hidden;
    background: white;
    box-shadow: 0 0 12px rgb(0 0 0 / 5%);
    position: relative;
    box-sizing: border-box;
    .table-inner {
      flex: 1;
      position: relative;
    }
    .table {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
