<template>
  <div class="app-container">
    <div class="header">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="addVoyage">添加一条航次</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="copyBatchVoyage">复制多条航次</el-button>
        </el-form-item>
        <el-form-item>
          <el-popover :visible="visible" placement="bottom" :title="title" :width="220">
            <div v-if="selectObj.length !== 0" style="text-align: right; margin: 0">
              <el-radio-group v-model="checkedState" style="margin: 15px 6px 20px 0">
                <el-radio-button class="unfreezeBtn" :value="0" :label="0" border>冻结</el-radio-button>
                <el-radio-button class="runBtn" :value="1" :label="1" border>生效</el-radio-button>
                <el-radio-button class="stopBtn" :value="2" :label="2" border>停运</el-radio-button>
              </el-radio-group>
              <el-button size="small" type="info" @click="visible = false">取消</el-button>
              <el-button size="small" type="primary" @click="commitState">确定</el-button>
            </div>
            <template #reference>
              <el-button type="primary" @click="changeBatchState">一键状态更改</el-button>
            </template>
          </el-popover>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="delBatchVoyage">一键批量删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :border="true"
        show-overflow-tooltip
        :default-sort="{ prop: 'voyDate', order: 'ascending' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" width="50"></el-table-column>
        <el-table-column prop="voyDate" label="日期" sortable width="150px" align="center">
          <template #default="scope">
            <template v-if="scope.row.edit">
              <div style="display: flex; align-items: center">
                <el-date-picker
                  v-model="scope.row.voyDate"
                  type="date"
                  placeholder="请选择日期"
                  :clearable="false"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  :disabled-date="disabledDate"
                >
                </el-date-picker>
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="voyNo" label="船次" width="120px" align="center">
          <template #default="scope">
            <template v-if="scope.row.edit">
              <el-select
                v-model="scope.row.voyNo"
                filterable
                allow-create
                :clearable="false"
                placeholder="请输入或选择船次"
                @click="queryAllVoyNo"
              >
                <el-option v-for="voyNo in allVoyNo" :label="voyNo" :value="voyNo"></el-option>
              </el-select>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="shipNo" label="计划船名" width="150px" align="center">
          <template #default="scope">
            <template v-if="scope.row.edit">
              <el-select v-model="scope.row.shipNo" filterable placeholder="请选择或输入计划船" @click="queryAllShipNames">
                <el-option v-for="ship in ships" :label="ship.shipName" :value="ship.shipNo"></el-option>
              </el-select>
            </template>
            <template v-else>
              {{ scope.row.shipName }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="reShipName" label="实际船名" width="150px" align="center">
          <template #default="scope">
            <template v-if="scope.row.edit">
              <el-select v-model="scope.row.reShipNo" filterable placeholder="请选择或输入实际船" @click="queryAllShipNames">
                <el-option v-for="ship in ships" :label="ship.shipName" :value="ship.shipNo"></el-option>
              </el-select>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="出发时间" sortable width="150px" align="center">
          <template #default="scope">
            <template v-if="scope.row.edit">
              <div style="display: flex; align-items: center">
                <el-time-picker
                  v-model="scope.row.startTime"
                  arrow-control
                  format="HH:mm:ss"
                  value-format="HH:mm:ss"
                  :clearable="false"
                  placeholder="请选择出发时间"
                >
                </el-time-picker>
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="startPort" label="出发港口" align="center">
          <template #default="scope">
            <template v-if="scope.row.edit">
              <el-select v-model="scope.row.startPort">
                <el-option label="抚远" :value="0"></el-option>
                <el-option label="哈巴洛夫斯克" :value="1"></el-option>
              </el-select>
            </template>
            <template v-else>
              {{ scope.row.startPort === 0 ? '抚远' : '哈巴洛夫斯克' }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="vipRes" label="VIP预留" width="140px" align="center">
          <template #default="scope">
            <template v-if="scope.row.edit">
              <div style="display: flex; align-items: center">
                <el-input-number v-model="scope.row.vipRes" :precision="0" :min="0"></el-input-number>
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="firRes" label="一等预留" width="140px" align="center">
          <template #default="scope">
            <template v-if="scope.row.edit">
              <div style="display: flex; align-items: center">
                <el-input-number v-model="scope.row.firRes" :precision="0" :min="0"></el-input-number>
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="secRes" label="二等预留" width="140px" align="center">
          <template #default="scope">
            <template v-if="scope.row.edit">
              <div style="display: flex; align-items: center">
                <el-input-number v-model="scope.row.secRes" :precision="0" :min="0"></el-input-number>
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="voyState" label="状态" sortable align="center">
          <template #default="scope">
            <el-radio-group v-model="scope.row.voyState" @change="changeVoyState(scope.row)">
              <el-radio-button class="unfreezeBtn" :value="0" :label="0" border>冻结</el-radio-button>
              <el-radio-button class="runBtn" :value="1" :label="1" border>生效</el-radio-button>
              <el-radio-button class="stopBtn" :value="2" :label="2" border>停运</el-radio-button>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作" width="180px" fixed="right" align="center">
          <template #default="scope">
            <el-button-group v-if="scope.row.edit">
              <el-button type="success" size="small" icon="CircleCheckFilled" @click="confirmEdit(scope.row)"> 保存 </el-button>
              <el-button type="info" size="small" icon="CircleCloseFilled" @click="cancelEdit(scope.row)"> 取消 </el-button>
            </el-button-group>
            <!-- <el-button v-if="scope.row.edit" type="success" size="small" icon="CircleCheckFilled" @click="confirmEdit(scope.row)"> 保存 </el-button> -->
            <el-button v-else type="primary" size="small" icon="Edit" @click="handleEdit(scope.row)"> 编辑 </el-button>
            <el-button type="danger" size="small" icon="Delete" @click="deleteAction(scope.row.voyDate, scope.row.voyNo)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="width: 100%; display: flex; justify-content: center; padding-top: 20px">
        <el-pagination
          :current-page="resPage.pageNum"
          :page-size="resPage.pageSize"
          :page-sizes="pageSizes"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="resPage.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <VoyageDialog ref="voyageDialog" :get-data="getData" />
    <VopyVoysDialog ref="copyVoysDialog" :get-data="getData" />
  </div>
</template>
<script lang="ts" setup>
  import service from '@/api/request'
  import { onMounted, reactive } from 'vue'
  import { computed, ref, watch } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import VoyageDialog from './components/voyageDialog.vue'
  import VopyVoysDialog from './components/copyVoysDialog.vue'
  import { Page } from '@/types/page'

  const tableData = ref<[]>([])
  const resPage = ref<Page>({
    size: 0,
    pageSize: 0,
    total: 0,
    prePage: 0,
    nextPage: 0,
    pages: 0,
    pageNum: 0,
    navigatePages: 0,
    list: [],
  })
  const page = reactive({
    index: 1,
    size: 10,
  })

  //展示
  const getData = async () => {
    //获取表格数据
    const res = await service({
      method: 'get',
      url: 'voyage/voyageManage/list',
      params: page,
    })
    resPage.value = { ...res.data.page }
    tableData.value = resPage.value.list
  }

  //编辑
  const allVoyNo = ref<string[]>()
  const ships = ref<[]>()
  //原出发日期和航次
  const voyageInfo = ref()
  const handleEdit = (row) => {
    row.edit = !row.edit
    //终于懂了喔！！！！！
    queryAllShipNames()
    //在这里先保存原对象(要求复制而不是保存个地址)
    voyageInfo.value = { ...row }
  }
  const queryAllVoyNo = () => {
    service.get('voyage/voyageManage/listAllVoyNo').then((response) => {
      //提取所有航号
      allVoyNo.value = response.data.voyNos
    })
  }
  const queryAllShipNames = () => {
    service.get('base/ship/listAllShips').then((response) => {
      //提取所有船名和船号
      ships.value = response.data.ships
    })
  }
  const changeVoyState = (row) => {
    let state = row.voyState == 0 ? '冻结' : row.voyState == 1 ? '生效' : '停运'
    ElMessageBox.confirm('你确定' + state + '该航次吗？', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    })
      .then(() => {
        service({
          method: 'put',
          url: 'voyage/voyageManage/state',
          params: {
            voyDate: row.voyDate,
            voyNo: row.voyNo,
            voyState: row.voyState,
          },
        }).then((response) => {
          if (response.data.code === 0) ElMessage.success(response.data.msg)
          else ElMessage.error(response.data.msg)
        })
      })
      .catch(() => {
        getData()
      })
  }
  const deleteAction = (voyDate, voyNo) => {
    ElMessageBox.confirm('你确定要删除当前项吗?', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    })
      .then(() => {
        service({
          method: 'delete',
          url: 'voyage/voyageManage/delete',
          //在axios接口封装是接收参数是一个object类型，不能直接params或者data当成一个属性或者直接赋值
          params: {
            voyDate,
            voyNo,
          },
        }).then((response) => {
          if (response.data.code == 0) {
            ElMessage.success(response.data.msg)
            getData()
          } else {
            ElMessage.error(response.data.msg)
          }
        })
      })
      .catch(() => {})
  }
  const confirmEdit = async (row) => {
    row.edit = false
    if (row.voyDate == voyageInfo.value.voyDate && row.voyNo == voyageInfo.value.voyNo) {
      //没有修改主键
      service({
        method: 'post',
        url: 'voyage/voyageManage/update',
        data: JSON.stringify(row),
      }).then((response) => {
        if (response.data.code == 0) {
          ElMessage.success(response.data.msg)
          getData()
        } else if (response.data.code == 500) {
          ElMessage.error(response.data.msg)
        } else if (response.data.code == 400) {
          ElMessage.error(response.data.msg)
        }
      })
    } else {
      //修改主键的属性，只能先删除对应的数据在，再添加新的数据
      //但是得看一下修改后的主键是否有冲突
      await service({
        method: 'post',
        url: 'voyage/voyageManage/save',
        data: JSON.stringify(row),
      }).then((response) => {
        if (response.data.code == 0) {
          ElMessage.success('修改成功')
          service({
            method: 'delete',
            url: 'voyage/voyageManage/delete',
            params: {
              voyDate: voyageInfo.value.voyDate,
              voyNo: voyageInfo.value.voyNo,
            },
          })
        } else {
          ElMessage.error('修改失败，出发时间和航号已存在')
        }
      })
      getData()
    }
  }
  const cancelEdit = (row) => {
    row.edit = false
    getData()
  }

  const handleSelectionChange = (val) => {
    // service({
    //   method: 'put',
    //   url: 'voyage/voyageManage/stateBatchChange'
    // })
    selectObj.value = val
    if (selectObj.value.length === 0) {
      title.value = '您还未勾选任何航次'
      setTimeout(() => {
        visible.value = false
      }, 1500)
    } else {
      title.value = '点击修改航次状态'
    }
  }
  const disabledDate = (date) => {
    const today = new Date() // 获取当前日期
    today.setHours(0, 0, 0, 0) // 将时间设置为0时0分0秒0毫秒，即当天的开始时间
    return date.getTime() < today.getTime() // 禁用过去的日期
  }
  const pageSizes = reactive([3, 5, 10, 20, 30, 50, 100])
  const handleSizeChange = (val: number) => {
    page.index = 1
    page.size = val
    getData()
  }
  const handleCurrentChange = (val: number) => {
    page.index = val
    getData()
  }

  const voyageDialog = ref()
  const copyVoysDialog = ref()
  const loading = ref(true)
  const visible = ref(false)
  const title = ref('航次状态')
  const selectObj = ref([])
  const checkedState = ref(1)

  const addVoyage = () => {
    voyageDialog.value.show()
  }
  const copyBatchVoyage = () => {
    copyVoysDialog.value.show()
  }
  const changeBatchState = () => {
    visible.value = true
    if (selectObj.value.length === 0) {
      title.value = '您还未勾选任何航次'
      setTimeout(() => {
        visible.value = false
      }, 1000)
    }
  }
  const commitState = () => {
    visible.value = false
    let num = 0
    let state = checkedState.value === 0 ? '冻结' : checkedState.value === 1 ? '生效' : '停运'
    const reqs = selectObj.value.map((voyage) => {
      voyage.voyState = checkedState.value
      return service({
        method: 'put',
        url: 'voyage/voyageManage/state',
        params: {
          voyDate: voyage.voyDate,
          voyNo: voyage.voyNo,
          voyState: voyage.voyState,
        },
      }).then((response) => {
        if (response.data.code === 0) num++
      })
    })
    // 等待所有请求完成
    Promise.all(reqs).then(() => {
      if (selectObj.value.length === num) {
        ElMessage.success('全部' + num + '条航次' + state + '成功')
      } else if (selectObj.value.length < num) {
        ElMessage.warning(num + '条航次' + state + '成功,' + (selectObj.value.length - num) + '条航次' + state + '失败')
      }
      getData()
    })
  }
  const delBatchVoyage = () => {
    if (selectObj.value.length === 0) {
      ElMessage.warning('请勾选要删除的航次')
      return
    }
    let voysDTO = []
    selectObj.value.map((voyage) => {
      voysDTO.push({
        voyDate: voyage.voyDate,
        voyNo: voyage.voyNo,
      })
    })
    ElMessageBox.confirm('你确定要删除所选航次吗?', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    })
      .then(() => {
        service({
          method: 'delete',
          url: 'voyage/voyageManage/delVoyages',
          data: JSON.stringify(voysDTO),
          // data: {
          //   voyages: selectObj.value
          // }
        }).then((response) => {
          if (response.data.code === 0) ElMessage.success(response.data.msg)
          else ElMessage.error(response.data.msg)
          getData()
        })
      })
      .catch(() => {})
  }

  onMounted(() => {
    setTimeout(() => {
      loading.value = false
      getData()
    }, 200)
  })
