<template>
  <div class="card-container">
    <el-card class="card-box">
      <template #header>
        <div class="header">
          <span>修改密码</span>
        </div>
      </template>
      <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="100px">
        <el-form-item label="账户">
          <el-input :value="passwordForm.username" disabled>
            <template #prefix>
              <el-icon class="el-input__icon"><UserFilled /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input v-model="passwordForm.currentPassword" :type="passwordType" auto-complete="off">
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
        <el-form-item label="新密码" prop="password">
          <el-input v-model="passwordForm.password" type="password" auto-complete="new-password"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" auto-complete="new-password"></el-input>
        </el-form-item>
      </el-form>
      <el-button class="card-btn" @click="handleSubmit(passwordFormRef)">确认</el-button>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
  import { ElMessage, FormInstance } from 'element-plus'
  import { reactive, ref } from 'vue'
  import { useUserStore } from '@/store/modules/user'
  import service from '@/api/request'

  const UserStore = useUserStore()
  const passwordFormRef = ref<FormInstance>()
  const passwordType = ref('password')
  const passwordForm = reactive({
    username: UserStore.userInfo['username'],
    currentPassword: '',
    password: '',
    confirmPassword: '',
  })

  //校验密码
  const checkPassword = (rule: any, value: string, callback: any) => {
    if (value === '') {
      callback(new Error('请输入原密码'))
    } else if (passwordForm.currentPassword !== UserStore.userInfo['password']) {
      callback(new Error('密码错误'))
    } else {
      callback()
    }
  }
  //确认密码校验函数
  const checkConfirmPassword = (rule: any, value: string, callback: any) => {
    if (value === '') {
      callback(new Error('请再次输入新密码'))
    } else if (passwordForm.password !== passwordForm.confirmPassword) {
      callback(new Error('两次输入的密码不一致'))
    } else {
      callback()
    }
  }
  const passwordRules = {
    currentPassword: [{ required: true, validator: checkPassword, trigger: 'blur' }],
    password: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { min: 5, message: '新密码长度不能少于5位', trigger: 'blur' },
    ],
    confirmPassword: [{ required: true, validator: checkConfirmPassword, trigger: 'blur' }],
  }

  // 显示密码图标
  const showPwd = () => {
    passwordType.value = passwordType.value === 'password' ? '' : 'password'
  }

  // 处理表单提交
  const handleSubmit = (formRef: FormInstance | undefined) => {
    // 校验表单
    formRef.validate((valid: boolean) => {
      if (valid) {
        // 在这里可以编写发送请求修改密码的逻辑，这里只是示例
        service({
          method: 'put',
          url: 'base/user/password',
          data: JSON.stringify(passwordForm),
        }).then((res) => {
          if (res.data.code === 0) {
            // 清空表单
            passwordForm.currentPassword = ''
            passwordForm.password = ''
            passwordForm.confirmPassword = ''
            // 提示用户密码修改成功，这里使用 Element-Plus 的 Message 组件
            ElMessage.success('密码修改成功')
          }
        })
      } else {
        console.log('表单校验失败')
        return false
      }
    })
  }
</script>

<style scoped lang="scss">
  @import './index';
</style>
