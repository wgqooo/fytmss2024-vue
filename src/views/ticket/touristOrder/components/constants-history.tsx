export const columns = [
  {
    type: 'index',
    label: '序号',
    span: 8,
    width: 55,
    align: 'center',
    fixed: 'left',
    // 添加 index 属性用于渲染序号
    index: true,
  },
  {
    name: 'tickNo',
    label: '票号',
    align: 'center',
    span: 8,
    width: 220,
  },
  {
    name: 'passportNo',
    label: '护照号',
    search: true,
    valueType: 'input',
    width: 150,
    align: 'center',
    span: 8,
  },
  {
    name: 'trName',
    label: '姓名',
    search: true,
    valueType: 'date-picker',
    align: 'center',
    span: 8,
    width: 180,
  },
  {
    name: 'travelType',
    label: '出入境',
    align: 'center',
    span: 8,
    width: 100,
  },
  {
    name: 'startVoyNo',
    label: '出发航次',
    align: 'center',
    span: 8,
    width: 100,
  },
  {
    name: 'startDate',
    label: '出发时间',
    width: 200,
    align: 'center',
    span: 8,
  },
  {
    name: 'tickType',
    label: '船票类型',
    align: 'center',
    span: 8,
    width: 100,
  },
  {
    name: 'startSeat',
    label: '座位等级',
    align: 'center',
    span: 8,
    width: 100,
  },
  {
    name: 'startSeatNo',
    label: '座位号',
    align: 'center',
    span: 8,
    width: 100,
  },
  {
    name: 'state',
    color: 'blue',
    label: '状态',
    align: 'center',
    span: 8,
    width: 100,
  },
  {
    name: 'tickCost',
    color: 'red',
    label: '订票金额',
    align: 'center',
    span: 8,
    width: 120,
  },
  {
    name: 'tickRefund',
    label: '退票金额',
    align: 'center',
    span: 8,
    width: 120,
  },
]
