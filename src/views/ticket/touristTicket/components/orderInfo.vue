<template>
  <div ref="appContainer" class="app-container">
    <div class="header">
      <div>
        <label style="margin-right: 10px">导出格式</label>
        <el-select v-model="format" class="m-2" placeholder="导出格式" style="width: 100px; margin-right: 10px">
          <el-option label="xlsx" value="xlsx" />
          <el-option label="csv" value="csv" />
        </el-select>
      </div>
      <el-button type="primary" @click="exportExcelAction">
        <el-icon :size="15" style="margin-right: 6px"><Download /></el-icon>导出散客订单(本页)
      </el-button>
    </div>
    <PropTable
      :show-search="showSeacrch"
      :loading="loading"
      :columns="baseColumns"
      :data="props.order"
      @reset="reset"
      @on-submit="onSubmit"
    >
    </PropTable>
  </div>
</template>
<script lang="ts" setup name="comprehensive">
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import { columns } from './constants'
  import PropTable from '@/components/Table/PropTable/index.vue'
  import { exportExcel } from '@/utils/exprotExcel'
  const props = defineProps({
    order: {
      type: Array,
      default: () => [],
    },
  })

  //导出数据相关
  const format = ref('xlsx')
  const exportExcelAction = async () => {
    await exportExcel({
      //去掉第一列的选择框和第二列的序号框和最后一列的操作框
      column: baseColumns.slice(1, -1),
      data: props.order,
      filename: '散客购票数据',
      format: format.value,
      autoWidth: true,
    })
  }

  const showSeacrch = ref(false)
  const loading = ref(true)
  const appContainer = ref(null)

  let baseColumns = reactive(columns)

  const reset = () => {
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 500)
    ElMessage.success('触发重置方法')
  }

  const onSubmit = (val) => {
    ElMessage.success('触发查询方法')
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 500)
  }

  onMounted(() => {
    setTimeout(() => {
      loading.value = false
    }, 200)
  })
</script>

<style scoped>
  .header {
    display: flex;
    padding: 16px 16px 16px 16px;
    margin-bottom: 16px;
    border-radius: 4px;
    background: white;
    box-shadow: 0 0 12px rgb(0 0 0 / 5%);
  }
  .edit-input {
    padding-right: 100px;
  }
  .app-container {
    flex: 1;
    display: flex;
    width: 100%;
    padding: 16px;
    box-sizing: border-box;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
