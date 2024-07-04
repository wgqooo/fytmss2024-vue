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
        <el-icon :size="15" style="margin-right: 6px"><Download /></el-icon>导出旅客数据(本页)
      </el-button>
      <el-button type="primary" @click="importExcelAction">
        <el-icon :size="15" style="margin-right: 6px"><Upload /></el-icon>导入旅客数据
      </el-button>
    </div>
    <el-upload v-if="uploadShow" class="upload-demo" drag action="/" :before-upload="beforeUploadAction" type="file" accept=".xlsx, .xls">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text"> 拖拽上传 <em>或者点击上传旅客信息Excel</em> </div>
    </el-upload>
    <PropTable
      :loading="loading"
      :columns="baseColumns"
      :data="tableData"
      :res-page="resPage"
      :handle-size-change="handleSizeChange"
      :handle-current-change="handleCurrentChange"
      @selection-change="selectionChange"
      @reset="reset"
      @on-submit="onSubmit"
    >
      <template #btn>
        <div style="display: flex; justify-content: flex-end">
          <el-button type="primary" @click="add"
            ><el-icon><plus /></el-icon> 添加</el-button
          >
          <el-button type="danger" @click="batchDelete"
            ><el-icon><delete /></el-icon>删除</el-button
          >
        </div>
      </template>
      <template #trSex="scope">{{ scope.row.trSex ? '男' : '女' }}</template>
      <template #operation="scope">
        <el-button type="primary" size="small" icon="Edit" @click="edit(scope.row)"> 编辑 </el-button>
        <el-button type="danger" size="small" icon="Delete" @click="del(scope.row)"> 删除 </el-button>
      </template>
    </PropTable>
    <TravellerDialog ref="travellerDialog" :get-data="getData" />
  </div>
</template>
<script lang="ts" setup name="comprehensive">
  import { ref, reactive, onMounted, nextTick } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import ExcelJS from 'exceljs'
  import { columns } from './constants'
  import PropTable from '@/components/Table/PropTable/index.vue'
  import { Traveller } from '@/types/traveller'
  import service from '@/api/request'
  import { Page } from '@/types/page'
  import TravellerDialog from './travellerDialog.vue'
  import { exportExcel } from '@/utils/exprotExcel'
  import { formatISO } from '@/utils/dateFormat'

  //导入数据相关
  const uploadShow = ref(false)
  const importExcelAction = () => {
    uploadShow.value = !uploadShow.value
  }
  const beforeUploadAction = (file) => {
    return new Promise(() => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const data = e.target.result
        const workbook = new ExcelJS.Workbook()
        try {
          let res = await workbook.xlsx.load(data)
          const sheets = res._worksheets && res._worksheets.filter((item) => typeof item !== 'undefined')
          const table = []
          let headers = []
          sheets.forEach((sheet) => {
            sheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
              if (rowNumber === 1) {
                headers = row.values
              } else {
                let obj = {}
                headers.forEach((header, i) => {
                  switch (header) {
                    case '护照号':
                      header = 'passportNo'
                      break
                    case '姓名':
                      header = 'trName'
                      break
                    case '英文名':
                      header = 'trPinYin'
                      break
                    case '手机号':
                      header = 'trPhone'
                      break
                    case '临时手机号':
                      header = 'trTmpPhone'
                      break
                    case '性别':
                      header = 'trSex'
                      break
                    case '出生日期':
                      header = 'trBirthday'
                      break
                    case '出生地':
                      header = 'trBorAdd'
                      break
                    case '国籍':
                      header = 'trNation'
                      break
                    case '旅行社':
                      header = 'trTravel'
                      break
                  }
                  if (i < row.values.length) {
                    let cellValue = row.values[i]
                    // 如果单元格的值是一个包含文本的对象(意思是不管excel单元数据的格式)
                    if (typeof cellValue === 'object' && 'richText' in cellValue) {
                      // 提取文本对象中的文本值
                      cellValue = cellValue.richText.map((item) => item.text).join('')
                    }
                    if (header === 'trSex') {
                      if (cellValue == '男') cellValue = 1
                      else if (cellValue == '女') cellValue = 0
                    }
                    if (header === 'trBirthday') {
                      //支持yyyy-mm-dd或者yyyy/mm/dd或者yyyy.mm.dd类型的excel数据，另外月份或者日份前导零可省略
                      cellValue = formatISO(cellValue)
                    }
                    obj[header] = cellValue !== undefined ? cellValue : null
                  } else {
                    obj[header] = null
                  }
                })
                table.push(obj)
              }
            })
          })
          batchAdd(table)
        } catch (e) {
          ElMessage.error('解析失败')
        }
      }
      //开始读取上传的 Excel 文件，以 ArrayBuffer 格式读取
      reader.readAsArrayBuffer(file)
    })
  }

  const batchAdd = (table) => {
    service({
      method: 'post',
      url: 'base/traveller/saveByBatch',
      data: JSON.stringify(table),
    }).then((response) => {
      ElMessage.success(response.data.msg)
    })
  }

  //导出数据相关
  const format = ref('xlsx')
  const exportExcelAction = async () => {
    let travellers = tableData.value
    //打印的时候打印男和女
    travellers.forEach((traveller) => {
      if (traveller['trSex'] == 1) traveller['trSex'] = '男'
      else traveller['trSex'] = '女'
    })
    await exportExcel({
      //去掉第一列的选择框和第二列的序号框和最后一列的操作框
      column: baseColumns.slice(2, -1),
      data: tableData.value,
      filename: '旅客数据',
      format: format.value,
      autoWidth: true,
    })
    travellers.forEach((traveller) => {
      if (traveller['trSex'] == '男') traveller['trSex'] = 1
      else traveller['trSex'] = 0
    })
  }

  const loading = ref(true)
  const appContainer = ref(null)
  const travellerDialog = ref()
  const tableData = ref<Traveller[]>([])
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

  const handleSizeChange = (val: number) => {
    page.index = 1
    page.size = val
    getData()
  }
  const handleCurrentChange = (val: number) => {
    page.index = val
    getData()
  }

  //展示
  const getData = async () => {
    //获取表格数据
    const res = await service({
      method: 'get',
      url: 'base/traveller/list',
      params: page,
    })
    resPage.value = { ...res.data.page }
    tableData.value = resPage.value.list
  }

  let baseColumns = reactive(columns)
  const selectObj = ref([])

  const add = () => {
    travellerDialog.value.show()
  }

  const batchDelete = () => {
    if (!selectObj.value.length) {
      return ElMessage.error('未选中任何行')
    }
    ElMessageBox.confirm('你确定要删除选中项吗?', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    })
      .then(() => {
        ElMessage.success('模拟删除成功')
        list.value = list.value.concat([])
      })
      .catch(() => {})
  }

  const selectionChange = (val) => {
    selectObj.value = val
  }

  const edit = (row) => {
    travellerDialog.value.show(row)
  }

  const del = (row) => {
    ElMessageBox.confirm('你确定要删除当前项吗?', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    }).then(() => {
      service({
        method: 'delete',
        url: 'base/traveller/delete',
        //在axios接口封装是接收参数是一个object类型，不能直接params或者data当成一个属性或者直接赋值
        params: {
          passportNo: row.passportNo,
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
  }

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
    nextTick(() => {
      // let data = appContainer.value.
    })
    setTimeout(() => {
      getData()
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
