<template>
  <div class="footer" style="margin-bottom: 30px">
    <div class="table-inner">
      <span style="font-weight: bold; font-size: 1.5em">已选航次</span>
      <el-table :data="voyData" style="width: 100%">
        <el-table-column label="船次信息" align="center">
          <template #default="scope">
            <div style="font-weight: bold; font-size: 1.5em; align-items: center">
              <svg-icon style="width: 30px; height: 30px; margin-right: 10px" icon-class="voy-no"></svg-icon>
              <span>{{ scope.row.voyNo }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="船号信息" align="center">
          <template #default="scope">
            <div style="font-weight: bold; font-size: 1.5em; align-items: center">
              <svg-icon style="width: 30px; height: 30px; margin-right: 10px" icon-class="ship-no"></svg-icon>
              <span>{{ scope.row.shipNo }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="船名信息" align="center">
          <template #default="scope">
            <el-popover effect="light" trigger="hover" placement="top" align="center" width="auto">
              <template #default>
                <div>vip座总数: {{ scope.row.vipSeat }}</div>
                <div>一等座总数: {{ scope.row.firSeat }}</div>
                <div>二等座数量: {{ scope.row.secSeat }}</div>
              </template>
              <template #reference>
                <div>
                  <el-tag size="large" round type="light" style="color: #606266; font-weight: bold; font-size: 20px">{{
                    scope.row.shipName
                  }}</el-tag>
                </div>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="出发时间" align="center">
          <template #default="scope">
            <svg-icon style="width: 30px; height: 30px" icon-class="clock"></svg-icon>
            <div style="font-weight: bold; font-size: 1.5em; align-items: center">
              <span>{{ scope.row.voyDate }}</span>
            </div>
            <div style="font-weight: bold; font-size: 1.2em; align-items: center">
              <span>{{ scope.row.startTime }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="港口" align="center">
          <template #default="scope">
            <div style="font-weight: bold; font-size: 1.5em; align-items: center">
              <svg-icon style="width: 30px; height: 30px; margin-right: 10px" icon-class="from"></svg-icon>
              <span>{{ scope.row.startPort == 0 ? '抚远' : '哈巴洛夫斯克' }}</span>
            </div>
            <div style="font-weight: bold; font-size: 1.5em; align-items: center">
              <svg-icon style="width: 30px; height: 30px; margin-right: 10px" icon-class="to"></svg-icon>
              <span>{{ scope.row.startPort == 1 ? '抚远' : '哈巴洛夫斯克' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="票价" align="center">
          <template #default="scope">
            <div style="font-weight: bold; font-size: 1.5em; align-items: center">
              <svg-icon style="width: 30px; height: 30px; margin-right: 10px" icon-class="vip-seat"></svg-icon>
              <span>{{ scope.row.vipVisa }}</span>
              <svg-icon style="width: 20px; height: 20px; margin-right: 10px" icon-class="rmb"></svg-icon>
            </div>
            <div style="font-weight: bold; font-size: 1.5em; align-items: center">
              <svg-icon style="width: 30px; height: 30px; margin-right: 10px" icon-class="fir-seat"></svg-icon>
              <span>{{ scope.row.firVisa }}</span>
              <svg-icon style="width: 20px; height: 20px; margin-right: 10px" icon-class="rmb"></svg-icon>
            </div>
            <div style="font-weight: bold; font-size: 1.5em; align-items: center">
              <svg-icon style="width: 30px; height: 30px; margin-right: 10px" icon-class="sec-seat"></svg-icon>
              <span>{{ scope.row.secVisa }}</span>
              <svg-icon style="width: 20px; height: 20px; margin-right: 10px" icon-class="rmb"></svg-icon>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <div class="footer">
    <el-form ref="ruleFormRef" :inline="true" :model="condition">
      <el-form-item label="护照号" prop="travellername">
        <el-input v-model="condition.passportNo" placeholder="请输入护照号" />
      </el-form-item>
      <el-form-item label="姓名" prop="travellername">
        <el-input v-model="condition.trName" placeholder="请输入旅客姓名" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="queryTravellers">查询</el-button>
        <el-button type="warning" :icon="Refresh" @click="reset(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
    <span style="font-weight: bold; font-size: 1.5em; margin-bottom: 10px">选择旅客</span>
    <div class="table-inner" style="display: flex; height: 440px">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 50%; height: 100%"
        border
        :row-key="getRowKey"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" :selectable="selectable" :reserve-selection="true" fixed width="40" align="center" />
        <el-table-column type="index" fixed label="序号" align="center" width="55">
          <template #default="{ $index }">
            {{ getIndex($index) }}
          </template>
        </el-table-column>
        <el-table-column prop="passportNo" fixed label="护照号" align="center" width="120" />
        <el-table-column prop="trName" fixed label="姓名" align="center" width="150" />
        <el-table-column prop="trPinYin" label="英文名" align="center" width="150" />
        <el-table-column prop="trPhone" label="手机号" align="center" width="120" />
        <el-table-column prop="trTmpPhone" label="临时手机号" align="center" width="120" />
        <el-table-column prop="trSex" label="性别" align="center" width="70">
          <template #default="scope">
            {{ scope.row.trSex === 0 ? '女' : '男' }}
          </template>
        </el-table-column>
        <el-table-column prop="trBirthday" label="出生日期" align="center" width="120" />
        <el-table-column prop="trBorAdd" label="出生地" align="center" width="100" />
        <el-table-column prop="trNation" label="国籍" align="center" width="100" />
        <el-table-column prop="travelName" fixed="right" label="旅行社" align="center" width="150" />
        <el-table-column prop="hasTicket" fixed="right" label="已购买" align="center" width="100">
          <template #default="scope">
            <div :style="{ 'background-color': scope.row.hasTicket !== 0 ? '#bfc' : '' }">
              {{ scope.row.hasTicket === 0 ? '否' : '是' }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <svg-icon style="width: 100px; height: 100px; margin: auto auto" icon-class="transfer"></svg-icon>
      <el-table
        v-loading="loading"
        :data="chooseTravellers"
        :row-key="getRowKey"
        style="width: 40%; height: 100%; margin-left: auto"
        border
      >
        <el-table-column type="index" fixed label="序号" align="center" width="55">
          <template #default="{ $index }">
            {{ getIndex2($index) }}
          </template>
        </el-table-column>
        <el-table-column prop="passportNo" fixed label="护照号" align="center" />
        <el-table-column prop="trName" fixed label="姓名" align="center" />
        <el-table-column prop="ticketType" label="票型" align="center">
          <template #default="scope">
            <el-select v-model="scope.row.ticketType" @change="changeType(scope.row)">
              <el-option label="成人票" :value="0"></el-option>
              <el-option label="儿童票" :value="1"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="seatType" label="座位等级" align="center">
          <template #default="scope">
            <el-select v-model="scope.row.seatType" @change="changeType(scope.row)">
              <el-option label="VIP座" :value="0"></el-option>
              <el-option label="一等座" :value="1"></el-option>
              <el-option label="二等座" :value="2"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop=" tickCost" label="票价" align="center">
          <template #default="scope">
            {{ scope.row.tickCost }}
            <svg-icon style="width: 20px; height: 15px; margin-right: 10px" icon-class="rmb"></svg-icon>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        :current-page="resPage.pageNum"
        :page-size="resPage.pageSize"
        :page-sizes="pageSizes"
        background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="resPage.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <div
      v-if="chooseTravellers.length !== 0"
      style="display: flex; width: 220px; flex-direction: column; align-items: flex-end; margin-left: auto"
    >
      <span style="color: red; font-size: large; font-weight: bold; margin-bottom: 10px">
        总金额: {{ getTotalMoney() }}
        <svg-icon style="width: 30px; height: 20px; margin-right: 10px" icon-class="rmb"></svg-icon>
      </span>
      <div style="display: flex; flex-wrap: wrap; gap: 20px">
        <el-select v-model="payment" style="width: 100px">
          <el-option label="现金" :value="0"></el-option>
          <el-option label="微信" :value="1"></el-option>
          <el-option label="支付宝" :value="2"></el-option>
        </el-select>
        <el-button type="primary" @click="bulidOrder">创建订单</el-button>
      </div>
    </div>
  </div>
  <OrderDialog
    ref="orderDialog"
    :choose-travellers="chooseTravellers"
    :voy-data="props.voyData"
    :get-total-money="getTotalMoney"
    :generate-order="generateOrder"
  />
</template>

<script setup lang="ts">
  import service from '@/api/request'
  import { Page } from '@/types/page'
  import { Traveller } from '@/types/traveller'
  import { onMounted, reactive, ref } from 'vue'
  import { Refresh, Search } from '@element-plus/icons-vue'
  import { ElMessage, FormInstance } from 'element-plus'
  import OrderDialog from './orderDialog.vue'
  import { getCurrentDateTimeString } from '@/utils/dateFormat'

  const props = defineProps({
    voyData: {
      type: Array,
    },
    nextStep: {
      type: Function,
    },
    orderData: {
      type: Function,
    },
  })
  const condition = reactive({
    index: 1,
    size: 10,
    passportNo: '',
    trName: '',
    voyTime: props.voyData[0]['voyDate'] + ' ' + props.voyData[0]['startTime'],
  })
  const loading = ref(true)
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
  const pageSizes = reactive([5, 10, 20, 30, 50, 100])
  const chooseTravellers = ref([])
  const ticketType = ref(0)
  const seatType = ref(2)
  const tickCost = ref(props.voyData[0]['secVisa'])
  const payment = ref(0)
  const orderDialog = ref()

  const getRowKey = (row) => {
    return row.passportNo
  }
  const selectable = (row) => {
    return row.hasTicket === 0
  }
  //索引
  const getIndex = (index: number) => {
    return index + 1 + (resPage.value.pageNum - 1) * resPage.value.pageSize
  }
  const getIndex2 = (index: number) => {
    return index + 1
  }
  //
  const handleSelectionChange = (travellers) => {
    const addedTravellers = travellers.filter(
      (traveller) => !chooseTravellers.value.some((item) => item.passportNo === traveller.passportNo),
    )
    const removedTravellers = chooseTravellers.value.filter(
      (traveller) => !travellers.some((item) => item.passportNo === traveller.passportNo),
    )
    chooseTravellers.value = chooseTravellers.value
      .filter((traveller) => !removedTravellers.some((item) => item.passportNo === traveller.passportNo))
      .concat(
        addedTravellers.map((traveller) => ({
          passportNo: traveller.passportNo,
          trName: traveller.trName,
          ticketType: ticketType.value,
          seatType: seatType.value,
          tickCost: tickCost.value,
        })),
      )
  }
  const changeType = (row) => {
    if (row.ticketType === 1) row.tickCost = 0
    else {
      if (row.seatType === 0) row.tickCost = props.voyData[0]['vipVisa']
      else if (row.seatType === 1) row.tickCost = props.voyData[0]['firVisa']
      else row.tickCost = props.voyData[0]['secVisa']
    }
  }
  //展示
  const queryTravellers = async () => {
    condition.passportNo = condition.passportNo.trim()
    condition.trName = condition.trName.trim()
    const res = await service({
      method: 'get',
      url: 'base/traveller/listByCondition',
      params: condition,
    })

    resPage.value = { ...res.data.page }
    tableData.value = resPage.value.list
  }
  //重置
  const reset = (formEl: FormInstance | undefined) => {
    loading.value = true
    condition.passportNo = ''
    condition.trName = ''
    setTimeout(() => {
      loading.value = false
      queryTravellers()
    }, 200)
  }
  const getTotalMoney = () => {
    let total = 0
    chooseTravellers.value.forEach((traveller) => {
      total = total + traveller.tickCost
    })
    return total
  }
  //分页
  const handleSizeChange = (val: number) => {
    condition.index = 1
    condition.size = val
    queryTravellers()
  }
  const handleCurrentChange = (val: number) => {
    condition.index = val
    queryTravellers()
  }
  //创建订单
  const bulidOrder = () => {
    orderDialog.value.show()
  }
  //生成船票订单
  const generateOrder = () => {
    let count = 10
    let dateStr = getCurrentDateTimeString()
    let userCache = JSON.parse(localStorage.getItem('userState'))
    let legalNo = userCache.token
    let username = userCache['userInfo'].name
    chooseTravellers.value.forEach((traveller) => {
      traveller['tickNo'] = dateStr + count++ + traveller['passportNo'].slice(-3)
      if (userCache.roles[0] === 'admin') {
        traveller['legalNo'] = '000000'
        traveller['teamNo'] = '00000' + dateStr
        traveller['tickOrigin'] = 0
      } else {
        traveller['legalNo'] = legalNo
        traveller['teamNo'] = legalNo.substr(0, 5) + dateStr
        traveller['tickOrigin'] = 1
      }
      traveller['startDate'] = props.voyData[0]['voyDate'] + ' ' + props.voyData[0]['startTime']
      traveller['startVoyNo'] = props.voyData[0]['voyNo']
      traveller['startSeat'] = traveller['seatType'] === 0 ? 'VIP座' : traveller['seatType'] === 1 ? '一等座' : '二等座'
      traveller['state'] = '未检票'
      traveller['payType'] = '现金'
      traveller['isGuide'] = '否'
      traveller['tickType'] = traveller['ticketType'] === 0 ? '成人' : '儿童'
      traveller['travellerType'] = '散客'
      traveller['travelType'] = props.voyData[0]['startPort'] === 0 ? '散客出境' : '散客入境'
      traveller['orderName'] = username
      traveller['identity'] = '旅客'
    })
    service({
      method: 'post',
      url: 'ticket/touristBook/addTickets',
      data: JSON.stringify(chooseTravellers.value),
    }).then((response) => {
      if (response.data.code === 0) {
        ElMessage.success(response.data.msg)
        props.orderData(chooseTravellers.value)
        props.nextStep()
      }
    })
  }

  onMounted(() => {
    setTimeout(() => {
      loading.value = false
      queryTravellers()
    }, 200)
  })
</script>

<style lang="scss" scoped>
  @import '../index';
</style>
