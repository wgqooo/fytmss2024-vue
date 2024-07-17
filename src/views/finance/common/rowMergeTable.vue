<template>
  <div>
    <h2>Vue3 + Element plus 动态多行合并表格</h2>
    <el-table :data="tableData" style="width: 100%" :span-method="objectSpanMethod" border>
      <el-table-column v-for="(item, index) in tableHeader" :key="index" :prop="item.prop" :label="item.label"></el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
  import { defineProps, ref, onMounted } from 'vue'
  const props = defineProps({
    tableData: {
      type: Array,
      //required: true,
    },
  })

  const spanMap = ref<any>({})
  const mergedColumns = ['birth', 'province', 'city']

  const tableHeader = [
    { prop: 'birth', label: '生日' },
    { prop: 'name', label: '姓名' },
    { prop: 'phone', label: '电话' },
    { prop: 'province', label: '省份' },
    { prop: 'city', label: '市区' },
    { prop: 'address', label: '详细地址' },
  ]

  const tableData = [
    {
      name: '张三',
      province: '上海市',
      city: '普陀区',
      address: '金沙江路 1518 弄',
      birth: '2016-05-02',
      phone: '12345678910',
    },
    {
      name: '张三',
      province: '上海市',
      city: '普陀区',
      address: '金沙江路 1518 弄',
      birth: '2016-05-02',
      phone: '12345678910',
    },
    {
      name: '李四',
      birth: '2016-05-02',
      province: '上海市',
      city: '普陀区',
      address: '金沙江路 1517 弄',
      age: 19,
      phone: '12345678911',
    },
    {
      name: '王五',
      birth: '2016-05-03',
      province: '上海市',
      city: '普陀区',
      address: '金沙江路 1519 弄',
      phone: '12345678912',
    },
    {
      name: '赵六',
      birth: '2016-05-04',
      province: '上海市',
      city: '普陀区',
      address: '金沙江路 1520 弄',
      phone: '12345678913',
    },
    {
      name: '孙七',
      birth: '2016-05-04',
      province: '上海市',
      city: '普陀区',
      address: '金沙江路 1521 弄',
      phone: '12345678913',
    },
    {
      name: '周八',
      birth: '2016-05-04',
      province: '上海市',
      city: '普陀区',
      address: '金沙江路 1522 弄',
      phone: '12345678913',
    },
    {
      name: '吴九',
      birth: '2016-05-06',
      province: '上海市',
      city: '普陀区',
      address: '金沙江路 1523 弄',
      phone: '12345678913',
    },
  ]

  const getSpanArr = (data: any[]) => {
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        mergedColumns.forEach((column) => {
          spanMap.value[column] = {
            spanArr: [1],
            pos: 0,
          }
        })
      } else {
        mergedColumns.forEach((column) => {
          if (data[i][column] === data[i - 1][column]) {
            spanMap.value[column].spanArr[spanMap.value[column].pos] += 1
            spanMap.value[column].spanArr.push(0)
          } else {
            spanMap.value[column].spanArr.push(1)
            spanMap.value[column].pos = i
          }
        })
      }
    }
  }

  const objectSpanMethod = ({ column, rowIndex }: { column: any; rowIndex: number }) => {
    if (spanMap.value[column.prop]) {
      const _row = spanMap.value[column.prop].spanArr[rowIndex]
      const _col = _row > 0 ? 1 : 0
      return {
        rowspan: _row,
        colspan: _col,
      }
    }
  }

  onMounted(() => {
    getSpanArr(tableData)
  })
</script>
