<template>
  <div v-if="hasToolbar" class="table-toolbar">
    <div class="table-toolbar-left">
      <slot name="toolbarBtn"></slot>
    </div>
  </div>
  <div class="table-style">
    <el-table :row-class-name="tableRowClassName" border :data="tableData" table-layout="auto">
      <template v-for="item in columns" :key="item.prop">
        <el-table-column
          v-if="item.visible"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :fixed="item.fixed"
          :type="item.type"
          :align="item.align || 'center'"
        >
          <template v-if="item.type === 'index'" #default="{ $index }">
            {{ getIndex($index) }}
          </template>
          <template v-else-if="!item.type" #default="{ row, column, $index }">
            <slot :name="item.prop" :rows="row" :index="$index">
              <span v-if="item.formatter">
                {{ item.formatter(row[item.prop]) }}
              </span>
              <span v-else>
                {{ row[item.prop] }}
              </span>
            </slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
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
</template>

<script setup lang="ts">
  import { toRefs, PropType } from 'vue'

  const props = defineProps({
    resPage: {
      type: Object,
      default: () => {
        return {}
      },
    },
    // 表格相关
    tableData: {
      type: Array,
      default: () => {
        return []
      },
    },
    columns: {
      type: Array as PropType<any[]>,
      default: () => {
        return []
      },
    },
    hasToolbar: {
      type: Boolean,
      default: true,
    },
    refresh: {
      type: Function,
      default: () => {},
    },
    handleCurrentChange: {
      type: Function,
      default: () => {},
    },
    handleSizeChange: {
      type: Function,
      default: () => {},
    },
  })

  let { resPage, tableData, columns, hasToolbar } = toRefs(props)

  const tableRowClassName = (row) => {
    if (row.rowIndex % 2 == 1) {
      return 'deep_row'
    } else {
      return 'light_row'
    }
  }

  columns.value.forEach((item) => {
    if (item.visible === undefined) {
      item.visible = true
    }
  })

  const getIndex = (index: number) => {
    return index + 1 + (resPage.value.pageNum - 1) * resPage.value.pageSize
  }
</script>

<style lang="scss" scoped>
  .table-style {
    margin: 0px 30px 0px 30px;
    border: 1px solid #ddd;
    border-radius: 10px;

    //表格标题样式
    :deep(.el-table th.el-table__cell) {
      background-color: #ffffff !important;
      color: #909399;
      font-weight: bold;
      font-size: 1.2em;
      height: 50px;
    }
    //表格内容字样式
    :deep(.el-table td.el-table__cell) {
      font-size: 15px;
      color: #606266;
      opacity: 0.8;
      height: 50px;
    }
    // //表格行底部白线设为透明
    // :deep(.el-table th.el-table__cell.is-leaf) ,
    // :deep(.el-table td.el-table__cell)  {
    // 	border-bottom: 1px solid transparent !important;
    // }
    //表格底部白线去掉
    .el-table::before {
      height: 0px;
    }
    //表格行鼠标悬浮样式
    :deep(.el-table) {
      tbody tr {
        &:hover {
          td {
            background-color: rgba($color: #81d3f8, $alpha: 0.5) !important;
          }
        }
      }
    }
    //斑马纹深色样式
    :deep(.deep_row) {
      background: rgba(111, 151, 42, 0.2) !important;
    }
    //斑马纹浅色样式
    :deep(.light_row) {
      background: rgba(202, 240, 245, 0.5) !important;
    }
  }

  .pagination {
    margin: 20px 30px 0px 30px;
    border: 1px solid #ddd;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    padding: 8px 0px;
    box-sizing: border-box;
    flex-shrink: 0;
    background-color: #fff;
    // .el-pagination {
    //   .number {
    //     &.active {
    //       background-color: #337ab7; // 激活状态的背景色
    //       border-color: #337ab7; // 激活状态的边框颜色
    //     }
    //     &:hover {
    //       background-color: #5bc0de; // 鼠标悬停时的背景色
    //       border-color: #5bc0de; // 鼠标悬停时的边框颜色
    //     }
    //   }
    // }
  }
  .table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 10px;
  }
</style>