</script>

<style scoped lang="scss">
  .header {
    display: flex;
    padding: 16px 16px 0px 16px;
    margin-bottom: 16px;
    border-radius: 4px;
    background: white;
    box-shadow: 0 0 12px rgb(0 0 0 / 5%);
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
  }

  .unfreezeBtn {
    --el-radio-button-checked-bg-color: #00bfff;
    --el-radio-button-checked-text-color: white;
    --el-radio-button-checked-border-color: #00bfff;
    --el-radio-button-disabled-checked-fill: gray;
  }
  .runBtn {
    --el-radio-button-checked-bg-color: LimeGreen;
    --el-radio-button-checked-text-color: white;
    --el-radio-button-checked-border-color: LimeGreen;
    --el-radio-button-disabled-checked-fill: gray;
  }
  .stopBtn {
    --el-radio-button-checked-bg-color: IndianRed;
    --el-radio-button-checked-text-color: white;
    --el-radio-button-checked-border-color: IndianRed;
    --el-radio-button-disabled-checked-fill: gray;
  }

  // ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner,
  // ::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  // border-color: HotPink !important;
  // background-color: HotPink !important;
  // }

  // ::v-deep .el-checkbox__input .el-checkbox__inner {
  // border-color: #999; /* 修改为你希望的未选中状态的边框颜色 */
  // }
  // ::v-deep .el-checkbox__inner:hover {
  // border-color: #00BFFF; /* 修改为你希望的未选中状态的边框颜色 */
  // }
  .el-table :deep(.el-checkbox__input.is-checked .el-checkbox__inner),
  .el-table :deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
    border-color: HotPink !important;
    background-color: HotPink !important;
  }

  .el-table :deep(.el-checkbox__input .el-checkbox__inner) {
    border-color: #999; /* 修改为你希望的未选中状态的边框颜色 */
  }

  .el-table :deep(.el-checkbox__inner:hover) {
    border-color: #00bfff; /* 修改为你希望的鼠标悬停状态的边框颜色 */
  }
</style>
