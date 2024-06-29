<template>
  <el-dialog v-model="dialogVisible" :title="title" width="50%" @close="close">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item label="日期选择" prop="voyDate">
        <el-date-picker
          v-model="ruleForm.voyDate"
          type="date"
          placeholder="请选择日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :disabled-date="disabledDate"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="船次" prop="voyNo">
        <el-select v-model="ruleForm.voyNo" filterable allow-create clearable placeholder="请输入或选择船次" @click="queryAllVoyNo">
          <el-option v-for="voyNo in allVoyNo" :label="voyNo" :value="voyNo"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计划船" prop="shipNo">
        <el-select v-model="ruleForm.shipNo" filterable allow-create clearable placeholder="请选择或输入计划船" @click="queryAllShipNames">
          <el-option v-for="ship in ships" :label="ship.shipName" :value="ship.shipNo"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出发时间" prop="startTime">
        <el-time-picker v-model="ruleForm.startTime" format="HH:mm:ss" value-format="HH:mm:ss" placeholder="请选择出发时间" />
      </el-form-item>
      <el-form-item label="出发港口" prop="startPort">
        <el-select v-model="ruleForm.startPort">
          <el-option label="抚远" :value="0"></el-option>
          <el-option label="哈巴洛夫斯克" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="VIP预留" prop="vipRes">
        <el-input v-model="ruleForm.vipRes" placeholder="请输入预留数量" />
      </el-form-item>
      <el-form-item label="一等预留" prop="firRes">
        <el-input v-model="ruleForm.firRes" placeholder="请输入预留数量" />
      </el-form-item>
      <el-form-item label="二等预留" prop="secRes">
        <el-input v-model="ruleForm.secRes" placeholder="请输入预留数量" />
      </el-form-item>
      <!-- <el-form-item label="状态" prop="voyState">
        <el-radio-group v-model="ruleForm.voyState">
          <el-radio :value="0" border>冻结</el-radio>
          <el-radio :value="1" border>生效</el-radio>
          <el-radio :value="2" border>停运</el-radio>
        </el-radio-group>
      </el-form-item> -->
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
  import { getCurrentDate, getCurrentTime } from '@/utils/dateFormat'
  import { ElMessageBox, ElMessage, FormInstance } from 'element-plus'
  import { reactive, ref } from 'vue'

  const props = defineProps({
    getData: {
      type: Function,
    },
  })

  const ruleFormRef = ref<FormInstance>()
  const dialogVisible = ref<boolean>(false)
  const ships = ref<[]>()
  const allVoyNo = ref<string[]>()

  const title = ref('添加航次')

  const rules = reactive({
    voyDate: [{ required: true, message: '请选择日期', trigger: 'blur' }],
    voyNo: [{ required: true, message: '请输入船次', trigger: 'blur' }],
    shipNo: [{ required: true, message: '请输入或选择计划船', trigger: 'change' }],
    startTime: [{ required: true, message: '请选择时间', trigger: 'blur' }],
    startPort: [{ required: true, message: '请选择出发港口', trigger: 'change' }],
    vipRes: [{ required: true, message: '请输入VIP预留', trigger: 'blur' }],
    firRes: [{ required: true, message: '请输入一等预留', trigger: 'blur' }],
    secRes: [{ required: true, message: '请输入二等预留', trigger: 'blur' }],
  })

  const ruleForm = reactive({
    voyDate: getCurrentDate(),
    voyNo: '',
    shipNo: '',
    reShipNo: '',
    startTime: '09:00:00',
    startPort: 0,
    firRes: 0,
    secRes: 0,
    vipRes: 0,
    firVisa: 340,
    secVisa: 290,
    vipVisa: 390,
    firPrice: 340,
    secPrice: 290,
    vipPrice: 390,
    voyState: 0,
  })

  //const

  const disabledDate = (date) => {
    const today = new Date() // 获取当前日期
    today.setHours(0, 0, 0, 0) // 将时间设置为0时0分0秒0毫秒，即当天的开始时间
    return date.getTime() < today.getTime() // 禁用过去的日期
  }

  const queryAllShipNames = () => {
    service.get('base/ship/listAllShips').then((response) => {
      //提取所有船名
      ships.value = response.data.ships
    })
  }
  const queryAllVoyNo = () => {
    service.get('voyage/voyageManage/listAllVoyNo').then((response) => {
      //提取所有船名
      allVoyNo.value = response.data.voyNos
    })
  }

  function close() {
    ruleFormRef.value.resetFields()
    Object.keys(ruleForm).forEach((key) => {
      if (key === 'voyDate') ruleForm[key] = getCurrentDate()
      else if (key === 'startPort') ruleForm[key] = 0
      else if (key === 'startTime') ruleForm[key] = '09:00:00'
    })
  }

  const show = (item = {}) => {
    title.value = '添加航次'
    dialogVisible.value = true
  }

  const handleClose = (done: () => void) => {
    ruleFormRef.value.validate(async (valid, fields) => {
      if (valid) {
        if (title.value == '添加航次') {
          //console.log(JSON.stringify(ruleForm))
          await service({
            method: 'post',
            url: 'voyage/voyageManage/save',
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
