<template>
  <el-dialog v-model="dialogVisible" :title="title" width="50%" @close="close">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item label="员工编号" prop="empNo">
        <el-input v-model="ruleForm.empNo" placeholder="请输入员工编号" />
      </el-form-item>
      <el-form-item label="员工姓名" prop="empName">
        <el-input v-model="ruleForm.empName" placeholder="请输入员工姓名" />
      </el-form-item>
      <el-form-item label="性别" prop="empSex">
        <el-radio-group v-model="ruleForm.empSex">
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="出生日期" prop="empBirthday">
        <el-date-picker v-model="ruleForm.empBirthday" placeholder="请输入生日" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="手机号码" prop="empMobile">
        <el-input v-model="ruleForm.empMobile" placeholder="请输入手机号码" />
      </el-form-item>
      <el-form-item label="家庭住址" prop="empAddress">
        <el-input v-model="ruleForm.empAddress" disabled></el-input>
        <el-cascader style="width: fit-content" clearable :options="region" @change="handleRegionChange"> </el-cascader>
      </el-form-item>
      <el-form-item label="职务" prop="roleName">
        <el-select v-model="ruleForm.roleName" placeholder="请选择" style="width: 100%" @click="queryAllRoles">
          <el-option v-for="roleName in roleNames" :label="roleName" :value="roleName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="enabled">
        <el-switch
          v-model="ruleForm.enabled"
          inline-prompt
          :active-value="1"
          :inactive-value="0"
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
  import region from '@/utils/ChinaCityJSON'
  const handleRegionChange = (val: []) => {
    //数组合成字符串
    ruleForm.empAddress = val.join('')
  }

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
    empNo: [
      { required: true, message: '请输入员工编号', trigger: 'blur' },
      { min: 4, max: 30, message: '长度在 4 到 30 个字符', trigger: 'blur' },
    ],
    empName: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
    empSex: [{ required: true, message: '请选择性别', trigger: 'change' }],
    empBirthday: [{ required: true, message: '请选择出生日期', trigger: 'blur' }],
    empMobile: [{ required: true, pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }],
    empAddress: [{ required: true, message: '请选择完整的省市辖区', trigger: 'blur' }],
    roleName: [{ required: true, message: '请选择角色', trigger: 'change' }],
  })

  const ruleForm = reactive({
    empNo: '',
    empName: '',
    empSex: '男',
    empMobile: '',
    empBirthday: '',
    empAddress: '',
    roleName: '',
    enabled: 0,
  })

  function close() {
    ruleFormRef.value.resetFields()
    Object.keys(ruleForm).forEach((key) => {
      if (key === 'sex') ruleForm[key] = '男'
      else if (key === 'status') ruleForm[key] = true
      else ruleForm[key] = null
    })
  }

  const queryAllRoles = () => {
    service.get('base/role/list').then((response) => {
      //提取所有角色名称
      roleNames.value = response.data.roles.map((role) => role.roleCname)
    })
  }

  const show = (item = {}) => {
    //console.log("item",item)
    title.value = '新增用户'
    if (item.empNo) {
      title.value = '编辑用户'
      Object.keys(item).forEach((key) => {
        ruleForm[key] = item[key]
      })
    }
    dialogVisible.value = true
  }

  const handleClose = (done: () => void) => {
    ruleFormRef.value.validate(async (valid, fields) => {
      if (valid) {
        if (title.value == '新增用户') {
          await service({
            method: 'post',
            url: 'base/user/save',
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
            url: 'base/user/update',
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
