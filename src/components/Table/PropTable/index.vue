<template>
  <div class="zb-pro-table">
    <div v-if="showSearch" class="header">
      <SearchForm :columns="baseFormColumns" @submit="onSubmit" />
    </div>

    <!----------底部---------------------->
    <div class="footer">
      <!-----------工具栏操作工具----------------->
      <div class="operator">
        <slot name="btn"></slot>
      </div>

      <!-- ------------表格--------------->
      <div class="table">
        <el-table
          v-loading="loading"
          class="zb-table"
          :data="data"
          :border="true"
          @selection-change="(val) => emit('selection-change', val)"
        >
          <template v-for="(item, index) in columns">
            <el-table-column v-if="item.slot" v-bind="{ ...item, ...{ prop: item.name } }">
              <template #default="scope">
                <slot :name="item.name" :item="item" :row="scope.row"></slot>
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.index" v-bind="{ ...item, ...{ prop: item.name } }">
              <template #default="{ $index }">
                {{ getIndex($index) }}
              </template>
            </el-table-column>
            <el-table-column v-else v-bind="{ ...item, ...{ prop: item.name } }">
              <!-- <template #default="scope">
                {{ item.name ? scope.row[item.name] : item.value }}
              </template> -->
            </el-table-column>
          </template>
        </el-table>
      </div>
      <!-- ------------分页--------------->
      <div class="pagination">
        <el-pagination
          :current-page="resPage.pageNum"
          :page-size="resPage.pageSize"
          background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="resPage.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, ref, reactive } from 'vue'
  import SearchForm from '@/components/SearchForm/index.vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { FormInstance } from 'element-plus'
  const emit = defineEmits(['reset', 'onSubmit', 'selection-change'])
  let props = defineProps({
    showSearch: {
      default: true,
    },
    columns: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    resPage: {
      type: Object,
      default: () => {},
    },
    loading: {
      type: Boolean,
      default: false,
    },
    handleSizeChange: {
      type: Function,
      default: () => {},
    },
    handleCurrentChange: {
      type: Function,
      default: () => {},
    },
  })

  // 过滤调需要进行搜索选择的
  const baseFormColumns = computed(() => {
    return props.columns.filter((item) => item.valueType && item.search)
  })

  const getIndex = (index: number) => {
    if (JSON.stringify(props.resPage) === '{}') {
      return index + 1
    }
    return index + 1 + (props.resPage.pageNum - 1) * props.resPage.pageSize
  }

  let obj = {}
  let search = []
  for (let item of props.columns) {
    if (item.inSearch) {
      obj[item.name] = null
    }
    if (item.inSearch) {
      search.push(item)
    }
  }
  const formSearchData = ref(search)
  const formInline = reactive(obj)

  const onSubmit = () => {
    emit('onSubmit', formInline)
  }

  const reset = (formEl: FormInstance | undefined) => {
    formSearchData.value.forEach((item) => {
      formInline[item.name] = null
    })
    emit('reset')
  }
</script>
<style scoped lang="scss">
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
  .zb-pro-table {
    width: 100%;

    display: flex;
    flex-direction: column;

    .header {
      display: flex;
      padding: 16px 16px 0 16px;
      margin-bottom: 16px;
      border-radius: 4px;
      background: white;
      box-shadow: 0 0 12px rgb(0 0 0 / 5%);
      :deep(.advancedForm) {
        flex: 1;
      }
    }
    .footer {
      flex: 1;
      display: flex;
      padding: 16px;
      flex-direction: column;
      border-radius: 4px;
      overflow: hidden;
      background: white;
      box-shadow: 0 0 12px rgb(0 0 0 / 5%);
      min-height: 600px;
      .operator {
        margin-bottom: 15px;
      }
      .table {
        position: relative;
        flex: 1;
      }
      .zb-table {
        position: absolute;
        height: 100%;
      }
    }
    ::v-deep {
      .el-table__header th {
        font-size: 15px;
        font-weight: 700;
        color: #252525;
      }
    }
    .pagination {
      width: 100%;
      display: flex;
      justify-content: center;
      padding-top: 20px;
      box-sizing: border-box;
    }
  }
</style>
