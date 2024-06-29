<template>
  <el-dialog v-model="dialogVisible" :title="title" width="40%" @close="close">
    <div class="demo-date-picker">
      <span class="copyDate">复制日期: </span>
      <el-date-picker
        v-model="copyDate"
        type="date"
        placeholder="请选择日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        :editable="false"
        @change="queryVoyByDate"
      />
      <span class="dateScope">添加区间：</span>
      <el-date-picker
        v-model="dateScope"
        type="daterange"
        unlink-panels
        range-separator="至"
        start-placeholder="Start date"
        end-placeholder="End date"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        :editable="false"
        :clearable="false"
        :disabled-date="disabledDate"
      />
    </div>
    <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column property="voyNo" label="船次" />
      <el-table-column property="shipName" label="船名" />
      <el-table-column property="startTime" label="出发时间">
        <template #default="scope">{{ scope.row.startTime }}</template>
      </el-table-column>
      <el-table-column property="startPort" label="出发港口">
        <template #default="scope">{{ scope.row.startPort === 0 ? '抚远' : '哈巴洛夫斯克' }}</template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="info" @click="dialogVisible = false">取消</el-button>
        <el-button type="success" @click="handleClose">添加</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import service from '@/api/request'
  import { getCurrentDate } from '@/utils/dateFormat'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { reactive, ref, warn } from 'vue'

  const props = defineProps({
    getData: {
      type: Function,
    },
  })

  const dialogVisible = ref<boolean>(false)
  const title = ref('批量复制航次')
  const copyDate = ref()
  const dateScope = ref([getCurrentDate(), getCurrentDate()])
  //查询到的航线数据
  const tableData = ref<[]>([])
  //被勾选的航线数据
  const chooseVoys = ref<[]>([])

  const handleSelectionChange = (voys) => {
    //voys代表的是被勾选中的船次对象组成的数组
    chooseVoys.value = voys
  }
  const disabledDate = (date) => {
    const today = new Date() // 获取当前日期
    today.setHours(0, 0, 0, 0) // 将时间设置为0时0分0秒0毫秒，即当天的开始时间
    return date.getTime() < today.getTime() // 禁用过去的日期
  }
  const queryVoyByDate = async (date) => {
    const res = await service({
      method: 'get',
      url: 'voyage/voyageManage/VoysByDate',
      params: {
        date,
      },
    })
    tableData.value = res.data.voyages
  }
  const handleClose = () => {
    if (chooseVoys.value.length === 0) {
      ElMessage.error('请选择要复制的航次')
      return
    }
    let num = chooseVoys.value.length
    let date = chooseVoys.value[0].voyDate
    ElMessageBox.confirm(
      '确定批量复制 ' + date + ' 的 ' + num + ' 条航次到区间[' + dateScope.value[0] + ', ' + dateScope.value[1] + ']吗?',
      '温馨提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        draggable: true,
      },
    ).then(() => {
      service({
        method: 'post',
        url: 'voyage/voyageManage/addVoyages',
        data: {
          voyages: chooseVoys.value,
          startDate: dateScope.value[0],
          endDate: dateScope.value[1],
        },
      }).then((response) => {
        if (response.data.code === 0) {
          ElMessage.success(response.data.msg)
        } else if (response.data.code === 500) {
          let invalidDate = response.data.invalidDate
          ElMessage({
            message: '日期为【' + invalidDate + '】存在冲突航次，添加失败',
            type: 'warning',
            duration: 5000,
            offset: 50,
          })
        }
        props.getData()
      })
    })
    dialogVisible.value = false
  }
  const show = () => {
    dialogVisible.value = true
  }
  const close = () => {
    dialogVisible.value = false
    // copyDate.value = ''
    //tableData.value = []
  }
  defineExpose({
    show,
  })
</script>

<style scoped>
  .copyDate {
    margin-right: 15px;
    width: 70px;
  }
  .dateScope {
    margin-left: 30px;
    width: 80px;
  }
  .demo-date-picker {
    display: flex; /* 使用 Flexbox 布局 */
    align-items: center; /* 垂直居中对齐 */
  }

  .demo-date-picker {
    margin-left: 20px;
    margin-right: 20px; /* 间距调整 */
    margin-bottom: 30px;
  }

  /* 自定义 el-date-picker 的样式，根据需要调整 */
  .demo-date-picker el-date-picker {
    flex: 1; /* 填充剩余空间 */
    margin-right: 10px; /* 可调整的右侧间距 */
  }
</style>
