<template>
  <el-dialog v-model="dialogVisible" :title="title" width="50%" @close="close">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item label="护照号" prop="passportNo">
        <el-input v-model="ruleForm.passportNo" placeholder="请输入护照号" />
      </el-form-item>
      <el-form-item label="姓名" prop="trName">
        <el-input v-model="ruleForm.trName" placeholder="请输入旅客姓名" />
      </el-form-item>
      <el-form-item label="英文名" prop="trPinYin">
        <el-input v-model="ruleForm.trPinYin" placeholder="请输入旅客英文名(非必填)" />
      </el-form-item>
      <el-form-item label="性别" prop="trSex">
        <el-radio-group v-model="ruleForm.trSex">
          <el-radio :label="1" :value="1">男</el-radio>
          <el-radio :label="0" :value="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="出生日期" prop="trBirthday">
        <el-date-picker v-model="ruleForm.trBirthday" placeholder="请输入生日" 
        format="YYYY-MM-DD" value-format="YYYY-MM-DD"/>
      </el-form-item>
      <el-form-item label="手机号码" prop="trPhone">
        <el-input v-model="ruleForm.trPhone" placeholder="请输入手机号码" />
      </el-form-item>
      <el-form-item label="临时手机号码" prop="trTmpPhone">
        <el-input v-model="ruleForm.trTmpPhone" placeholder="请输入临时手机号码(非必填)" />
      </el-form-item>
      <el-form-item label="出生地" prop="trBorAdd">
        <el-input v-model="ruleForm.trBorAdd"></el-input>
      </el-form-item>
      <el-form-item label="国籍" prop="trNation">
        <el-select placeholder="请选择国籍(可搜索)" filterable style="width: 77.9%" v-model="ruleForm.trNation">
          <el-option-group v-for="group in nation" :key="group.label" :label="group.label">
            <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.en }}</span>
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="旅行社" prop="trTravel">
        <el-input disabled v-model="ruleForm.trTravel"></el-input>
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
  import { onMounted, reactive, ref } from 'vue'
  import nation from '@/utils/nation';
   
  
  const { getData } = defineProps({
    getData:{
      type:Function
    }
  })

  const ruleFormRef = ref<FormInstance>()
  const dialogVisible = ref<boolean>(false)
  const roleNames = ref<string[]>()
  const title = ref('新增旅客')

  const rules = reactive({
    passportNo: [
      { required: true, message: '请输入护照号', trigger: 'blur' },
    ],
    trName: [{ required: true, message: '请输入旅客姓名', trigger: 'blur' }],
    trPinYin: [{ required: false, message: '请输入英文名', trigger: 'change' }],
    trSex: [{ required: true, message: '请选择性别', trigger: 'change' }],
    trBirthday: [{ required: true, message: '请选择出生日期', trigger: 'blur' }],
    trPhone: [{required: false},{ pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }],
    trTmpPhone: [{required: false},{ pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }],
    trBorAdd: [{required: false},{ message: '请输入出生地', trigger: 'blur' }],
    trNation: [{required: true, message: '请选择国籍', trigger: 'blur' }],
  })

  const ruleForm = reactive({
    passportNo: '',
    trName: '',
    trPinYin: '',
    trPhone: '',
    trTmpPhone: '',
    trSex: 0,
    trBirthday: '',
    trBorAdd: '',
    trNation: '',
    trTravel: ''
  })

  function close() {
    ruleFormRef.value.resetFields()
    Object.keys(ruleForm).forEach((key) => {
      if (key === 'trSex') ruleForm['trSex'] = 1
      else if (key === 'status') ruleForm[key] = true
      else ruleForm[key] = null
    })
  }

  const show = (item = {}) => {
    title.value = '新增旅客'
    if (item.passportNo) {
      title.value = '编辑旅客'
      Object.keys(item).forEach((key) => {
         ruleForm[key] = item[key]
      })
    }
    //还没有对不同旅行社进行细分
    ruleForm['trTravel'] = '000000'
    dialogVisible.value = true
  }

  const handleClose =  (done: () => void) => {
     ruleFormRef.value.validate(async (valid, fields) => {
      if (valid) {
        if(title.value == '新增旅客'){
          await service({
          method:'post',
          url:'base/traveller/save',
          data:JSON.stringify(ruleForm)
          }).then( response => {
            if(response.data.code == 0){
              ElMessage.success(response.data.msg)
              getData()
            }else if(response.data.code == 500){
              ElMessage.error(response.data.msg)
            }else if(response.data.code == 400){
              ElMessage.error(response.data.msg)
            }
          })
        }else{
          await service({
          method:'post',
          url:'base/traveller/update',
          data:JSON.stringify(ruleForm)
          }).then( response => {
            if(response.data.code == 0){
              ElMessage.success(response.data.msg)
              getData()
            }else if(response.data.code == 500){
              ElMessage.error(response.data.msg)
            }else if(response.data.code == 400){
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

  // onMounted(() => {
  //   if()
  // })
</script>

<style lang="scss" scoped>
</style>
