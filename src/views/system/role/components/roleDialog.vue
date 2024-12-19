<template>
  <el-dialog v-model="dialogVisible" :title="title" width="50%" @close="close">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item label="角色名称" prop="roleCname">
        <el-input v-model="ruleForm.roleCname" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="角色标识" prop="roleEname">
        <el-input v-model="ruleForm.roleEname" placeholder="请输入角色标识" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleClose">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  import service from '@/api/request'
  import { ElMessage, FormInstance } from 'element-plus'
  import { reactive, ref } from 'vue'

  const props = defineProps({
    getData: {
      type: Function,
    },
  })

  const ruleFormRef = ref<FormInstance>()
  const dialogVisible = ref<boolean>(false)
  const title = ref('新增角色')

  const rules = reactive({
    roleCname: [{ required: true, message: '请输入参数类型', trigger: 'blur' }],
    roleEname: [{ required: true, message: '请输入参数编码', trigger: 'blur' }],
  })

  const ruleForm = reactive({
    roleCname: '',
    roleEname: '',
  })

  function close() {
    ruleFormRef.value.resetFields()
    Object.keys(ruleForm).forEach((key) => {
      ruleForm[key] = null
    })
  }

  const show = (item = {}) => {
    title.value = '新增角色'
    if (item['roleCname']) {
      title.value = '编辑角色'
      Object.keys(item).forEach((key) => {
        ruleForm[key] = item[key]
      })
    }
    dialogVisible.value = true
  }

  const handleClose = () => {
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
            } else if (response.data.code == 500) {
              ElMessage.error(response.data.msg)
            } else if (response.data.code == 400) {
              ElMessage.error(response.data.msg)
            }
          })
        } else {
          await service({
            method: 'post',
            url: 'base/role/update',
            data: JSON.stringify(ruleForm),
          }).then((response) => {
            if (response.data.code == 0) {
              ElMessage.success(response.data.msg)
              props.getData()
            } else if (response.data.code == 500) {
              ElMessage.error(response.data.msg)
            } else if (response.data.code == 400) {
              ElMessage.error(response.data.msg)
            }
          })
        }
        dialogVisible.value = false
      } else {
        console.log('error submit!', fields)
      }
    })
  }

  defineExpose({
    show,
  })
</script>

<style lang="scss" scoped></style>
