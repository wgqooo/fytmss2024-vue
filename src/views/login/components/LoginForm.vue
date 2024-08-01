<template>
  <div class="login-title">
    <img class="icon" src="@/assets/image/building.png" alt="logo" />
    <h2 class="title">抚远港务售票局</h2>
  </div>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
    <el-form-item label="" prop="username">
      <el-input
        v-model="ruleForm.username"
        placeholder="请输入用户名"
        auto-complete="on"
        style="position: relative"
        @keyup.enter="submitForm(ruleFormRef)"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><UserFilled /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item label="" prop="password">
      <el-input
        v-model="ruleForm.password"
        placeholder="请输入密码"
        auto-complete="on"
        :type="passwordType"
        @keyup.enter="submitForm(ruleFormRef)"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><GoodsFilled /></el-icon>
        </template>
        <template #suffix>
          <div class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </div>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item style="width: 100%">
      <el-button :loading="loading" class="login-btn" type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
  import { ref, reactive } from 'vue'
  import type { FormInstance } from 'element-plus'
  import { ElMessage, ElNotification } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/store/modules/user'
  import { getTimeStateStr } from '@/utils/index'
  import service from '@/api/request'

  const router = useRouter()
  const UserStore = useUserStore()
  const ruleFormRef = ref<FormInstance>()
  const passwordType = ref('password')
  const loading = ref(false)

  const rules = reactive({
    password: [{ required: true, message: '请输入用户名(4~30字符)', min: 4, max: 30, trigger: 'blur' }],
    username: [{ required: true, message: '请输入密码(4~30字符)', min: 4, max: 30, trigger: 'blur' }],
  })

  // 表单数据
  const ruleForm = reactive({
    //真实姓名
    name: '',
    //员工编号
    username: '',
    password: '',
  })

  // 显示密码图标
  const showPwd = () => {
    passwordType.value = passwordType.value === 'password' ? '' : 'password'
  }

  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        loading.value = true
        // 登录
        service.post('sys/login', JSON.stringify(ruleForm)).then((response) => {
          if (response.data.code == 0) {
            //localStorage.name = JSON.stringify(response.data.name)
            ruleForm.name = response.data.name
            //存储用户信息和token
            UserStore.login(ruleForm)
            router.push({
              path: '/',
            })
            ElNotification({
              title: getTimeStateStr(),
              message: '欢迎登录 抚远售票系统',
              type: 'success',
              duration: 3000,
            })
          } else {
            ElMessage.error(response.data.msg)
            loading.value = false
          }
        })
      } else {
        console.log('error submit!')
        return false
      }
    })
  }
</script>

<style lang="scss" scoped>
  @import '../index.scss';
</style>
