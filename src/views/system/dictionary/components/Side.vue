<template>
  <el-card class="m-dept-side">
    <div class="title">参数分类</div>
    <el-input v-model="filterText" placeholder="输入关键字进行过滤" class="filter-search" />
    <div class="filter-tree">
      <el-scrollbar class="scrollbar">
        <p v-for="type in filteredTypes" :key="type" class="scrollbar-item">
          {{ type }}
        </p>
      </el-scrollbar>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
  import { computed, onBeforeMount, onUnmounted, ref } from 'vue'
  import service from '@/api/request'
  import emitter from '@/utils/emitter'

  const types = ref([])
  const filterText = ref('')
  const filteredTypes = computed(() => {
    emitter.emit('filterData', filterText.value)
    return types.value.filter((type) => {
      return type.includes(filterText.value)
    })
  })

  const getTypes = async () => {
    let res = await service({
      method: 'get',
      url: 'sys/syspara/sort',
    })
    types.value = res.data.types
  }

  onBeforeMount(() => {
    emitter.on('updateTypes', () => {
      getTypes()
    })
    getTypes()
  })
  onUnmounted(() => {
    // 解绑事件
    emitter.off('updateTypes')
  })
</script>

<style lang="scss" scoped>
  .scrollbar-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
  }
  @import '../index.scss';
</style>
