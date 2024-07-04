<template>
  <el-drawer v-model="drawer" direction="btt">
    <template #header>
      <h4>选择新增的团员</h4>
    </template>

    <template #footer>
      <div style="flex: auto">
        <!-- <el-button @click="cancelClick">cancel</el-button>
        <el-button type="primary" @click="confirmClick">confirm</el-button> -->
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const drawer = ref(false)
  const show = () => {
    drawer.value = true
  }

  defineExpose({
    show,
  })
</script>

<style scoped></style>
