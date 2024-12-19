<template>
  <div style="width: 95%; margin: 20px auto; padding: 20px 20px 20px 20px; background-color: #fff">
    <div class="dateDiv">
      <span class="dateChoose">日期选择: </span>
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="请选择日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        :editable="false"
        :clearable="false"
      />
      <el-button type="warning" plain @click="queryCarryByDate">查询</el-button>
      <el-button type="info" plain>导出载客统计数据(月)</el-button>
    </div>
    <el-table :data="tableData" :span-method="spanMethod">
      <el-table-column width="150" label="出入境" prop="border" align="center"> </el-table-column>
      <el-table-column width="150" label="类型" prop="travellerType" align="center"> </el-table-column>
      <el-table-column label="中船(载客人数)" align="center">
        <el-table-column v-for="ship in cShips" :label="ship['shipName']" align="center"> </el-table-column>
      </el-table-column>
      <el-table-column label="俄船(载客人数)" align="center">
        <el-table-column v-for="ship in eShips" :label="ship['shipName']" align="center"> </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import service from '@/api/request'
  import { getCurrentDate } from '@/utils/dateFormat'

  const date = ref(getCurrentDate())
  const spanMethod = ({ row, rowIndex, column, columnIndex }) => {
    // if (rowIndex > 0 && column.property == 'border') {
    //   if (row.border === tableData.value[rowIndex - 1].border) {
    //     return {rowspan:0, colspan:1};
    //   } else {
    //     return {rowspan:1, colspan:1};
    //   }
    // }
    if (columnIndex == 0) {
      if (rowIndex % 2 == 0) {
        return { rowspan: 2, colspan: 1 }
      } else {
        return { rowspan: 0, colspan: 1 }
      }
    }
  }

  const tableData = ref([
    { border: '出境', travellerType: '散客' },
    { border: '出境', travellerType: '团体' },
    { border: '入境', travellerType: '散客' },
    { border: '入境', travellerType: '团体' },
  ])
  const eShips = ref([])
  const cShips = ref([])

  const queryAllShipNames = async () => {
    await service.get('base/ship/listAllShips').then((response) => {
      //提取所有船名
      cShips.value = []
      eShips.value = []
      response.data.ships.forEach((ship) => {
        if (ship.shipMemo === 0) cShips.value.push(ship)
        else eShips.value.push(ship)
      })
    })
  }
  const queryCarryByDate = async () => {
    const res = await service({
      method: 'get',
      url: 'finance/carryDetails/list',
      params: {
        date: date.value,
      },
    })
    tableData.value = res.data.carryDetails
    console.log(tableData.value)
    //console.log(res.data.carryDetails)
    //console.log(res.data.carryRDetails)
  }

  onMounted(() => {
    queryAllShipNames()
  })
</script>

<style scoped>
  .dateDiv {
    margin-bottom: 30px;
    border-radius: 5px;
    background-color: #5bc0de;
    padding: 10px;
    .dateChoose {
      font-size: 1.2em;
      color: #fff;
      font-weight: bold;
      margin-right: 30px;
    }
    .el-button {
      margin-left: 30px;
    }
  }
  :deep(.el-table th) {
    border-color: rgb(152, 151, 151) !important;
  }
  :deep(.el-table td) {
    border-color: rgb(198, 196, 196) !important;
  }
  :deep(.el-table--group, .el-table--border) {
    border: 0.1px solid rgb(152, 151, 151) !important;
  }
</style>
