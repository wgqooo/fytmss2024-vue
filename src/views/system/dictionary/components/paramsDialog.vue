<template>
  <el-dialog v-model="dialogVisible" :title="title" width="50%" @close="close">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item label="参数类型" prop="dtype">
        <el-input v-model="ruleForm.dtype" placeholder="请输入参数类型" :disabled="disabledProp" />
      </el-form-item>
      <el-form-item label="参数编码" prop="dcode">
        <el-input v-model="ruleForm.dcode" placeholder="请输入参数编码" :disabled="disabledProp" />
      </el-form-item>
      <el-form-item label="参数说明" prop="cpara">
        <el-input v-model="ruleForm.cpara" placeholder="请输入参数说明" />
      </el-form-item>
      <el-form-item label="参数值" prop="dvalue">
        <el-input v-model="ruleForm.dvalue" placeholder="请输入参数值" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleClose(ruleFormRef)">确定</el-button>
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
  const disabledProp = ref(false)
  const title = ref('新增系统参数')

  const rules = reactive({
    dtype: [{ required: true, message: '请输入参数类型', trigger: 'blur' }],
    dcode: [{ required: true, message: '请输入参数编码', trigger: 'blur' }],
    cpara: [{ required: true, message: '请输入参数描述', trigger: 'blur' }],
    dvalue: [{ required: true, message: '请输入参数值', trigger: 'blur' }],
  })

  const ruleForm = reactive({
    dtype: '',
    dcode: '',
    cpara: '',
    dvalue: '',
  })

  function close() {
    ruleFormRef.value.resetFields()
    Object.keys(ruleForm).forEach((key) => {
      ruleForm[key] = null
    })
    disabledProp.value = false
  }

  const show = (item = {}) => {
    title.value = '新增系统参数'
    if (item['dtype']) {
      title.value = '编辑系统参数'
      disabledProp.value = true
      Object.keys(item).forEach((key) => {
        ruleForm[key] = item[key]
      })
    }
    dialogVisible.value = true
  }

  const handleClose = (done: () => void) => {
    ruleFormRef.value.validate(async (valid, fields) => {
      if (valid) {
        if (title.value == '新增系统参数') {
          console.log(JSON.stringify(ruleForm))
          await service({
            method: 'post',
            url: 'sys/syspara/save',
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
            url: 'sys/syspara/update',
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
