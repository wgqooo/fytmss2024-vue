<template>
  <el-drawer v-model="dialogVisible" size="50%" @close="close">
    <template #header>
      <div class="drawer-title">
        <el-tag size="large">{{ title }}</el-tag>
      </div>
    </template>
    <template #default>
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleCname">
          <el-input v-model="ruleForm.roleCname" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色标识" prop="roleEname">
          <el-input v-model="ruleForm.roleEname" placeholder="请输入角色标识" />
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree :data="menuData" show-checkbox node-key="id" :props="defaultProps" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleClose(ruleFormRef)">确定</el-button>
      </span>
    </template>
  </el-drawer>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { ElMessage, FormInstance } from 'element-plus'
  import { menuData } from '@/mock/system'
  import service from '@/api/request'

  const ruleFormRef = ref<FormInstance>()
  const dialogVisible = ref(false)
  const title = ref('新增角色')
  const ruleForm = reactive({
    roleCname: '',
    roleEname: '',
  })
  const props = defineProps({
    getData: {
      type: Function,
    },
  })
  const defaultProps = {
    children: 'children',
    label: 'menuName',
  }

  function close() {
    ruleFormRef.value.resetFields()
    Object.keys(ruleForm).forEach((key) => {
      if (key === 'status') ruleForm[key] = true
      else ruleForm[key] = null
    })
  }

  const show = (item = {}) => {
    title.value = '新增角色'
    if (item['roleId']) {
      title.value = '更改权限'
      Object.keys(item).forEach((key) => {
        ruleForm[key] = item[key]
      })
    }
    dialogVisible.value = true
  }

  const rules = reactive({
    roleCname: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    roleEname: [{ required: true, message: '请输入角色标识', trigger: 'blur' }],
  })

  const handleClose = (done: () => void) => {
    ruleFormRef.value.validate(async (valid, fields) => {
      if (valid) {
        if (title.value == '新增角色') {
          await service({
            method: 'post',
            url: 'base/role/save',
            data: JSON.stringify(ruleForm),
          }).then((response) => {
            if (response.data.code == 0) {
              ElMessage.success(response.data.msg)
              props.getData()
            } else {
              ElMessage.error(response.data.msg)
            }
          })
        } else {
          await service({
            method: 'post',
            url: 'base/user/update',
            data: JSON.stringify(ruleForm),
          }).then((response) => {
            if (response.data.code == 0) {
              ElMessage.success(response.data.msg)
              props.getData()
            } else {
              ElMessage.error(response.data.msg)
            }
          })
        }
        dialogVisible.value = false
        console.log('submit!')
      } else {
        console.log('error submit!', fields)
      }
    })
  }

  defineExpose({
    show,
  })
</script>

<style lang="scss" scoped>
  .drawer-title {
    font-weight: bolder;
  }
</style>
