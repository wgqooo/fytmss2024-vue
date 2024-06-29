<template>
  <el-dialog v-model="dialogVisible" :title="title" width="50%" @close="close">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item label="工商号" prop="legalNo">
        <el-input v-model="ruleForm.legalNo" placeholder="请输入工商号" />
      </el-form-item>
      <el-form-item label="旅行社名" prop="travelName">
        <el-input v-model="ruleForm.travelName" placeholder="请输入旅行社名" />
      </el-form-item>
      <el-form-item label="法人姓名" prop="legalName">
        <el-input v-model="ruleForm.legalName" placeholder="请输入法人姓名"></el-input>
      </el-form-item>
      <el-form-item label="法人手机号" prop="legalPhone">
        <el-input v-model="ruleForm.legalPhone" placeholder="请输入法人手机号"></el-input>
      </el-form-item>
      <el-form-item label="余额" prop="money">
        <el-input v-model="ruleForm.money" placeholder="请输入余额"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="ruleForm.legalState"
          inline-prompt
          :active-value="'1'"
          :inactive-value="'0'"
          active-text="启用"
          inactive-text="禁用"
        ></el-switch>
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
  import { ElMessageBox, ElMessage, FormInstance } from 'element-plus'
  import { reactive, ref } from 'vue'

  const props = defineProps({
    getData: {
      type: Function,
    },
  })

  const ruleFormRef = ref<FormInstance>()
  const dialogVisible = ref<boolean>(false)
  const roleNames = ref<string[]>()
  const title = ref('新增用户')

  const rules = reactive({
    legalNo: [{ required: true, message: '请输入工商号', trigger: 'blur' }],
    travelName: [{ required: true, message: '请输入旅行社名', trigger: 'blur' }],
    legalName: [{ required: true, message: '请输入法人姓名', trigger: 'blur' }],
    legalPhone: [{ required: true, pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }],
    money: [
      { required: true, message: '请输入余额', trigger: 'blur' },
      {
        pattern: /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)|(0))$/,
        message: '非法余额',
        trigger: 'blur',
      },
    ],
  })

  const ruleForm = reactive({
    legalNo: '',
    travelName: '',
    legalName: '',
    legalPhone: '',
    money: 0.0,
    legalState: '',
  })

  function close() {
    ruleFormRef.value.resetFields()
    Object.keys(ruleForm).forEach((key) => {
      if (key === 'sex') ruleForm[key] = '男'
      else if (key === 'status') ruleForm[key] = true
      else ruleForm[key] = null
    })
  }

  const show = (item = {}) => {
    //console.log("item",item)
    title.value = '新增旅行社'
    if (item.legalNo) {
      title.value = '编辑旅行社'
      Object.keys(item).forEach((key) => {
        ruleForm[key] = item[key]
      })
    }
    dialogVisible.value = true
  }

  const handleClose = (done: () => void) => {
    ruleFormRef.value.validate(async (valid, fields) => {
      if (valid) {
        if (title.value == '新增旅行社') {
          await service({
            method: 'post',
            url: 'base/travel/save',
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
            url: 'base/travel/update',
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
