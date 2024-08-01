export const columns = [
  {
    type: 'selection',
    span: 8,
    align: 'center',
    fixed: 'left',
    selection: true,
  },
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
  },
  {
    name: 'passportNo',
    label: '护照号',
    search: true,
    valueType: 'input',
    align: 'center',
    span: 8,
  },
  {
    name: 'trName',
    label: '姓名',
    search: true,
    valueType: 'input',
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
    width: 120,
  },
  {
    name: 'shipName',
    label: '具体船名',
    align: 'center',
    span: 8,
    width: 120,
  },
  {
    name: 'startDate',
    label: '出发时间',
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
    label: '票价',
    align: 'center',
    span: 8,
    width: 120,
  },
  {
    name: 'operation',
    slot: true,
    align: 'center',
    fixed: 'right',
    label: '操作',
    width: 300,
  },
]