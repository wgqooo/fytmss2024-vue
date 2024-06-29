<template>
  <el-dialog v-model="dialogVisible" :title="title" width="50%" @close="close">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item label="船舷号" prop="shipNo">
        <el-input v-model="ruleForm.shipNo" placeholder="请输入船舷号" />
      </el-form-item>
      <el-form-item label="船名" prop="shipName">
        <el-input v-model="ruleForm.shipName" placeholder="请输入船名" />
      </el-form-item>
      <el-form-item label="VIP座" prop="vipSeat">
        <el-input v-model="ruleForm.vipSeat" placeholder="请输入VIP座位数量"></el-input>
      </el-form-item>
      <el-form-item label="一等定员" prop="firSeat">
        <el-input v-model="ruleForm.firSeat" placeholder="请输入一等座位数量" />
      </el-form-item>
      <el-form-item label="二等定员" prop="secSeat">
        <el-input v-model="ruleForm.secSeat" placeholder="请输入二等座位数量" />
      </el-form-item>
      <el-form-item label="船型" prop="seatDis">
        <el-select v-model="ruleForm.seatDis" placeholder="请选择">
          <el-option label="50座" :value="'2'"></el-option>
          <el-option label="99座" :value="'1'"></el-option>
          <el-option label="195座" :value="'3'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="shiptimeState">
        <el-select v-model="ruleForm.shiptimeState" placeholder="请选择">
          <el-option label="在港" :value="0"></el-option>
          <el-option label="运行" :value="1"></el-option>
          <el-option label="维修" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属" prop="shipMemo">
        <el-select v-model="ruleForm.shipMemo" placeholder="请选择">
          <el-option label="中国" :value="0"></el-option>
          <el-option label="俄国" :value="1"></el-option>
        </el-select>
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
    shipNo: [{ required: true, message: '请输入船舷号', trigger: 'blur' }],
    shipName: [{ required: true, message: '请输入船名', trigger: 'blur' }],
    vipSeat: [
      { required: true, message: '请输入VIP座位数量', trigger: 'blur' },
      { pattern: /^[0-9]\d*$/, message: '非法的VIP座位数量', trigger: 'blur' },
    ],
    firSeat: [
      { required: true, message: '请输入一等座位数量', trigger: 'blur' },
      { pattern: /^[0-9]\d*$/, message: '非法的一等座位数量', trigger: 'blur' },
    ],
    secSeat: [
      { required: true, message: '请输入二等座位数量', trigger: 'blur' },
      { pattern: /^[0-9]\d*$/, message: '非法的二等座位数量', trigger: 'blur' },
    ],
    seatDis: [{ required: true, message: '请选择船型', trigger: 'blur' }],
    shiptimeState: [{ required: true, message: '请选择状态', trigger: 'blur' }],
    shipMemo: [{ required: true, message: '请选择所属', trigger: 'blur' }],
  })

  const ruleForm = reactive({
    shipNo: '',
    shipName: '',
    vipSeat: 0,
    firSeat: 0,
    secSeat: 0,
    shiptimeState: 0,
    seatDis: '',
    shipMemo: 0,
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
    title.value = '新增船只'
    if (item.shipNo) {
      title.value = '编辑船只'
      Object.keys(item).forEach((key) => {
        ruleForm[key] = item[key]
      })
    }
    dialogVisible.value = true
  }

  const handleClose = (done: () => void) => {
    ruleFormRef.value.validate(async (valid, fields) => {
      if (valid) {
        if (title.value == '新增船只') {
          await service({
            method: 'post',
            url: 'base/ship/save',
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
            url: 'base/ship/update',
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
