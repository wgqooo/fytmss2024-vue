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
          <el-table-column label="操作" width="500" align="center">
            <template #default="scope">
              <el-button style="margin-right: 20px" type="success" size="small" icon="EditPen" @click="editAuth(scope.row)">
                更改权限
              </el-button>
              <el-button style="margin-right: 20px" type="warning" size="small" icon="Edit" @click="editRole(scope.row)">
                编辑角色
              </el-button>
              <el-button type="danger" size="small" icon="Delete" @click="delRole(scope.row)"> 删除角色 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <RoleDrawer ref="roleDrawer" :get-data="getData" :clear-tree-status="clearTreeStatus" />
    <RoleDialog ref="roleDialog" :get-data="getData"></RoleDialog>
  </div>
</template>

<script lang="ts" setup>
  import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
  import { onMounted, reactive, ref } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import RoleDrawer from './components/roleDrawer.vue'
  import RoleDialog from './components/roleDialog.vue'
  import service from '@/api/request'
  import { asyncRoutes } from '@/routers'

  const tableData = ref()
  const loading = ref(true)
  const roleDrawer = ref()
  const roleDialog = ref()
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
    roleDialog.value.show()
  }
  const editRole = (row) => {
    roleDialog.value.show(row)
  }

  //menuIds控制子节点勾选
  let menuIds = ref([])
  //parentIds控制菜单的展开（勾选中的才展开，虽然功能有些鸡肋，但是很细节）
  let parentIds = ref([])
  const editAuth = async (row) => {
    roleDrawer.value.show(row)
    await judgeAuth(asyncRoutes, row['roleCname'])
    roleDrawer.value.settingTreeOpt(parentIds.value, menuIds.value)
  }
  const judgeAuth = async (routes, role) => {
    for (const route of routes) {
      const res = await service({
        method: 'get',
        url: 'sys/auth/roles',
        params: {
          menuId: route.menuId,
        },
      })
      route.meta.roleArr = res.data.roles
      if (hasAuth(role, route, res.data.roles)) {
        if (route.children) {
          await judgeAuth(route.children, role)
          parentIds.value.push(route.menuId)
        } else {
          //保持父亲节点的复选框半选状态
          menuIds.value.push(route.menuId)
        }
      }
    }
  }
  function hasAuth(role, route, roleArr) {
    if (route.meta && route.meta.roleArr) {
      return roleArr.includes(role)
    } else return false
  }

  const clearTreeStatus = (tree) => {
    parentIds.value.forEach((id) => {
      tree.getNode(id).expanded = false
    })
    ;(menuIds.value = []), (parentIds.value = [])
  }

  const delRole = (row) => {
    ElMessageBox.confirm(
      `确认删除 <span style="color: red; font-size: 18px; font-weight: bold">${row.roleCname}</span> 角色吗？`,
      '考虑一下',
      { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning', dangerouslyUseHTMLString: true },
    ).then(() => {
      service({
        method: 'delete',
        url: 'base/role/delete',
        params: {
          roleId: row.roleId,
        },
      }).then((res) => {
        if (res.data.code === 0) ElMessage.success(res.data.msg)
        getData()
      })
    })
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
